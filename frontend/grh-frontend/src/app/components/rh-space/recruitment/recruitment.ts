import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './recruitment.html',
  styleUrl: './recruitment.scss'
})
export class RecruitmentComponent implements OnInit {

  offers: any[] = [];
  applications: any[] = [];
  loading = true;
  showForm = false;
  selectedOfferId: number | null = null;
  successMessage = '';
  errorMessage = '';

  newOffer = {
    title: '',
    description: '',
    department: '',
    location: '',
    deadline: ''
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  get headers() {
    return { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
  }

  loadOffers(): void {
    this.loading = true;
    fetch('/api/recruitment/offers', { headers: this.headers })
      .then(r => r.json())
      .then(data => {
        this.offers = data;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  loadApplications(offerId: number): void {
    this.selectedOfferId = offerId;
    fetch(`/api/recruitment/offers/${offerId}/applications`, {
      headers: this.headers
    })
    .then(r => r.json())
    .then(data => {
      this.applications = data;
      this.cdr.detectChanges();
    });
  }

  createOffer(): void {
    fetch('/api/recruitment/offers', {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(this.newOffer)
    })
    .then(r => r.json())
    .then(() => {
      this.showForm = false;
      this.newOffer = { title: '', description: '', department: '', location: '', deadline: '' };
      this.successMessage = 'Offre créée avec succès !';
      this.loadOffers();
      setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
    });
  }

  closeOffer(id: number): void {
    fetch(`/api/recruitment/offers/${id}/close`, {
      method: 'PATCH',
      headers: this.headers
    })
    .then(() => this.loadOffers());
  }

  deleteOffer(id: number): void {
    if (confirm('Supprimer cette offre ?')) {
      fetch(`/api/recruitment/offers/${id}`, {
        method: 'DELETE',
        headers: this.headers
      })
      .then(() => {
        if (this.selectedOfferId === id) {
          this.selectedOfferId = null;
          this.applications = [];
        }
        this.loadOffers();
      });
    }
  }

  acceptApplication(id: number): void {
    fetch(`/api/recruitment/applications/${id}/accept`, {
      method: 'PATCH',
      headers: this.headers
    })
    .then(() => this.loadApplications(this.selectedOfferId!));
  }

  rejectApplication(id: number): void {
    fetch(`/api/recruitment/applications/${id}/reject`, {
      method: 'PATCH',
      headers: this.headers
    })
    .then(() => this.loadApplications(this.selectedOfferId!));
  }

  getStatusBadge(status: string): string {
    switch(status) {
      case 'OPEN': return 'badge-success';
      case 'CLOSED': return 'badge-danger';
      default: return 'badge-warning';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'OPEN': return 'Ouverte';
      case 'CLOSED': return 'Fermée';
      default: return 'Annulée';
    }
  }

  getAppStatusBadge(status: string): string {
    switch(status) {
      case 'ACCEPTED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-warning';
    }
  }

  getAppStatusLabel(status: string): string {
    switch(status) {
      case 'ACCEPTED': return 'Accepté';
      case 'REJECTED': return 'Rejeté';
      default: return 'En attente';
    }
  }
}