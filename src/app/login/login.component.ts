import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {RegisterComponent} from "../register/register.component";
import {LoginService} from "../service/login.service";
import {FormsModule} from "@angular/forms";
import {NotificationService} from "../service/notification.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgOptimizedImage,
    RegisterComponent,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private loginService: LoginService, private router: Router, private notificationService: NotificationService) {}

  onSubmit() {
    this.loginService.login(this.credentials).subscribe(
      response => {
        console.log('User logged in successfully', response);
        const token = response.token;
        if (token) {
          console.log('i should be here??????')
          localStorage.setItem('jwt', token);
          console.log('i should go to /list')
          this.router.navigate(['/list']);
        }
      },
      error => {
        console.error('Error logging in user', error);
        this.notificationService.showError('Vale kasutajanimi või salasõna!')
      }
    );
  }
}
