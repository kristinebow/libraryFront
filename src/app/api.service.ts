import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  createBook(book: any): Observable<any> {
    const apiUrl = this.apiUrl + '/save';
    return this.http.post<any>(apiUrl, book);
  }

  findAllBooks(): Observable<any> {
    return this.http.get(this.apiUrl + '/books');
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  reserveBook(id: number, userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/reserve?userId=${userId}`, {});
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

  searchBooks(author?: string, title?: string, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (author) {
      params = params.append('author', author);
    }
    if (title) {
      params = params.append('title', title);
    }

    return this.http.get<any>(this.apiUrl + '/search', { params });
  }

}
