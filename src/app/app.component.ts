import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: Title,
    private authService: AuthService
  ) {
    this.titleService.setTitle(environment.appName);
  }

  ngOnInit() {
    // Update title based on route data
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let currentRoute = this.router.routerState.snapshot.root;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      const title = currentRoute.data['title'];
      if (title) {
        this.titleService.setTitle(`${title} - ${environment.appName}`);
      } else {
        this.titleService.setTitle(environment.appName);
      }
    });

    // Handle authentication status
    this.authService.currentUser$.subscribe(user => {
      if (!user && this.router.url !== '/auth/login') {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
