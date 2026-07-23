import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './login.html',
styleUrl: './login.scss'
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage = '';
  loading = false;
  showPassword = false;
  showInfo = false;
features = [
  {
    icon: 'people',
    title: 'Gestion des employés',
    desc: 'CRUD complet avec départements et postes',
    bg: '#eff6ff',
    color: '#2563eb'
  },
  {
    icon: 'event_busy',
    title: 'Gestion des congés',
    desc: 'Demandes, approbations et suivi des soldes',
    bg: '#fffbeb',
    color: '#d97706'
  },
  {
    icon: 'access_time',
    title: 'Suivi des présences',
    desc: 'Pointage en temps réel et historique',
    bg: '#f0fdf4',
    color: '#16a34a'
  },
  {
    icon: 'work',
    title: 'Recrutement interne',
    desc: 'Offres, candidatures et suivi RH',
    bg: '#f5f3ff',
    color: '#7c3aed'
  }
];

stats = [
  { value: '100%', label: 'Sécurisé JWT' },
  { value: '3', label: 'Rôles utilisateur' },
  { value: '24/7', label: 'Disponibilité' }
];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}