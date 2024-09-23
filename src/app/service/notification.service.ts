import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 10000, // Duration in milliseconds
      panelClass: ['success-snackbar'], // Custom class for styling
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 10000,
      panelClass: ['error-snackbar'], // Custom class for styling
    });
  }
}
