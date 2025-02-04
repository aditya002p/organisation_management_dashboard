import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
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
  constructor(public auth: AuthService) {}

  async logout() {
    await this.auth.signOut();
  }
}
