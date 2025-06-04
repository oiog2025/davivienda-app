import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Project} from '../interfaces/project.interfaces';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  private projectsUrl = 'http://localhost:8080/davivienda/project';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl, { headers: this.getAuthHeaders() });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.projectsUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createProject(project: Project): Observable<Project> {
    const { id, ...projectWithoutId } = project;
    return this.http.post<Project>(this.projectsUrl, projectWithoutId, { headers: this.getAuthHeaders() });
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.projectsUrl}/${id}`, project, { headers: this.getAuthHeaders() });
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.projectsUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
