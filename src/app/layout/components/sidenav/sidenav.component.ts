import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  appName = environment.appName;

  menuItems = [
    { icon: 'dashboard', text: 'Dashboard', link: '/dashboard' },
    { icon: 'people', text: 'Users', link: '/users' },
    { icon: 'info', text: 'Site Info', link: '/site-info' },
    { icon: 'category', text: 'Categories', link: '/categories' },
    { icon: 'label', text: 'Tags', link: '/tags' },
    { icon: 'home', text: 'Properties', link: '/properties' },
    { icon: 'article', text: 'Posts', link: '/posts' }
  ];

  constructor() {}
}
