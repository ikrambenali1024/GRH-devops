import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AttendanceService } from '../../../services/attendance';
import { Attendance } from '../../../models/attendance.model';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.scss'
})
export class AttendanceListComponent implements OnInit {

  attendances: Attendance[] = [];
  loading = true;
  displayedColumns = ['employee', 'date', 'checkIn', 'checkOut', 'status'];

  constructor(
    private attendanceService: AttendanceService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.loading = true;
    this.attendanceService.getAll().subscribe({
      next: (data) => {
        this.attendances = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

 

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'PRESENT': return 'primary';
      case 'ABSENT': return 'warn';
      case 'LATE': return 'accent';
      default: return '';
    }
  }
}