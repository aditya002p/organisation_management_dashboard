import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { OrganizationService } from '../services/organization.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private orgService: OrganizationService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const orgId = route.params.id;
    const requiredRoles = route.data.roles as string[];

    return this.orgService
      .getCurrentUserRole(orgId)
      .pipe(map((role) => requiredRoles.includes(role)));
  }
}
