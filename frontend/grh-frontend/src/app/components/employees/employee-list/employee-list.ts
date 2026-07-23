import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../../services/employee';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-list',
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
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  loading = true;
  displayedColumns = ['firstName', 'lastName', 'email', 'jobTitle', 'status', 'department', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
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

  addEmployee(): void {
    this.router.navigate(['/app/employees/new']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/app/employees/edit', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      this.employeeService.delete(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/app/dashboard']);
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'ACTIVE': return 'primary';
      case 'INACTIVE': return 'warn';
      case 'ON_LEAVE': return 'accent';
      default: return '';
    }
  }
}