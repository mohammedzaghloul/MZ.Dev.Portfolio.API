import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  
  private readonly baseUrl = window.location.hostname === 'localhost' 
    ? 'https://localhost:7208/api' 
    : 'https://mz-dev-portfolio.runasp.net/api';

  // Signals for state management
  readonly token = signal<string | null>(localStorage.getItem('ld_token'));
  readonly userId = signal<string | null>(localStorage.getItem('ld_userId'));
  readonly isLoggedIn = signal<boolean>(!!this.token());

  login(dto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/OAuth/Login`, dto).pipe(
      tap(res => {
        if (res && res.token) {
          this.saveToken(res.token);
        }
      })
    );
  }

  register(dto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/OAuth/Register`, dto);
  }

  logout(): void {
    this.token.set(null);
    this.userId.set(null);
    this.isLoggedIn.set(false);
    localStorage.removeItem('ld_token');
    localStorage.removeItem('ld_userId');
  }

  private saveToken(t: string): void {
    this.token.set(t);
    localStorage.setItem('ld_token', t);
    try {
      // Decode JWT safely
      const payload = JSON.parse(atob(t.split('.')[1]));
      const NAMEID_LONG = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
      const extracted = payload.nameid || payload[NAMEID_LONG] || payload.sub || null;
      const uid = (extracted && extracted !== 'null') ? extracted : null;
      if (uid) {
        this.userId.set(uid);
        localStorage.setItem('ld_userId', uid);
      } else {
        this.userId.set(null);
        localStorage.removeItem('ld_userId');
      }
    } catch {
      this.userId.set(null);
      localStorage.removeItem('ld_userId');
    }
    this.isLoggedIn.set(true);
  }
}
