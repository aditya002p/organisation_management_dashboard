import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-settings',
  template: `
    <div class="profile-settings" *ngIf="user$ | async as user">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Profile Settings</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <input
                matInput
                placeholder="Display Name"
                formControlName="displayName"
              />
            </mat-form-field>

            <mat-form-field>
              <input
                matInput
                placeholder="Email"
                formControlName="email"
                [readonly]="true"
              />
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="profileForm.invalid || profileForm.pristine"
            >
              Save Changes
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .profile-settings {
        padding: 20px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 400px;
        margin: 0 auto;
      }
    `,
  ],
})
export class ProfileSettingsComponent implements OnInit {
  profileForm: FormGroup;
  user$ = this.auth.user$;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.user$.subscribe((user) => {
      this.profileForm = this.fb.group({
        displayName: [user.displayName, Validators.required],
        email: [user.email],
      });
    });
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      await this.auth.updateProfile(this.profileForm.value);
    }
  }
}
