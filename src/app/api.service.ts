import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  createBook(book: any): Observable<any> {
    const apiUrl = this.apiUrl + '/save';
    console.log(apiUrl);
    return this.http.post<any>(apiUrl, book);
  }

  findAllBooks(): Observable<any> {
    return this.http.get(this.apiUrl + '/books');
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  reserveBook(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/reserve`, {});
  }

  cancelBookReservation(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  receiveBook(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/receive`, {});
  }

  returnBook(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/return`, {});
  }

}
