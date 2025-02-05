import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from '../../../services/organization.service';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-organization-settings',
  standalone: true,
  imports: [MatFormFieldModule],
  template: `
    <form
      [formGroup]="settingsForm"
      (ngSubmit)="onSubmit()"
      class="settings-form"
    >
      <mat-form-field>
        <input
          matInput
          placeholder="Organization Name"
          formControlName="name"
        />
      </mat-form-field>

      <mat-form-field>
        <textarea
          matInput
          placeholder="Description"
          formControlName="description"
        >
        </textarea>
      </mat-form-field>

      <div class="form-actions">
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="settingsForm.invalid || settingsForm.pristine"
        >
          Save Changes
        </button>

        <button
          mat-raised-button
          color="warn"
          type="button"
          (click)="deleteOrganization()"
        >
          Delete Organization
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .settings-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px;
        max-width: 600px;
      }
      .form-actions {
        display: flex;
        gap: 16px;
      }
    `,
  ],
})
export class OrganizationSettingsComponent implements OnInit {
  @Input() organization: any;
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orgService: OrganizationService
  ) {}

  ngOnInit() {
    this.settingsForm = this.fb.group({
      name: [this.organization.name, Validators.required],
      description: [this.organization.description],
    });
  }

  async onSubmit() {
    if (this.settingsForm.valid) {
      await this.orgService.updateOrganization(
        this.organization.id,
        this.settingsForm.value
      );
    }
  }

  async deleteOrganization() {
    if (confirm('Are you sure you want to delete this organization?')) {
      await this.orgService.deleteOrganization(this.organization.id);
    }
  }
}
