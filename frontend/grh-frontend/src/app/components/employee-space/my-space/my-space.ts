import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-my-space',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './my-space.html',
  styleUrl: './my-space.scss'
})
export class MySpaceComponent implements OnInit {

  username = '';
  myLeaves: any[] = [];
  myAttendances: any[] = [];
  loading = true;
  hasCheckedInToday = false;
  hasCheckedOutToday = false;
  pendingLeavesCount = 0;
  approvedLeavesCount = 0;
  leaveBalance = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.loadData();
  }

  loadData(): void {
    const headers = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };

    fetch('/api/attendances/my-attendances', { headers })
      .then(r => r.json())
      .then(data => {
        this.myAttendances = data;
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = data.find((a: any) => a.attendanceDate === today);
        this.hasCheckedInToday = !!todayRecord;
        this.hasCheckedOutToday = !!(todayRecord && todayRecord.checkOut);
        this.loading = false;
        this.cdr.detectChanges();
      });

    fetch('/api/leave-requests/my-leaves', { headers })
  .then(r => r.json())
  .then(data => {
    this.myLeaves = data;
    this.pendingLeavesCount = data.filter((l: any) => l.status === 'PENDING').length;
    this.approvedLeavesCount = data.filter((l: any) => l.status === 'APPROVED').length;
    this.cdr.detectChanges();
  });
  fetch('/api/employees/my-profile', { headers })
  .then(r => r.json())
  .then(data => {
    this.leaveBalance = data.leaveBalance ?? 0;
    this.cdr.detectChanges();
  });
  }

  navigate(path: string): void {
    this.router.navigate(['/app' + path]);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  getToday(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}