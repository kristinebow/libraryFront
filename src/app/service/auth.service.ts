import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role: string;
  roleChanged: EventEmitter<string> = new EventEmitter();


  constructor() {
    // Simulate a logged-in user role
    this.role = 'user'; // Change this to 'admin' to test admin functionality
  }

  getRole(): string {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isUser(): boolean {
    return this.role === 'user';
  }

  setRole(newRole: string) {
    this.role = newRole;
    this.roleChanged.emit(this.role);
  }
}
