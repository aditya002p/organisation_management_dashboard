import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <app-navbar></app-navbar>
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .app-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Organization Management Dashboard';
}
