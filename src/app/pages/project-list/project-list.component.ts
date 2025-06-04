import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Project} from '../../interfaces/project.interfaces';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
  standalone: true,
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.getProjects();
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.error = 'Failed to load projects. Please try again later.';
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  createNewProject(): void {
    this.router.navigate(['/projects/new']);
  }

  editProject(id: number): void {
    this.router.navigate(['/projects/edit', id]);
  }

  // Delete a project
  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          alert('Failed to delete project.');
          this.getProjects();
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
