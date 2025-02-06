import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { OrganizationService } from '../../../services/organization.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { Member } from '../../../shared/types';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  @Input() organizationId!: string;

  userForm: FormGroup;
  members$: Observable<Member[]>;
  displayedColumns = ['email', 'role', 'joinedAt', 'actions'];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private orgService: OrganizationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['member', Validators.required],
    });
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.members$ = this.orgService.getOrganizationMembers(this.organizationId);
  }

  async addUser() {
    if (this.userForm.valid) {
      this.isLoading = true;
      try {
        const { email, role } = this.userForm.value;
        await this.orgService.addMemberByEmail(
          this.organizationId,
          email,
          role
        );
        this.snackBar.open('User added successfully', 'Close', {
          duration: 3000,
        });
        this.userForm.reset({ role: 'member' });
      } catch (error) {
        this.snackBar.open('Error adding user', 'Close', { duration: 3000 });
      } finally {
        this.isLoading = false;
      }
    }
  }

  async updateRole(memberId: string, newRole: string) {
    try {
      await this.orgService.updateMemberRole(
        this.organizationId,
        memberId,
        newRole
      );
      this.snackBar.open('Role updated successfully', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      this.snackBar.open('Error updating role', 'Close', { duration: 3000 });
    }
  }

  async removeMember(memberId: string, memberEmail: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remove Member',
        message: `Are you sure you want to remove ${memberEmail} from the organization?`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.orgService.removeMember(this.organizationId, memberId);
          this.snackBar.open('Member removed successfully', 'Close', {
            duration: 3000,
          });
        } catch (error) {
          this.snackBar.open('Error removing member', 'Close', {
            duration: 3000,
          });
        }
      }
    });
  }
}
