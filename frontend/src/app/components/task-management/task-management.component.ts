import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { DroneService } from '../../services/drone.service';
import { FieldService } from '../../services/field.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';
import { Task } from '../../models/task.model';
import { Drone } from '../../models/drone.model';
import { Field } from '../../models/field.model';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';
import { UpdateTaskDialogComponent } from '../update-task-dialog/update-task-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss'],
})
export class TaskManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'drone',
    'field',
    'operation',
    'status',
    'startTime',
    'period',
    'actions',
  ];
  dataSource: MatTableDataSource<Task> = new MatTableDataSource();
  drones: Drone[] = [];
  fields: Field[] = [];

  constructor(
    private taskService: TaskService,
    private droneService: DroneService,
    private fieldService: FieldService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDrones();
    this.loadFields();
    this.loadTasks();
  }

  loadDrones() {
    this.droneService.getDrones().subscribe(
      (data: any) => (this.drones = data.drones),
      (error) => console.error('Помилка завантаження дронів', error)
    );
  }

  loadFields() {
    this.fieldService.getFields().subscribe(
      (fields) => (this.fields = fields),
      (error) => console.error('Помилка завантаження полів', error)
    );
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      (tasks: Task[]) => {
        this.dataSource = new MatTableDataSource(tasks);
        //this.dataSource.paginator = this.paginator;
      },
      (error) => console.error('Помилка завантаження завдань', error)
    );
  }

  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '500px',
      data: { drones: this.drones, fields: this.fields },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.createTask(result).subscribe(
          () => {
            this.loadDrones();
            this.loadFields();
            this.loadTasks();
            this.snackBar.open('Завдання успішно створено', 'Закрити', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
          },
          (error) => {
            console.error('Помилка створення завдання', error);
            const errorMessage = error.error.message || 'Невідома помилка';
            this.snackBar.open(`${errorMessage}`, 'Закрити', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
          }
        );
      }
    });
  }

  openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(DeleteTaskDialogComponent, {
      data: task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      result
        ? this.deleteTask(task._id)
        : console.log('The dialog was closed without changes');
    });
  }

  openUpdateTaskDialog(task: Task) {
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      width: '480px',
      data: task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.updateTask(task._id, result).subscribe(
          () => {
            this.loadTasks(),
              this.snackBar.open('Завдання успішно оновлено', 'Закрити', {
                horizontalPosition: 'end',
                verticalPosition: 'top',
                duration: 3000,
              });
          },
          (error) => {
            console.error('Помилка оновлення завдання', error);
            const errorMessage = error.error.message || 'Невідома помилка';
            this.snackBar.open(`${errorMessage}`, 'Закрити', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
          }
        );
      }
    });
  }

  updateTaskStatus(taskId: string, status: string) {
    this.taskService.updateTaskStatus(taskId, status).subscribe(
      () => {
        this.loadTasks();
        this.snackBar.open('Статус завдання успішно оновлено', 'Закрити', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
        });
      },
      (error) => {
        console.error('Помилка оновлення статусу', error);
        this.snackBar.open('Помилка оновлення статусу', 'Закрити', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
        });
      }
    );
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        this.loadDrones();
        this.loadFields();
        this.loadTasks();
        this.snackBar.open('Завдання успішно видалено', 'Закрити', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
        });
      },
      (error) => {
        console.error('Помилка видалення завдання', error);
        this.snackBar.open('Помилка видалення завдання', 'Закрити', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
        });
      }
    );
  }

  getDroneModel(droneId: string): string {
    const drone = this.drones.find((d) => d._id === droneId);
    return drone ? drone.name : 'Невідомий';
  }

  getFieldName(fieldId: string): string {
    const field = this.fields.find((f) => f._id === fieldId);
    return field ? field.name : 'Невідоме поле';
  }

  getTypeLabel(taskType: string): string {
    return this.taskService.getTaskTypeLabel(taskType);
  }

  getStatusLabel(status: string): string {
    return this.taskService.getTaskStatusLabel(status);
  }

  getTypeClass(operation: string): string {
    return this.taskService.getTypeClass(operation);
  }

  getStatusClass(status: string): string {
    return this.taskService.getStatusClass(status);
  }
}
