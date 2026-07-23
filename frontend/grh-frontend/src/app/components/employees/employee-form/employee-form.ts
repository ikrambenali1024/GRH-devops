import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { EmployeeService } from '../../../services/employee';
import { AuthService } from '../../../services/auth';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss'
})
export class EmployeeFormComponent implements OnInit {

  employee: Employee = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    hireDate: '',
    jobTitle: '',
    status: 'ACTIVE'
  };

  username = '';
  password = '';
  selectedDepartmentId: number | null = null;
  departments: any[] = [];

  isEditMode = false;
  employeeId: number | null = null;
  loading = false;
  errorMessage = '';

  statuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'];

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) {
      this.isEditMode = true;
      this.employeeService.getById(this.employeeId).subscribe(data => {
        this.employee = data;
        if (data.department) {
          this.selectedDepartmentId = data.department.id ?? null;
        }
      });
    }
  }

  loadDepartments(): void {
    fetch('http://localhost:8081/api/departments', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(r => r.json())
    .then(data => this.departments = data);
  }

  save(): void {
  this.loading = true;
  this.errorMessage = '';

  if (this.selectedDepartmentId) {
    this.employee.department = { id: this.selectedDepartmentId, name: '', description: '' };
  }

  if (this.isEditMode && this.employeeId) {
    this.employeeService.update(this.employeeId, this.employee).subscribe({
      next: () => this.router.navigate(['/app/employees']),
      error: () => {
        this.errorMessage = 'Erreur lors de la modification';
        this.loading = false;
      }
    });
  } else {
    // Étape 1 : créer l'employé
    this.employeeService.create(this.employee).subscribe({
      next: (createdEmployee) => {
        // Étape 2 : créer le compte user et lier à l'employé
        fetch('http://localhost:8081/api/auth/register', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.employee.email,
            password: this.password,
            role: 'EMPLOYEE',
            employeeId: createdEmployee.id
          })
        })
        .then(r => {
          if (r.ok) {
            this.router.navigate(['/app/employees']);
          } else {
            this.errorMessage = 'Employé créé mais erreur lors de la création du compte';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création de l\'employé';
        this.loading = false;
      }
    });
  }
}
  goBack(): void {
    this.router.navigate(['/app/employees']);
  }
}