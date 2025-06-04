import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {ProjectListComponent} from './pages/project-list/project-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectListComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'projects/new', loadComponent: () => import('./pages/project-form/project-form.component').then(m => m.ProjectFormComponent) },
  { path: 'projects/edit/:id', loadComponent: () => import('./pages/project-form/project-form.component').then(m => m.ProjectFormComponent) },
  { path: '**', redirectTo: '/login' }

];
