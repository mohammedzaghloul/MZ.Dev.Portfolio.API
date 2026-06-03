import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = window.location.hostname === 'localhost' 
    ? 'https://localhost:7208/api' 
    : 'https://mz-dev-portfolio.runasp.net/api';

  readonly apiHost = this.baseUrl.replace('/api', '');

  // ── User Profile ──
  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/UserProfile/${userId}`);
  }

  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/UserProfile/me`, formData);
  }

  // ── Projects ──
  getProjects(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Project/user/${userId}`);
  }

  createProject(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Project`, formData);
  }

  updateProject(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Project/${id}`, formData);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Project/${id}`);
  }

  // ── Skills ──
  getSkills(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Skill/user/${userId}`);
  }

  createSkill(skill: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Skill`, skill);
  }

  updateSkill(id: number, skill: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Skill/${id}`, skill);
  }

  deleteSkill(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Skill/${id}`);
  }

  // ── Experiences ──
  getExperiences(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Experience/user/${userId}`);
  }

  createExperience(exp: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Experience`, exp);
  }

  updateExperience(id: number, exp: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Experience/${id}`, exp);
  }

  deleteExperience(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Experience/${id}`);
  }

  // ── Contacts ──
  getContact(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Contact/user/${userId}`);
  }

  createContact(contact: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Contact`, contact);
  }

  updateContact(id: number, contact: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Contact/${id}`, contact);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Contact/${id}`);
  }

  // ── Attachment / Uploads ──
  uploadAttachment(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Attachment/upload`, formData);
  }
}
