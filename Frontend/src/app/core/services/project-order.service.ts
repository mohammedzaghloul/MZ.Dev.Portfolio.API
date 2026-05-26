import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectOrderService {
  private readonly ORDER_KEY = 'project_display_order';
  
  getOrderedProjects(projects: any[]): any[] {
    const orderMap = this.getStoredOrder();
    if (!orderMap || Object.keys(orderMap).length === 0) {
      return projects;
    }
    
    return [...projects].sort((a, b) => {
      const orderA = orderMap[a.id!] ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap[b.id!] ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }
  
  saveOrder(projects: any[]): void {
    const orderMap: Record<number, number> = {};
    projects.forEach((project, index) => {
      if (project.id) {
        orderMap[project.id] = index;
      }
    });
    localStorage.setItem(this.ORDER_KEY, JSON.stringify(orderMap));
  }
  
  private getStoredOrder(): Record<number, number> | null {
    const stored = localStorage.getItem(this.ORDER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  
  clearOrder(): void {
    localStorage.removeItem(this.ORDER_KEY);
  }
}
