import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {

  currentRole = '';
  currentUrl = '';
  username = '';

  adminMenu: any[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard' },
  { label: 'Départements', icon: 'business', route: '/app/departments' },
  { label: 'Congés', icon: 'event_busy', route: '/app/leaves', badge: 0 },
  { label: 'Paramètres', icon: 'settings', route: '/app/settings' }
];

rhMenu: any[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard' },
  { label: 'Employés', icon: 'people', route: '/app/employees' },
  { label: 'Présences', icon: 'access_time', route: '/app/attendance' },
  { label: 'Recrutement', icon: 'work', route: '/app/recruitment' }
];

employeeMenu: any[] = [
  { label: 'Mon espace', icon: 'person', route: '/app/my-space' },
  { label: 'Mes congés', icon: 'event_busy', route: '/app/my-leaves' },
  { label: 'Mes présences', icon: 'access_time', route: '/app/my-attendance' },
  { label: 'Recrutement', icon: 'work', route: '/app/my-recruitment' }
];
  constructor(
  private authService: AuthService,
  public router: Router
) {}

  ngOnInit(): void {
    this.currentRole = this.authService.getRole();
    this.username = this.authService.getUsername();
    this.currentUrl = this.router.url;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
    });
  }

  getMenu() {
    switch(this.currentRole) {
      case 'ADMIN': return this.adminMenu;
      case 'RH': return this.rhMenu;
      case 'EMPLOYEE': return this.employeeMenu;
      default: return this.adminMenu;
    }
  }

  getRoleLabel() {
    switch(this.currentRole) {
      case 'ADMIN': return 'Administrateur';
      case 'RH': return 'Ressources Humaines';
      case 'EMPLOYEE': return 'Employé';
      default: return '';
    }
  }

  getInitials() {
    return this.username ? this.username.substring(0, 2).toUpperCase() : 'AD';
  }

  isActive(route: string): boolean {
    return this.currentUrl === route;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}