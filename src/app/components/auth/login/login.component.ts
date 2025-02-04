import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <input
                matInput
                placeholder="Email"
                formControlName="email"
                type="email"
              />
              <mat-error *ngIf="loginForm.get('email').hasError('required')">
                Email is required
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <input
                matInput
                placeholder="Password"
                formControlName="password"
                type="password"
              />
              <mat-error *ngIf="loginForm.get('password').hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="loginForm.invalid"
            >
              Login
            </button>
          </form>

          <button mat-stroked-button (click)="googleLogin()">
            Login with Google
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      mat-card {
        max-width: 400px;
        width: 100%;
        padding: 20px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await this.auth.emailSignIn(email, password);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  }

  async googleLogin() {
    try {
      await this.auth.googleSignIn();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }
}
