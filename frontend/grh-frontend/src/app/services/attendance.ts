import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = '/api/attendances';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl);
  }

  getByEmployee(employeeId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  checkIn(employeeId: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/checkin/${employeeId}`, {});
  }

  checkOut(employeeId: number): Observable<Attendance> {
    return this.http.patch<Attendance>(`${this.apiUrl}/checkout/${employeeId}`, {});
  }
}