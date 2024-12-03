import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-drone-dialog',
  templateUrl: './add-drone-dialog.component.html',
  styleUrls: ['./add-drone-dialog.component.scss']
})
export class AddDroneDialogComponent {
  droneForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddDroneDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.droneForm = this.formBuilder.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      status: ['available', Validators.required],
      batteryLevel: [100],
    });
  }

  onSave() {
    if (this.droneForm.valid) {
      this.dialogRef.close(this.droneForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
