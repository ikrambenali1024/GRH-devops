import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeaveService } from '../../../services/leave';
import { LeaveRequest } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-list',
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
  templateUrl: './leave-list.html',
  styleUrl: './leave-list.scss'
})
export class LeaveListComponent implements OnInit {

  leaves: LeaveRequest[] = [];
  loading = true;
  displayedColumns = ['employee', 'startDate', 'endDate', 'leaveType', 'status', 'actions'];

  constructor(
    private leaveService: LeaveService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading = true;
    this.leaveService.getAll().subscribe({
      next: (data) => {
        this.leaves = data;
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

  approve(id: number): void {
    this.leaveService.approve(id).subscribe(() => this.loadLeaves());
  }

  reject(id: number): void {
    this.leaveService.reject(id).subscribe(() => this.loadLeaves());
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'APPROVED': return 'primary';
      case 'REJECTED': return 'warn';
      case 'PENDING': return 'accent';
      default: return '';
    }
  }
}