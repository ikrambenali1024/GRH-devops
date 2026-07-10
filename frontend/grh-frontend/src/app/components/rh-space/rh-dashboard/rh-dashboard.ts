import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rh-dashboard.html',
  styleUrl: './rh-dashboard.scss'
})
export class RhDashboardComponent implements OnInit {

  username = '';
  totalEmployees = 0;
  todayAttendances = 0;
  activeEmployees = 0;
  recentEmployees: any[] = [];
  todayAttendanceList: any[] = [];

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

    fetch('http://localhost:8081/api/employees', { headers })
      .then(r => r.json())
      .then(data => {
        this.totalEmployees = data.length;
        this.activeEmployees = data.filter((e: any) => e.status === 'ACTIVE').length;
        this.recentEmployees = data.slice(0, 5);
        this.cdr.detectChanges();
      });

    fetch('http://localhost:8081/api/attendances', { headers })
      .then(r => r.json())
      .then(data => {
        const today = new Date().toISOString().split('T')[0];
        this.todayAttendanceList = data.filter((a: any) => a.attendanceDate === today);
        this.todayAttendances = this.todayAttendanceList.length;
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

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getAvatarColor(index: number): string {
    const colors = ['#eff6ff', '#f0fdf4', '#fffbeb', '#fef2f2', '#f5f3ff'];
    return colors[index % colors.length];
  }

  getAvatarTextColor(index: number): string {
    const colors = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed'];
    return colors[index % colors.length];
  }
}