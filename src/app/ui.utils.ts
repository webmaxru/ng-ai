import { MatSnackBar } from '@angular/material/snack-bar';

export function showSuccess(
  snackBar: MatSnackBar,
  message: string,
  action: string = 'Close',
  duration: number = 3000
) {
  snackBar.open(message, action, {
    duration: duration,
    panelClass: ['success-snackbar']
  });
}

export function showError(
  snackBar: MatSnackBar,
  error: any,
  action: string = 'Close',
  duration: number = 3000
) {
  snackBar.open(error.toString() || 'Unknown error', action, {
    duration: duration,
    panelClass: ['error-snackbar']
  });
}

export async function copyFromBuffer(snackBar: MatSnackBar, setText: (text: string) => void) {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
    } catch (err) {
      showError(snackBar, `Failed to read clipboard contents: ${err}`);
    }
  }
  