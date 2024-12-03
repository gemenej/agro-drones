import { Component, OnInit } from '@angular/core';
import { DroneService } from '../../services/drone.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddDroneDialogComponent } from '../add-drone-dialog/add-drone-dialog.component';
import { DroneDetailsDialogComponent } from '../drone-details-dialog/drone-details-dialog.component';
import { UpdateDroneStatusDialogComponent } from '../update-drone-status-dialog/update-drone-status-dialog.component';
import { DeleteDroneDialogComponent } from '../delete-drone-dialog/delete-drone-dialog.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Drone } from '../../models/drone.model';

@Component({
  selector: 'app-drone-list',
  templateUrl: './drone-list.component.html',
  styleUrls: ['./drone-list.component.scss'],
})
export class DroneListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'batteryLevel', 'actions'];
  dataSource: MatTableDataSource<Drone> = new MatTableDataSource<Drone>();

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private droneService: DroneService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDrones();
  }

  loadDrones() {
    this.droneService.getDrones().subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource(data.drones);
      },
      (error) => {
        console.error('Помилка завантаження дронів', error);
        this.snackBar.open('Помилка завантаження дронів', 'Закрити', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
        });
      }
    );
  }

  openAddDroneDialog() {
    const dialogRef = this.dialog.open(AddDroneDialogComponent, {
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.droneService.createDrone(result).subscribe(
          () => {
            this.loadDrones();
            this.snackBar.open('Дрон успішно створено', 'Закрити', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000,
            });
          },
          (error) => {
            console.error('Помилка створення дрону', error);
            this.snackBar.open('Помилка створення дрону', 'Закрити', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000,
            });
          }
        );
      }
    });
  }

  viewDroneDetails(drone: Drone) {
    const dialogRef = this.dialog.open(DroneDetailsDialogComponent, {
      width: '500px',
      data: drone,
    });
  }

  openUpdateDroneStatusDialog(drone: Drone) {
    const dialogRef = this.dialog.open(UpdateDroneStatusDialogComponent, {
      width: '320px',
      data: { drone },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.droneService.updateDroneStatus(drone._id, result).subscribe(
          () => {
            this.loadDrones();
            this.snackBar.open('Статус дрону успішно оновлено', 'Закрити', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000,
            });
          },
          (error) => {
            console.error('Помилка оновлення статусу дрону', error);
            this.snackBar.open('Помилка оновлення статусу дрону', 'Закрити', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000,
            });
          }
        );
      }
    });
  }

  openDeleteDialog(drone: Drone): void {
    const dialogRef = this.dialog.open(DeleteDroneDialogComponent, {
      data: drone,
    });

    dialogRef.afterClosed().subscribe((result) => {
      result
        ? this.deleteDrone(drone._id)
        : console.log('The dialog was closed without changes');
    });
  }

  deleteDrone(droneId: string) {
    this.droneService.deleteDrone(droneId).subscribe(
      () => {
        this.loadDrones();
        this.snackBar.open('Дрон успішно видалено', 'Закрити', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
        });
      },
      (error) => {
        console.error('Помилка видалення дрону', error);
        const errorMessage = error.error.message || 'Невідома помилка';
        this.snackBar.open(errorMessage, 'Закрити', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
        });
      }
    );
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      available: 'Доступний',
      in_mission: 'В місії',
      charging: 'Заряджається',
      maintenance: 'Технічне обслуговування',
    };
    return statusLabels[status] || status;
  }

  getBatteryColor(batteryLevel: number) {
    if (batteryLevel > 70) return 'primary';
    if (batteryLevel > 30) return 'accent';
    return 'warn';
  }
}
