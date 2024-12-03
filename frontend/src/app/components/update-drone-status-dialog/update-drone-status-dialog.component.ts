import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-drone-status-dialog',
  templateUrl: './update-drone-status-dialog.component.html',
  styleUrls: ['./update-drone-status-dialog.component.scss'],
})
export class UpdateDroneStatusDialogComponent {
  selectedStatus: string;

  constructor(
    private dialogRef: MatDialogRef<UpdateDroneStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedStatus = data.drone.status;
  }

  onSave() {
    this.dialogRef.close(this.selectedStatus);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
