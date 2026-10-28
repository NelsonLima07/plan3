import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { BrandPanel } from '../brand-panel/brand-panel.component';
import { ForgotPasswordDialog } from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    BrandPanel,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  protected readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly loading = signal(false);
  protected readonly hidePassword = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected async submit(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      const { username, password } = this.form.getRawValue();
      await this.authService.login(username, password);
      await this.router.navigateByUrl(this.resolveRedirect());
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.',
      );
      this.form.controls.password.reset();
    } finally {
      this.loading.set(false);
    }
  }

  protected togglePassword(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  protected clearError(): void {
    if (this.errorMessage()) {
      this.errorMessage.set(null);
    }
  }

  protected openForgotPassword(): void {
    this.dialog.open(ForgotPasswordDialog, {
      width: '440px',
      maxWidth: '92vw',
      autoFocus: 'dialog',
    });
  }

  private resolveRedirect(): string {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    return redirect && redirect.startsWith('/') ? redirect : '/home';
  }
}
