import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { OrganizationService } from '../../../services/organization.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// Import Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-organization-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule, // ✅ Add this module to fix the error
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.scss'],
})
export class OrganizationSettingsComponent implements OnInit {
  @Input() organization: any;
  settingsForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private orgService: OrganizationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.settingsForm = this.fb.group({
      name: [this.organization?.name || '', Validators.required],
      description: [this.organization?.description || ''],
      openMembership: [this.organization?.openMembership || false],
      inviteDomains: [this.organization?.inviteDomains || ''],
    });
  }

  async onSubmit() {
    if (this.settingsForm.invalid) return;

    this.isLoading = true;
    try {
      await this.orgService.updateOrganization(
        this.organization.id,
        this.settingsForm.value
      );
      this.snackBar.open('Settings updated successfully!', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      this.snackBar.open('Error updating settings', 'Close', {
        duration: 3000,
      });
    }
    this.isLoading = false;
  }

  async deleteOrganization() {
    if (confirm('Are you sure you want to delete this organization?')) {
      this.isLoading = true;
      try {
        await this.orgService.deleteOrganization(this.organization.id);
        this.snackBar.open('Organization deleted', 'Close', { duration: 3000 });
      } catch (error) {
        this.snackBar.open('Error deleting organization', 'Close', {
          duration: 3000,
        });
      }
      this.isLoading = false;
    }
  }
}
