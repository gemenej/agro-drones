import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Drone } from '../../models/drone.model';

@Component({
  selector: 'app-delete-drone-dialog',
  templateUrl: './delete-drone-dialog.component.html',
  styleUrls: ['./delete-drone-dialog.component.scss'],
})
export class DeleteDroneDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDroneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Drone
  ) {}

  submit() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
