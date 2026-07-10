import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleRedirectGuard } from './guards/role-redirect-guard';
import { adminOnlyGuard } from './guards/admin-only-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./components/layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [roleRedirectGuard]
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./components/employees/employee-list/employee-list').then(m => m.EmployeeListComponent)
      },
      {
        path: 'employees/new',
        loadComponent: () =>
          import('./components/employees/employee-form/employee-form').then(m => m.EmployeeFormComponent)
      },
      {
        path: 'employees/edit/:id',
        loadComponent: () =>
          import('./components/employees/employee-form/employee-form').then(m => m.EmployeeFormComponent)
      },
      {
        path: 'leaves',
        loadComponent: () =>
          import('./components/leave/leave-list/leave-list').then(m => m.LeaveListComponent),
        canActivate: [adminOnlyGuard]
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./components/attendance/attendance-list/attendance-list').then(m => m.AttendanceListComponent)
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./components/departments/department-list/department-list').then(m => m.DepartmentListComponent),
        canActivate: [adminOnlyGuard]
      },
      {
        path: 'my-space',
        loadComponent: () =>
          import('./components/employee-space/my-space/my-space').then(m => m.MySpaceComponent)
      },
      {
        path: 'my-attendance',
        loadComponent: () =>
          import('./components/employee-space/my-attendance/my-attendance').then(m => m.MyAttendanceComponent)
      },
      {
        path: 'my-leaves',
        loadComponent: () =>
          import('./components/employee-space/my-leaves/my-leaves').then(m => m.MyLeavesComponent)
      },
      {
        path: 'my-recruitment',
        loadComponent: () =>
          import('./components/employee-space/my-recruitment/my-recruitment').then(m => m.MyRecruitmentComponent)
      },
      {
        path: 'rh-dashboard',
        loadComponent: () =>
          import('./components/rh-space/rh-dashboard/rh-dashboard').then(m => m.RhDashboardComponent)
      },
      {
        path: 'recruitment',
        loadComponent: () =>
          import('./components/rh-space/recruitment/recruitment').then(m => m.RecruitmentComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/settings/settings/settings').then(m => m.SettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];