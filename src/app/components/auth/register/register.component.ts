import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { passwordMatchValidator } from '../../../utils/password-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.registerForm.valid) {
      try {
        const { email, password } = this.registerForm.value;
        await this.authService.emailSignUp(email, password);
      } catch (error: any) {
        this.errorMessage =
          error.message || 'Registration failed. Please try again.';
      }
    }
  }

  async googleSignUp(): Promise<void> {
    try {
      await this.authService.googleSignIn();
    } catch (error: any) {
      this.errorMessage =
        error.message || 'Google sign up failed. Please try again.';
    }
  }
}
