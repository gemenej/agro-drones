import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Drone } from '../../models/drone.model';
import { Field } from '../../models/field.model';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss'],
})
export class CreateTaskDialogComponent implements OnInit {
  taskForm: FormGroup = new FormGroup({});
  errorStartHourMessage = '';

  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { drones: Drone[]; fields: Field[] },
    private formBuilder: FormBuilder
  ) {
    this.taskForm = this.formBuilder.group({
      drone: ['', Validators.required],
      field: ['', Validators.required],
      operation: ['', Validators.required],
      status: ['pending', Validators.required],
      startTime: [new Date(), Validators.required],
      startDay: [new Date(), Validators.required],
      startHour: [
        '13:00',
        [
          Validators.required,
          Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        ],
      ],
      period: [1, Validators.required],
    });
  }

  get startHour(): FormControl {
    return this.taskForm.get('startHour') as FormControl;
  }
  set startHour(value: string) {
    this.startHour.setValue(value);
  }
  updateStartHourMessage() {
    if (this.startHour.hasError('pattern')) {
      this.errorStartHourMessage = 'Невірний формат часу';
    }
    if (this.startHour.hasError('required')) {
      this.errorStartHourMessage = "Це поле обов'язкове";
    }
  }

  ngOnInit() {
    // No changes needed
  }
  onSave() {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }

  getDroneStatusLabel(status: string): string {
    const statusLabels: {[key: string]: string} = {
      'available': 'Доступний',
      'in_mission': 'В місії',
      'charging': 'Заряджається',
      'maintenance': 'Технічне обслуговування'
    };
    return statusLabels[status] || status;
  }
}
