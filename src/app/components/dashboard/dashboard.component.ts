import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { OrganizationService } from '../../services/organization.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Organization } from '../../shared/types';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Organizations</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="org-grid">
            <mat-card
              *ngFor="let org of organizations$ | async"
              class="org-card"
            >
              <mat-card-header>
                <mat-card-title>{{ org.name }}</mat-card-title>
                <mat-card-subtitle>{{ org.description }}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-actions>
                <button mat-button [routerLink]="['/organization', org.id]">
                  View Details
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="org-card new-org" (click)="createNewOrg()">
              <mat-icon>add</mat-icon>
              <span>Create New Organization</span>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 20px;
      }
      .org-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
      }
      .org-card {
        cursor: pointer;
      }
      .new-org {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  organizations$: Observable<Organization[]>;

  constructor(
    private orgService: OrganizationService,
    private auth: AuthService,
    private router: Router // ✅ Fixed: Imported and Injected Correctly
  ) {}

  ngOnInit(): void {
    this.organizations$ = this.auth.user$.pipe(
      switchMap((user) =>
        user ? this.orgService.getUserOrganizations(user.uid) : []
      )
    );
  }

  createNewOrg(): void {
    this.router.navigate(['/organization/create']);
  }
}
