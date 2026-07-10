import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.scss'
})
export class MyLeavesComponent implements OnInit {

  leaves: any[] = [];
  loading = true;
  showForm = false;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  newLeave = {
    startDate: '',
    endDate: '',
    leaveType: 'ANNUAL',
    reason: ''
  };
leaveBalance = 0;
  leaveTypes = ['ANNUAL', 'SICK', 'UNPAID', 'MATERNITY', 'PATERNITY', 'OTHER'];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMyLeaves();
    fetch('http://localhost:8081/api/employees/my-profile', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
.then(r => r.json())
.then(data => {
  this.leaveBalance = data.leaveBalance ?? 0;
  this.cdr.detectChanges();
});
  }

  loadMyLeaves(): void {
    this.loading = true;
    fetch('http://localhost:8081/api/leave-requests/my-leaves', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(r => r.json())
    .then(data => {
      this.leaves = data.sort((a: any, b: any) =>
        new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
      );
      this.loading = false;
      this.cdr.detectChanges();
    })
    .catch(() => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  submitLeave(): void {
    if (!this.newLeave.startDate || !this.newLeave.endDate) {
      this.errorMessage = 'Veuillez remplir les dates de début et de fin';
      return;
    }

    if (new Date(this.newLeave.startDate) > new Date(this.newLeave.endDate)) {
      this.errorMessage = 'La date de début doit être avant la date de fin';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    fetch('http://localhost:8081/api/leave-requests/my-leaves', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.newLeave)
    })
    .then(r => r.json())
    .then(() => {
      this.submitting = false;
      this.showForm = false;
      this.successMessage = 'Demande envoyée avec succès !';
      this.newLeave = { startDate: '', endDate: '', leaveType: 'ANNUAL', reason: '' };
      this.loadMyLeaves();
      setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
    })
    .catch(() => {
      this.submitting = false;
      this.errorMessage = 'Erreur lors de l\'envoi de la demande';
      this.cdr.detectChanges();
    });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'APPROVED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-warning';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'APPROVED': return 'Approuvé';
      case 'REJECTED': return 'Rejeté';
      default: return 'En attente';
    }
  }

  getLeaveTypeLabel(type: string): string {
    switch(type) {
      case 'ANNUAL': return 'Congé annuel';
      case 'SICK': return 'Congé maladie';
      case 'UNPAID': return 'Congé sans solde';
      case 'MATERNITY': return 'Congé maternité';
      case 'PATERNITY': return 'Congé paternité';
      default: return 'Autre';
    }
  }
}