import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.scss'
})
export class DepartmentListComponent implements OnInit {

  departments: any[] = [];
  loading = true;
  showForm = false;
  newDepartment = { name: '', description: '' };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    fetch('/api/departments', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(r => r.json())
    .then(data => {
      this.departments = data;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  createDepartment(): void {
    fetch('/api/departments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.newDepartment)
    })
    .then(r => r.json())
    .then(() => {
      this.newDepartment = { name: '', description: '' };
      this.showForm = false;
      this.loadDepartments();
    });
  }

  deleteDepartment(id: number): void {
    if (confirm('Supprimer ce département ?')) {
      fetch(`/api/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(() => this.loadDepartments());
    }
  }
}