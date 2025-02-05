import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-organization-details',
  standalone: false,
  template: `
    <div class="org-details" *ngIf="organization$ | async as org">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ org.name }}</mat-card-title>
          <mat-card-subtitle>{{ org.description }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Overview">
              <div class="org-info">
                <p>Created: {{ org.createdAt | date }}</p>
                <p>Members: {{ memberCount$ | async }}</p>
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
      </mat-card>
    </div>
  `,
  styles: [
    `
      .org-details {
        padding: 20px;
      }
      .org-info {
        padding: 20px;
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
}
