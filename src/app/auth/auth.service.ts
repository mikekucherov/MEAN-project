import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  isAuthenticated = false;
  private token: string;
  private tokenTimer;
  private authStatusListener$ = new Subject<boolean>();
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener$.asObservable();
  }

  getIsAuthenticatedStatus() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    return this.http
      .post("http://localhost:3200/api/auth/signup", authData)
      .subscribe(
        () => {
          this.router.navigate(["/"]);
        },
        (error) => {
          this.authStatusListener$.next(false);
        }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        "http://localhost:3200/api/auth/login",
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;

          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.token = token;
            this.authStatusListener$.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          this.authStatusListener$.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener$.next(true);
    }
  }

  logOut() {
    this.token = null;
    this.authStatusListener$.next(false);
    this.isAuthenticated = false;
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const expirationDate = localStorage.getItem("expiration");

    if (!token || !expirationDate) {
      return;
    }

    return {
      token,
      userId,
      expirationDate: new Date(expirationDate),
    };
  }
}
