import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './my-attendance.html',
  styleUrl: './my-attendance.scss'
})
export class MyAttendanceComponent implements OnInit {

  attendances: any[] = [];
  loading = true;
  checkingIn = false;
  checkingOut = false;
  hasCheckedInToday = false;
  hasCheckedOutToday = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMyAttendances();
  }

  loadMyAttendances(): void {
    this.loading = true;
    fetch('/api/attendances/my-attendances', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(r => r.json())
    .then(data => {
      this.attendances = data.sort((a: any, b: any) =>
        new Date(b.attendanceDate).getTime() - new Date(a.attendanceDate).getTime()
      );
      this.checkTodayStatus();
      this.loading = false;
      this.cdr.detectChanges();
    })
    .catch(() => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  checkTodayStatus(): void {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = this.attendances.find(a => a.attendanceDate === today);
    this.hasCheckedInToday = !!todayRecord;
    this.hasCheckedOutToday = !!(todayRecord && todayRecord.checkOut);
  }

  checkIn(): void {
    this.checkingIn = true;
    fetch('/api/attendances/my-checkin', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(r => r.json())
    .then(() => {
      this.checkingIn = false;
      this.loadMyAttendances();
    })
    .catch(() => {
      this.checkingIn = false;
      this.cdr.detectChanges();
    });
  }

  checkOut(): void {
    this.checkingOut = true;
    fetch('/api/attendances/my-checkout', {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(r => r.json())
    .then(() => {
      this.checkingOut = false;
      this.loadMyAttendances();
    })
    .catch(() => {
      this.checkingOut = false;
      this.cdr.detectChanges();
    });
  }
  getToday(): string {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
}