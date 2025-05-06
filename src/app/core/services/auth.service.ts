import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthResponse, LoginCredentials, User, UserResponse } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadStoredUser();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap({
          next: (response: AuthResponse) => {
            localStorage.setItem(environment.tokenKey, response.data.access_token);
            this.snackBar.open('Login successful', 'Close', { duration: 3000 });
            // Fetch user info after successful login
            this.fetchUserInfo().subscribe();
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Login failed', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        })
      );
  }

  fetchUserInfo(): Observable<User | null> {
    return this.http.get<UserResponse>(`${environment.apiUrl}/auth/me`)
      .pipe(
        tap(response => {
          if (response.data) {
            localStorage.setItem(environment.userKey, JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
          }
        }),
        catchError(error => {
          console.error('Error fetching user info:', error);
          this.logout();
          return of(null);
        }),
        map(response => response?.data || null)
      );
  }

  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // If we have a token but no user info, try to fetch it
    if (!this.getCurrentUser()) {
      this.fetchUserInfo().subscribe();
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    const storedUser = localStorage.getItem(environment.userKey);

    if (token) {
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          this.logout();
          return;
        }
      } else {
        // If we have a token but no stored user, fetch user info
        this.fetchUserInfo().subscribe();
      }
    }
  }
}
