import {Component, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {RegisterService} from "../service/register.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NotificationService} from "../service/notification.service";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MatRadioButton, MatRadioGroup, MatFormField, MatLabel, FormsModule, ReactiveFormsModule, MatInput],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  user = {
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  };

  constructor(private registerService: RegisterService, private notifications: NotificationService, private fb: FormBuilder) {}

  registerUserForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    email: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] })
  });

  onSubmit() {
    if (this.registerUserForm.valid) {
      this.registerService.register(this.registerUserForm.value).subscribe(
        response => {
          console.log('User registered successfully', response);
          this.notifications.showSuccess('Kasutaja edukalt registeeritud! Logige sisse')
        },
        error => {
          console.error('Error registering user', error);
          this.notifications.showError(error.error)
        }
      );
    }
    console.error('Form input invalid')
  }

  ngOnInit(): void {
    // @ts-ignore
    this.registerUserForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
}
