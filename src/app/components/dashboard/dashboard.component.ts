import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Organization, Member } from '../../shared/types';
import { OrganizationService } from '../../services/organization.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <nav class="sidebar" [class.sidebar-mobile]="isMobileMenuOpen">
        <div class="mobile-header">
          <div class="logo-container">
            <h1>OMD</h1>
          </div>
          <button class="menu-toggle" (click)="toggleMobileMenu()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <ul class="nav-items">
          <li
            *ngFor="let item of menuItems"
            [class.active]="item.active"
            class="nav-item"
            (click)="onNavItemClick(item)"
          >
            <i [class]="item.icon"></i>
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Mobile Header -->
        <div class="mobile-menu-toggle">
          <button (click)="toggleMobileMenu()">
            <i class="fas fa-bars"></i>
          </button>
        </div>

        <!-- Header -->
        <header class="dashboard-header">
          <div class="header-welcome">
            <h1>Hi {{ currentUser?.displayName || 'User' }},</h1>
            <p>you can manage your whole team from here.</p>
          </div>
          <div class="header-actions">
            <div class="search-container">
              <input type="search" placeholder="Search..." />
            </div>
            <div class="user-profile">
              <img
                [src]="currentUser?.photoURL || 'assets/default-avatar.png'"
                [alt]="currentUser?.displayName || 'Profile'"
              />
            </div>
          </div>
        </header>

        <!-- Organizations Grid -->
        <div class="organizations-grid">
          <div *ngFor="let org of organizations$ | async" class="org-card">
            <div class="org-header">
              <h2>{{ org.name }}</h2>
              <span class="created-date"
                >Created {{ org.createdAt | date }}</span
              >
            </div>
            <p class="org-description">{{ org.description }}</p>
            <div class="org-footer">
              <span class="member-count">
                {{ getMemberCount(org.id) | async }} members
              </span>
              <button [routerLink]="['/organization', org.id]" class="view-btn">
                View Details →
              </button>
            </div>
          </div>

          <!-- Create New Card -->
          <div
            class="org-card create-card"
            [routerLink]="['/organization/create']"
          >
            <div class="create-content">
              <i class="fas fa-plus-circle"></i>
              <span>Create New Organization</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <section class="activity-section">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div
              *ngFor="let member of recentMembers$ | async"
              class="activity-item"
            >
              <img
                [src]="member.photoURL || 'assets/default-avatar.png'"
                [alt]="member.displayName"
              />
              <div class="activity-details">
                <p>
                  {{ member.displayName }} joined {{ member.organizationName }}
                </p>
                <span>{{ member.joinedAt | date : 'short' }}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Mobile Menu Overlay -->
      <div
        class="mobile-overlay"
        [class.active]="isMobileMenuOpen"
        (click)="toggleMobileMenu()"
      ></div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  organizations$: Observable<Organization[]>;
  recentMembers$: Observable<any[]>;
  currentUser: any;
  isMobileMenuOpen = false;

  menuItems = [
    { label: 'Home', icon: 'fas fa-home', active: true },
    { label: 'Create', icon: 'fas fa-plus' },
    { label: 'Details', icon: 'fas fa-info-circle' },
    { label: 'User', icon: 'fas fa-user' },
    { label: 'Profile', icon: 'fas fa-user' },
    {
      label: 'Settings',
      icon: 'fas fa-cog',
      routerLink: '/organization/settings',
    },
  ];

  constructor(
    private orgService: OrganizationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.organizations$ = this.orgService.getUserOrganizations(user.uid);
      }
    });
  }

  getMemberCount(orgId: string): Observable<number> {
    return this.orgService.getMemberCount(orgId);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onNavItemClick(item: any): void {
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
    }
    this.toggleMobileMenu();
  }
}
