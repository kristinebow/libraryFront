import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8081/api'; // Your backend URL
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl+'/login', credentials);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    console.log(localStorage.getItem('jwt'))
    return token !== null;
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('jwt');
  }


}
