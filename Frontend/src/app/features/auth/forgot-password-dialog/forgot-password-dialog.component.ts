import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forgot-password-dialog.component.html',
  styleUrl: './forgot-password-dialog.component.scss',
})
export class ForgotPasswordDialog {
  private readonly dialogRef = inject<MatDialogRef<ForgotPasswordDialog>>(MatDialogRef);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  protected readonly sending = signal(false);

  protected async send(): Promise<void> {
    if (this.sending()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    this.sending.set(false);

    const email = this.form.getRawValue().email;
    this.dialogRef.close();
    this.snackBar.open(
      `Solicitação registrada para ${email}. Enviaremos o link de recuperação assim que o serviço de e-mail estiver conectado.`,
      'Fechar',
      { duration: 8000, horizontalPosition: 'center', verticalPosition: 'bottom' },
    );
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
