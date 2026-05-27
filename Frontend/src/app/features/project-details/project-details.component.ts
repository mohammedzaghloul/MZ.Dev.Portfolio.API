import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.component.html',
  styles: [`
    :host {
      --bg-primary: #0B1020;
      --bg-secondary: #0f172a;
      --bg-tertiary: #1e293b;
      --accent-purple: #7C3AED;
      --accent-purple-light: #A855F7;
      --accent-blue: #3B82F6;
      --accent-cyan: #06B6D4;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --glass-bg: rgba(11, 16, 32, 0.7);
      --glass-border: rgba(255, 255, 255, 0.08);
      --gradient-primary: linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #3B82F6 100%);
      --shadow-card: 0 25px 50px rgba(0, 0, 0, 0.5);
      --shadow-glow: 0 0 50px rgba(124, 58, 237, 0.3);
      --border-radius: 20px;
      --transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :host ::ng-deep * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :host ::ng-deep body {
      font-family: 'Cairo', 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
    }

    .project-details {
      padding: 8rem 2rem 4rem;
      min-height: 100vh;
      background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.08) 0%, rgba(11, 16, 32, 0) 70%);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 600;
      margin-bottom: 2rem;
      transition: var(--transition);
      cursor: pointer;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .project-header {
      margin-bottom: 3rem;
    }

    .project-title {
      font-size: 3rem;
      font-weight: 900;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff 0%, var(--accent-purple-light) 50%, var(--accent-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
    }

    .project-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      margin-bottom: 2rem;
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--accent-cyan);
    }

    .project-image {
      width: 100%;
      height: 400px;
      border-radius: var(--border-radius);
      overflow: hidden;
      margin-bottom: 3rem;
      border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-card);
    }

    .project-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .project-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
      font-size: 6rem;
      color: rgba(255, 255, 255, 0.1);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .main-content {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius);
      padding: 2.5rem;
      box-shadow: var(--shadow-card);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .section-title::before {
      content: '';
      width: 4px;
      height: 24px;
      background: var(--gradient-primary);
      border-radius: 2px;
    }

    .description {
      color: var(--text-secondary);
      font-size: 1.1rem;
      line-height: 1.8;
      margin-bottom: 2rem;
      white-space: pre-line;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .sidebar-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius);
      padding: 2rem;
      box-shadow: var(--shadow-card);
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .tech-tag {
      padding: 0.5rem 1rem;
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--accent-cyan);
      transition: var(--transition);
    }

    .tech-tag:hover {
      background: rgba(6, 182, 212, 0.15);
      border-color: rgba(6, 182, 212, 0.4);
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 1rem 1.5rem;
      background: var(--gradient-primary);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: var(--shadow-glow);
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 60px rgba(124, 58, 237, 0.45);
    }

    /* GitHub Button */
    .action-btn-github {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .action-btn-github:hover {
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.05);
    }

    /* Interactive tag animation */
    .tech-tag {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .tech-tag:hover {
      background: rgba(6, 182, 212, 0.12) !important;
      border-color: var(--accent-cyan) !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(6, 182, 212, 0.15) !important;
    }

    .project-main-card {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 35px;
      background: rgba(11, 16, 32, 0.65);
      border: 2px solid var(--glass-border);
      padding: 35px;
      border-radius: 24px;
      box-shadow: var(--shadow-card);
      align-items: start;
      backdrop-filter: blur(10px);
    }

    .project-details-image {
      width: 100%;
      height: 260px;
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid var(--glass-border);
      position: relative;
      background: #070a14;
    }

    .actions-card {
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      backdrop-filter: blur(5px);
    }

    .tech-card {
      background: rgba(11, 16, 32, 0.65);
      border: 2px solid var(--glass-border);
      padding: 30px;
      border-radius: 24px;
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(10px);
    }

    /* Split Grid responsiveness */
    @media (max-width: 768px) {
      .project-main-card {
        grid-template-columns: 1fr !important;
        padding: 20px !important;
        gap: 25px !important;
      }
      .project-details-image {
        height: 200px !important;
      }
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      font-size: 1.2rem;
      color: var(--text-secondary);
    }

    .not-found {
      text-align: center;
      padding: 4rem 2rem;
    }

    .not-found h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .not-found p {
      color: var(--text-secondary);
    }
  `]
})
export class ProjectDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);

  readonly project = signal<any>(null);
  readonly loading = signal<boolean>(true);
  readonly notFound = signal<boolean>(false);

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    const userId = this.route.snapshot.paramMap.get('userId');

    if (projectId && userId) {
      this.loadProject(userId, projectId);
    } else {
      this.loading.set(false);
      this.notFound.set(true);
    }
  }

  private loadProject(userId: string, projectId: string): void {
    this.portfolioService.getProjects(userId).subscribe({
      next: (projects) => {
        const project = projects.find(p => p.id === parseInt(projectId));
        if (project) {
          this.project.set(project);
          this.loading.set(false);
        } else {
          this.loading.set(false);
          this.notFound.set(true);
        }
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
      }
    });
  }

  goBack(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    const isEnglish = document.documentElement.lang === 'en';
    this.router.navigate(['/', isEnglish ? 'profile' : 'portfolio', userId]);
  }

  formatGeneralUrl(value: string): string {
    if (!value) return '';
    let val = value.trim();
    if (!val) return '';

    // If it's already a full absolute URL, return it
    if (val.startsWith('http://') || val.startsWith('https://')) {
      return val;
    }

    // If it's an email address, turn it into mailto:
    if (val.includes('@') && !val.includes('/')) {
      return `mailto:${val}`;
    }

    // Otherwise, assume it is a domain or path, prepend https://
    return `https://${val}`;
  }

  getProjectImageUrl(img: string): string {
    if (!img) return '';
    return img.startsWith('/') ? `${this.portfolioService.apiHost}${img}` : img;
  }

  getUniqueTechStack(techStack: string): string[] {
    if (!techStack) return [];
    const techArray = techStack.split(',').map(t => t.trim()).filter(t => t.length > 0);
    return Array.from(new Set(techArray));
  }

  formatDateString(dateString: string): string {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  getProjectDateRange(project: any): string {
    const start = this.formatDateString(project.startDate);
    const end = project.endDate ? this.formatDateString(project.endDate) : 'Present';
    return `${start} - ${end}`;
  }
}
