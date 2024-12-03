import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorEmailMessage = '';
  errorPasswordMessage = '';
  errorNameMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    this.signupForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { email, password, name } = this.signupForm.value;
      this.authService.signup(email, password, name).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Додайте обробку помилок тут
        }
      });
    }
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorEmailMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorEmailMessage = 'Not a valid email';
    } else {
      this.errorEmailMessage = '';
    }
  }

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorPasswordMessage = 'You must enter a value';
    } else {
      this.errorPasswordMessage = '';
    }
  }

  updateNameErrorMessage() {
    if (this.name.hasError('required')) {
      this.errorNameMessage = 'You must enter a value';
    } else {
      this.errorNameMessage = '';
    }
  }

  get email(): FormControl {
    return this.signupForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.signupForm.get('password') as FormControl;
  }

  get name(): FormControl {
    return this.signupForm.get('name') as FormControl;
  }

  set email(value: string) {
    this.email.setValue(value);
  }

  set password(value: string) {
    this.password.setValue(value);
  }

  set name(value: string) {
    this.name.setValue(value);
  }


}
