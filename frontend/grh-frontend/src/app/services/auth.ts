import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/register`, request);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    const payload = this.decodeToken(token);
    if (payload) {
      localStorage.setItem('role', payload.role || '');
      localStorage.setItem('username', payload.sub || '');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}