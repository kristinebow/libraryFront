import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8081/api/register';

  register(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }
}
