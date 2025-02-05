import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-profile-settings',
  standalone: false,
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
  user$: Observable<any>;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      if (user) {
        this.profileForm.setValue({
          displayName: [user.displayName || ' ', Validators.required],
          email: [{ value: user.email || ' ', disabled: true }],
        });
      }
    });
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      try {
        await this.auth.updateProfile({
          displayName: this.profileForm.value.displayName,
        });
        console.log('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }
}
