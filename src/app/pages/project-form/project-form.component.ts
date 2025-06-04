import {Component, OnInit} from '@angular/core';
import {Project} from '../../interfaces/project.interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-project-form',
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './project-form.component.html',
  standalone: true,
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent  implements OnInit {
  projectForm!: FormGroup;
  isEditMode = false;
  projectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['PLANIFICADO', Validators.required]
    });

    const routeProjectId = this.route.snapshot.paramMap.get('id');
    if (routeProjectId && routeProjectId !== 'new') {
      this.isEditMode = true;
      this.projectId = +routeProjectId;
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.projectForm.patchValue({
          id: data.id,
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status
        });
      },
      error: (err) => {
        console.error('Error loading project:', err);
        this.router.navigate(['/projects']);
      }
    });
  }

  saveProject(): void {
    if (this.projectForm.valid) {
      const project: Project = this.projectForm.value;

      if (this.isEditMode && this.projectId) {
        this.projectService.updateProject(this.projectId, project).subscribe({
          next: () => {
            this.router.navigate(['/projects']);
          },
          error: (err) => {
            console.error('Error updating project:', err);
          }
        });
      } else {
        const { id, ...projectToCreate } = project;
        this.projectService.createProject(projectToCreate as Project).subscribe({
          next: () => {
            this.router.navigate(['/projects']);
          },
          error: (err) => {
            console.error('Error creating project:', err);
          }
        });
      }
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }

  get f() { return this.projectForm.controls; }

}
