import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../services/employee';
import { LeaveService } from '../../services/leave';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  totalEmployees = 0;
  pendingLeaves = 0;
  todayAttendances = 0;
  role = '';
  username = '';

  recentEmployees: any[] = [];
  pendingLeavesList: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.username = this.authService.getUsername();
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.totalEmployees = data.length;
        this.recentEmployees = data.slice(0, 5);
        this.cdr.detectChanges();
      }
    });

    this.leaveService.getPending().subscribe({
      next: (data) => {
        this.pendingLeaves = data.length;
        this.pendingLeavesList = data.slice(0, 3);
        this.cdr.detectChanges();
      }
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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