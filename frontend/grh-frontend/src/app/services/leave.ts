import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = 'http://localhost:8081/api/leave-requests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.apiUrl);
  }

  getByEmployee(employeeId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  getPending(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/pending`);
  }

  create(employeeId: number, leave: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}/employee/${employeeId}`, leave);
  }

  approve(id: number): Observable<LeaveRequest> {
    return this.http.patch<LeaveRequest>(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: number): Observable<LeaveRequest> {
    return this.http.patch<LeaveRequest>(`${this.apiUrl}/${id}/reject`, {});
  }
}