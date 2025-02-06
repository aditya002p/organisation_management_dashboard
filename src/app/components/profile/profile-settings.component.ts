// src/app/components/profile/profile-settings.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
  profileForm: FormGroup;
  user$: Observable<User | null>;
  isLoading = false;
  isEditMode = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.user$ = this.auth.user$;
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }],
      photoURL: [''],
    });
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
        });
      }
    });
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      try {
        await this.auth.updateUserData({
          displayName: this.profileForm.value.displayName,
          photoURL: this.profileForm.value.photoURL,
        });
        this.isEditMode = false;
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.user$.subscribe((user) => {
        if (user) {
          this.profileForm.patchValue({
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          });
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
