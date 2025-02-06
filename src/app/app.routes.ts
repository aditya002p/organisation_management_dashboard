import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateOrganizationComponent } from './components/organization/create/create-organization.component';
import { OrganizationSettingsComponent } from './components/organization/settings/organization-settings.component';
import { OrganizationDetailsComponent } from './components/organization/details/organization-details.component';
import { UserManagementComponent } from './components/organization/user-management/user-management.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'organization/create',
    component: CreateOrganizationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'organization/details',
    component: OrganizationDetailsComponent,
  },
  {
    path: 'organization/user',
    component: UserManagementComponent,
  },
  {
    path: 'profile',
    component: ProfileSettingsComponent,
  },
  {
    path: 'organization/settings',
    component: OrganizationSettingsComponent,
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
