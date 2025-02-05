import { Component, Input, OnInit } from '@angular/core';
import { OrganizationService } from '../../../services/organization.service';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [MatFormFieldModule],
  template: `
    <div class="user-management">
      <div class="add-user">
        <mat-form-field>
          <input matInput placeholder="User Email" #userEmail />
        </mat-form-field>

        <mat-form-field>
          <mat-select #role value="member">
            <mat-option value="member">Member</mat-option>
            <mat-option value="admin">Admin</mat-option>
          </mat-select>
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          (click)="addUser(userEmail.value, role.value)"
        >
          Add User
        </button>
      </div>

      <table mat-table [dataSource]="members$ | async" class="member-table">
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let member">{{ member.email }}</td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let member">
            <mat-select
              [(value)]="member.role"
              (selectionChange)="updateRole(member.id, $event.value)"
              [disabled]="member.role === 'owner'"
            >
              <mat-option value="member">Member</mat-option>
              <mat-option value="admin">Admin</mat-option>
              <mat-option value="owner">Owner</mat-option>
            </mat-select>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let member">
            <button
              mat-icon-button
              color="warn"
              (click)="removeMember(member.id)"
              [disabled]="member.role === 'owner'"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
  styles: [
    `
      .user-management {
        padding: 20px;
      }
      .add-user {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
      }
      .member-table {
        width: 100%;
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  @Input() organizationId: string;
  members$: Observable<any[]>;
  displayedColumns = ['email', 'role', 'actions'];

  constructor(private orgService: OrganizationService) {}

  ngOnInit() {
    this.members$ = this.orgService.getOrganizationMembers(this.organizationId);
  }

  async addUser(email: string, role: string) {
    await this.orgService.addMemberByEmail(this.organizationId, email, role);
  }

  async updateRole(memberId: string, newRole: string) {
    await this.orgService.updateMemberRole(
      this.organizationId,
      memberId,
      newRole
    );
  }

  async removeMember(memberId: string) {
    if (confirm('Are you sure you want to remove this member?')) {
      await this.orgService.removeMember(this.organizationId, memberId);
    }
  }
}
