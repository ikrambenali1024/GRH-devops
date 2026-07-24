import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-recruitment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './my-recruitment.html',
  styleUrl: './my-recruitment.scss'
})
export class MyRecruitmentComponent implements OnInit {

  offers: any[] = [];
  myApplications: any[] = [];
  loading = true;
  selectedOffer: any = null;
  motivation = '';
  applying = false;
  successMessage = '';
  errorMessage = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOffers();
    this.loadMyApplications();
  }

  get headers() {
    return { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
  }

  loadOffers(): void {
    fetch('/api/recruitment/offers/open', { headers: this.headers })
      .then(r => r.json())
      .then(data => {
        this.offers = data;
        this.loading = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des offres';
        this.cdr.detectChanges();
      });
  }

  loadMyApplications(): void {
    fetch('/api/recruitment/my-applications', { headers: this.headers })
      .then(r => r.json())
      .then(data => {
        this.myApplications = data;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.errorMessage = 'Erreur lors du chargement des candidatures';
        this.cdr.detectChanges();
      });
  }

  apply(): void {
    if (!this.selectedOffer) return;
    this.applying = true;
    this.errorMessage = '';

    fetch(`/api/recruitment/offers/${this.selectedOffer.id}/apply`, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivation: this.motivation })
    })
    .then(r => {
      if (r.ok) {
        this.successMessage = 'Candidature envoyée avec succès !';
        this.selectedOffer = null;
        this.motivation = '';
        this.loadMyApplications();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
        this.applying = false;
        this.cdr.detectChanges();
        return;
      }

      return r.json().then(err => {
        this.errorMessage = err.error || 'Erreur lors de la candidature';
        this.applying = false;
        this.cdr.detectChanges();
      });
    })
    .catch(() => {
      this.errorMessage = 'Erreur réseau';
      this.applying = false;
      this.cdr.detectChanges();
    });
  }

  hasApplied(offerId: number): boolean {
    return this.myApplications.some((a: any) => a.jobOffer?.id === offerId);
  }

  getAppStatus(offerId: number): string {
    const app = this.myApplications.find((a: any) => a.jobOffer?.id === offerId);
    return app ? app.status : '';
  }

  getStatusBadge(status: string): string {
    switch(status) {
      case 'ACCEPTED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-warning';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'ACCEPTED': return 'Accepté';
      case 'REJECTED': return 'Rejeté';
      default: return 'En attente';
    }
  }
}