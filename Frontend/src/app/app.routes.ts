import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'portfolio/:userId',
    loadComponent: () => import('./features/public-portfolio/public-portfolio.component').then(m => m.PublicPortfolioComponent)
  },
  {
    path: 'profile/:userId',
    loadComponent: () => import('./features/public-portfolio/public-portfolio.component').then(m => m.PublicPortfolioComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/public-portfolio/public-portfolio.component').then(m => m.PublicPortfolioComponent)
  },
  {
    path: 'project/:userId/:id',
    loadComponent: () => import('./features/project-details/project-details.component').then(m => m.ProjectDetailsComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
