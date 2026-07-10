import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {

  role = '';
  username = '';
  activeTab = 'profile';

  // Changer mot de passe
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordLoading = false;
  passwordSuccess = '';
  passwordError = '';

  // Gestion utilisateurs (admin)
  users: any[] = [];
  usersLoading = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.username = this.authService.getUsername();

    if (this.role === 'ADMIN') {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.usersLoading = true;
    fetch('http://localhost:8081/api/users', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(r => r.json())
    .then(data => {
      this.users = data;
      this.usersLoading = false;
      this.cdr.detectChanges();
    })
    .catch(() => {
      this.usersLoading = false;
      this.cdr.detectChanges();
    });
  }

  changePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.newPassword.length < 4) {
      this.passwordError = 'Le mot de passe doit contenir au moins 4 caractères';
      return;
    }

    this.passwordLoading = true;

    fetch('http://localhost:8081/api/users/change-password', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      })
    })
    .then(r => {
      if (r.ok) {
        this.passwordSuccess = 'Mot de passe changé avec succès !';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      } else {
        this.passwordError = 'Mot de passe actuel incorrect';
      }
      this.passwordLoading = false;
      this.cdr.detectChanges();
    })
    .catch(() => {
      this.passwordError = 'Erreur lors du changement de mot de passe';
      this.passwordLoading = false;
      this.cdr.detectChanges();
    });
  }

  getRoleLabel(role: string): string {
    switch(role) {
      case 'ADMIN': return 'Administrateur';
      case 'RH': return 'Ressources Humaines';
      case 'EMPLOYEE': return 'Employé';
      default: return role;
    }
  }

  getRoleBadge(role: string): string {
    switch(role) {
      case 'ADMIN': return 'badge-danger';
      case 'RH': return 'badge-primary';
      default: return 'badge-success';
    }
  }
}