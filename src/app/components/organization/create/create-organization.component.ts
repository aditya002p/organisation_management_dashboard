import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from '../../../services/organization.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-create-organization',
  standalone: true,
  imports: [MatFormFieldModule, MatCardModule],
  template: `
    <mat-card class="create-org-card">
      <mat-card-header>
        <mat-card-title>Create New Organization</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="orgForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <input
              matInput
              placeholder="Organization Name"
              formControlName="name"
            />
            <mat-error *ngIf="orgForm.get('name').hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <textarea
              matInput
              placeholder="Description"
              formControlName="description"
              rows="4"
            >
            </textarea>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="orgForm.invalid"
          >
            Create Organization
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .create-org-card {
        max-width: 600px;
        margin: 20px auto;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class CreateOrganizationComponent {
  orgForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orgService: OrganizationService,
    private auth: AuthService,
    private router: Router
  ) {
    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  async onSubmit() {
    if (this.orgForm.valid) {
      try {
        const user = await firstValueFrom(this.auth.user$);
        const org = await this.orgService.createOrganization(
          this.orgForm.value,
          user.uid
        );
        this.router.navigate(['/organization', org.id]);
      } catch (error) {
        console.error('Error creating organization:', error);
      }
    }
  }
}
