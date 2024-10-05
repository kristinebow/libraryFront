import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-success-overlay',
  standalone: true,
  imports: [
    MatButton,
    RouterLink
  ],
  templateUrl: './success-overlay.component.html',
  styleUrl: './success-overlay.component.css'
})
export class SuccessOverlayComponent {
  constructor(private dialogRef: MatDialogRef<SuccessOverlayComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
