import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Drone } from '../../models/drone.model';

@Component({
  selector: 'app-drone-details-dialog',
  templateUrl: './drone-details-dialog.component.html',
  styleUrls: ['./drone-details-dialog.component.scss']
})
export class DroneDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public drone: Drone,
    private dialogRef: MatDialogRef<DroneDetailsDialogComponent>
  ) {}

  getStatusLabel(status: string): string {
    const statusLabels: {[key: string]: string} = {
      'available': 'Доступний',
      'in_mission': 'В місії',
      'charging': 'Заряджається',
      'maintenance': 'Технічне обслуговування'
    };
    return statusLabels[status] || status;
  }

  getBatteryColor(batteryLevel: number) {
    if (batteryLevel > 70) return 'primary';
    if (batteryLevel > 30) return 'accent';
    return 'warn';
  }

  onClose() {
    this.dialogRef.close();
  }
}
