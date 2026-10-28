import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Avisos rápidos padronizados do portal (snackbars). */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly snackBar = inject(MatSnackBar);

  /** Informa que o recurso ainda será construído. */
  comingSoon(feature: string): void {
    this.message(`${feature}: disponível nas próximas etapas do portal.`);
  }

  /** Aviso de bloqueio/atenção, com duração maior. */
  warn(message: string): void {
    this.message(message, 6000);
  }

  private message(message: string, duration = 4000): void {
    this.snackBar.open(message, 'Entendi', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
