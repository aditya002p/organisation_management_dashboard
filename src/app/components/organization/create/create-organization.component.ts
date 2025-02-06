import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-organization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="create-org-container">
      <!-- Sidebar (reuse from dashboard) -->
      <nav class="sidebar">
        <!-- Sidebar content -->
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <div class="header">
            <h1>Create New Organization</h1>
            <button class="close-btn" routerLink="/dashboard">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form [formGroup]="orgForm" (ngSubmit)="onSubmit()" class="org-form">
            <!-- Organization Name -->
            <div class="form-group">
              <label for="name">Organization Name</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="Enter organization name"
              />
              <div
                *ngIf="
                  orgForm.get('name').touched && orgForm.get('name').invalid
                "
                class="error-message"
              >
                Organization name is required
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                formControlName="description"
                rows="4"
                placeholder="Enter organization description"
              ></textarea>
            </div>

            <!-- Submit Buttons -->
            <div class="form-actions">
              <button
                type="button"
                routerLink="/dashboard"
                class="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="orgForm.invalid || isSubmitting"
                class="btn-primary"
              >
                {{ isSubmitting ? 'Creating...' : 'Create Organization' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./create-organization.component.scss'],
})
export class CreateOrganizationComponent {
  orgForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private orgService: OrganizationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.orgForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.orgForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      try {
        const user = await this.authService.user$.pipe().toPromise();
        if (!user) throw new Error('No authenticated user');

        const orgId = await this.orgService.createOrganization(
          this.orgForm.value,
          user.uid
        );

        this.router.navigate(['/organization', orgId]);
      } catch (error) {
        console.error('Error creating organization:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
