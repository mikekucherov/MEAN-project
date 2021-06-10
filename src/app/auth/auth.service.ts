import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated = false;
  private token: string;
  private authStatusListener$ = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener$.asObservable();
  }

  getIsAuthenticatedStatus() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post('http://localhost:3000/api/auth/signup', authData)
      .subscribe(response => console.log(response));
  }

  login( email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{token: string}>('http://localhost:3000/api/auth/login', authData)
      .subscribe(response => {
        const token = response.token;

        if (token) {
          this.isAuthenticated = true;
          this.token = token;
          this.authStatusListener$.next(true);
          this.router.navigate(['/']);
        }

      });
  }

  logOut() {
    this.token = null;
    this.authStatusListener$.next(false);
    this.isAuthenticated = false;
    this.router.navigate(['/']);
  }
}