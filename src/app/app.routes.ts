import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import {LoginComponent} from "./login/login.component";
import {BookListComponent} from "./book-list/book-list.component";
import {BookAddComponent} from "./book-add/book-add.component";
import {AuthGuard} from "./auth.guard";

export const routes: Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'list', component: BookListComponent, canActivate: [AuthGuard]},
  { path: 'add', component: BookAddComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirect to login on empty path

];
