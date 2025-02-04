import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
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
