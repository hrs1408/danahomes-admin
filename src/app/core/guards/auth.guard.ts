import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Store the attempted URL for redirecting
    const currentUrl = window.location.pathname;
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: currentUrl }
    });
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
