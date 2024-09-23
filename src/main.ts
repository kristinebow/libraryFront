import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {LoginComponent} from "./app/login/login.component";
import {RegisterComponent} from "./app/register/register.component";

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
bootstrapApplication(LoginComponent, appConfig)
  .catch((err) => console.error(err));
bootstrapApplication(RegisterComponent, appConfig)
  .catch((err) => console.error(err));
