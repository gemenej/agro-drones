import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppRoutingModule } from './app-routing.module';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AppComponent } from './app.component';
import { FieldMapComponent } from './components/field-map/field-map.component';
import { DroneListComponent } from './components/drone-list/drone-list.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateTaskDialogComponent } from './components/create-task-dialog/create-task-dialog.component';
import { AddDroneDialogComponent } from './components/add-drone-dialog/add-drone-dialog.component';
import { DroneDetailsDialogComponent } from './components/drone-details-dialog/drone-details-dialog.component';
import { UpdateDroneStatusDialogComponent } from './components/update-drone-status-dialog/update-drone-status-dialog.component';
import { DeleteDroneDialogComponent } from './components/delete-drone-dialog/delete-drone-dialog.component';
import { DeleteTaskDialogComponent } from './components/delete-task-dialog/delete-task-dialog.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { UpdateTaskDialogComponent } from './components/update-task-dialog/update-task-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    FieldMapComponent,
    DroneListComponent,
    TaskManagementComponent,
    AddDroneDialogComponent,
    DroneDetailsDialogComponent,
    CreateTaskDialogComponent,
    UpdateDroneStatusDialogComponent,
    DeleteDroneDialogComponent,
    DeleteTaskDialogComponent,
    HomeComponent,
    UpdateTaskDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatProgressBarModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatButtonToggleModule,

    // NgBootstrap
    NgbModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
