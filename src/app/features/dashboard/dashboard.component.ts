import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  cards = [
    { title: 'Users', count: 0, icon: 'people', link: '/users' },
    { title: 'Properties', count: 0, icon: 'home', link: '/properties' },
    { title: 'Posts', count: 0, icon: 'article', link: '/posts' },
    { title: 'Categories', count: 0, icon: 'category', link: '/categories' },
    { title: 'Tags', count: 0, icon: 'label', link: '/tags' }
  ];
}
