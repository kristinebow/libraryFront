import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {RegisterService} from "../service/register.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NotificationService} from "../service/notification.service";
import {MatInput} from "@angular/material/input";
import {SuccessOverlayComponent} from "../success-overlay/success-overlay.component";
import {MatDialog} from "@angular/material/dialog";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MatRadioButton, MatRadioGroup, MatFormField, MatLabel, FormsModule, ReactiveFormsModule, MatInput, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  user = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: ''
  };

  constructor(private registerService: RegisterService, private notifications: NotificationService, private fb: FormBuilder,
              private dialog: MatDialog, private router: Router) {}

  registerUserForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    email: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] }),
    role: new FormControl('', { validators: [Validators.required] })
  });

  onSubmit() {
    if (this.registerUserForm.valid) {
      this.registerService.register(this.registerUserForm.value).subscribe(
        response => {
         this.openDialog();
          this.registerUserForm.reset();
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

  openDialog() {
    const dialogRef = this.dialog.open(SuccessOverlayComponent);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  ngOnInit(): void {
    // @ts-ignore
    this.registerUserForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }
}
