import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
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
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
})
export class AppComponent {
  title = 'Organization Management Dashboard';
}
