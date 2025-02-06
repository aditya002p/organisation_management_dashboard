import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { OrganizationService } from '../../../services/organization.service';
import { UserManagementComponent } from '../user-management/user-management.component';
import { OrganizationSettingsComponent } from '../settings/organization-settings.component';

@Component({
  selector: 'app-organization-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    AsyncPipe,
    DatePipe,
    UserManagementComponent,
    OrganizationSettingsComponent,
  ],
  template: `
    <div
      class="organization-details-container"
      *ngIf="organization$ | async as org"
    >
      <mat-card class="org-card">
        <mat-card-header>
          <mat-card-title>{{ org.name }}</mat-card-title>
          <mat-card-subtitle>{{ org.description }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Overview">
              <div class="org-info">
                <p><strong>Created:</strong> {{ org.createdAt | date }}</p>
                <p><strong>Members:</strong> {{ memberCount$ | async }}</p>
              </div>
            </mat-tab>

            <mat-tab label="Members" *ngIf="isAdmin$ | async">
              <app-user-management
                [organizationId]="org.id"
              ></app-user-management>
            </mat-tab>

            <mat-tab label="Settings" *ngIf="isOwner$ | async">
              <app-organization-settings
                [organization]="org"
              ></app-organization-settings>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>

        <mat-card-actions class="action-buttons">
          <button
            mat-raised-button
            color="primary"
            (click)="editOrganization()"
          >
            Edit
          </button>
          <button mat-raised-button color="warn" (click)="deleteOrganization()">
            Delete
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .organization-details-container {
        display: flex;
        justify-content: center;
        padding: 20px;
      }

      .org-card {
        width: 100%;
        max-width: 800px;
        padding: 20px;
      }

      .org-info {
        padding: 15px;
      }

      .action-buttons {
        display: flex;
        justify-content: space-between;
        padding: 15px;
      }

      @media (max-width: 768px) {
        .org-card {
          width: 100%;
        }

        .action-buttons {
          flex-direction: column;
          gap: 10px;
        }
      }
    `,
  ],
})
export class OrganizationDetailsComponent implements OnInit {
  organization$: Observable<any>;
  memberCount$: Observable<number>;
  isAdmin$: Observable<boolean>;
  isOwner$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private orgService: OrganizationService
  ) {}

  ngOnInit() {
    const orgId = this.route.snapshot.params.id;
    this.organization$ = this.orgService.getOrganization(orgId);
    this.memberCount$ = this.orgService.getMemberCount(orgId);
    this.isAdmin$ = this.orgService.isUserAdmin(orgId);
    this.isOwner$ = this.orgService.isUserOwner(orgId);
  }

  editOrganization() {
    console.log('Edit organization clicked');
  }

  deleteOrganization() {
    if (confirm('Are you sure you want to delete this organization?')) {
      console.log('Organization deleted');
    }
  }
}
