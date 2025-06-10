import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-wedding-modal',
  standalone: true,
  imports: [],
  template:`
  <div mat-dialog-content>

  

  </div>
  `,
  styles:``
})
export class WeddingModalComponent {
  constructor(
    public dialogRef: MatDialogRef<WeddingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { guestName: string }
  ) {}
}
