import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loginUrl = 'http://localhost:8080/davivienda/login';
  private tokenKey = 'authToken';
  constructor(private http: HttpClient) {}

  login(credentials: { username: string, password: string }) {
    return this.http.post<{ token: string }>(this.loginUrl, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
