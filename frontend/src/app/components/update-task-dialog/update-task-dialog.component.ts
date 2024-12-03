import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-update-task-dialog',
  templateUrl: './update-task-dialog.component.html',
  styleUrl: './update-task-dialog.component.scss',
})
export class UpdateTaskDialogComponent {
  selectedTask: Task;
  startHour: string;
  constructor(
    public dialogRef: MatDialogRef<UpdateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.selectedTask = data;
    console.log(data);
    let date = new Date(data.plannedDate);
    this.startHour =
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0');
    console.log(this.startHour);
  }

  onSave() {
    this.selectedTask = {
      ...this.selectedTask,
      startHour: this.startHour,
    };
    this.dialogRef.close(this.selectedTask);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
