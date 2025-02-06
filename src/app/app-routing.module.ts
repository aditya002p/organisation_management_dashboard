import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrganizationDetailsComponent } from './components/organization/details/organization-details.component';
import { OrganizationSettingsComponent } from './components/organization/settings/organization-settings.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings.component';
import { CreateOrganizationComponent } from './components/organization/create/create-organization.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
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
    path: 'organization/:id',
    component: OrganizationDetailsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'settings',
        component: OrganizationSettingsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['owner'] },
      },
    ],
  },
  {
    path: 'profile',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
