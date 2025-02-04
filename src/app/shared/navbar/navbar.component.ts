import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar color="primary">
      <span class="brand" routerLink="/dashboard">Org Manager</span>

      <span class="spacer"></span>

      <ng-container *ngIf="auth.user$ | async as user">
        <button mat-button [matMenuTriggerFor]="userMenu">
          <img
            [src]="user.photoURL || '/assets/default-avatar.png'"
            class="avatar"
            alt="User avatar"
          />
          {{ user.displayName }}
        </button>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
      .brand {
        cursor: pointer;
        font-size: 1.2em;
      }
      .avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 8px;
      }
    `,
  ],
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
