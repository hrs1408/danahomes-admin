import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthResponse, LoginCredentials, User } from '../interfaces/auth.interface';
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
          next: (response) => {
            localStorage.setItem(environment.tokenKey, response.access_token);
            localStorage.setItem(environment.userKey, JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            this.snackBar.open('Login successful', 'Close', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open(error.error.message || 'Login failed', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        })
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
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(environment.userKey);
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }
}
