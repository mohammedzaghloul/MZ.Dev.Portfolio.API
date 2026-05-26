import { Injectable, signal } from '@angular/core';

export interface VisibilitySettings {
  hero: boolean;
  experience: boolean;
  skills: boolean;
  projects: boolean;
  contact: boolean;
  sectionOrder: string[];
  
  hero_layout?: string;
  hero_size?: string;
  hero_show_badges?: boolean;
  hero_show_glows?: boolean;
  
  about_style?: string;
  about_tilt?: boolean;
  
  experience_style?: string;
  experience_show_certs?: boolean;
  
  skills_style?: string;
  skills_size?: string;
  
  projects_cols?: string;
  projects_hover_zoom?: boolean;
  
  contact_layout?: string;
  contact_icons_style?: string;
  custom_css?: string;
  
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<string>(localStorage.getItem('ld_theme') || '1');
  
  readonly visibility = signal<VisibilitySettings>({
    hero: true,
    experience: true,
    skills: true,
    projects: true,
    contact: true,
    sectionOrder: ['hero', 'about', 'skills', 'experience', 'projects', 'contact'],
    
    // Custom Appearance & Granular Visibility options
    hero_layout: 'left', // left | center
    hero_size: 'regular', // regular | large
    hero_show_badges: true,
    hero_show_glows: true,
    
    about_style: 'grid', // grid | stack
    about_tilt: true,
    
    experience_style: 'alternating', // alternating | left
    experience_show_certs: true,
    
    skills_style: 'glowing', // glowing | minimal
    skills_size: 'md', // sm | md | lg
    
    projects_cols: 'col-3', // col-2 | col-3 | row
    projects_hover_zoom: true,
    
    contact_layout: 'wide', // compact | wide
    contact_icons_style: 'glow', // glow | text
    custom_css: ''
  });

  private readonly themeMap: { [key: string]: string } = {
    '1': 'nebula',
    '2': 'ocean',
    '3': 'minimal',
    '4': 'aurora',
    '5': 'cyberpunk',
    '6': 'sakura',
    '7': 'midnight',
    '8': 'forest',
    '9': 'sunset',
  };

  constructor() {
    this.applyTheme(this.currentTheme());
    const cachedVis = localStorage.getItem('ld_visibility');
    if (cachedVis) {
      try {
        this.visibility.set(JSON.parse(cachedVis));
      } catch {}
    }
  }

  applyTheme(themeNum: string): void {
    this.currentTheme.set(themeNum);
    localStorage.setItem('ld_theme', themeNum);
    const themeName = this.themeMap[themeNum] || 'nebula';
    
    // Set theme attribute on document body
    document.body.removeAttribute('data-theme');
    document.body.setAttribute('data-theme', themeName);
  }

  applyVisibility(vis: VisibilitySettings): void {
    this.visibility.set(vis);
    localStorage.setItem('ld_visibility', JSON.stringify(vis));
  }

  unpackTemplate(packedStr: string): { theme: string; vis: VisibilitySettings } {
    const defaultVis: VisibilitySettings = {
      hero: true,
      experience: true,
      skills: true,
      projects: true,
      contact: true,
      sectionOrder: ['hero', 'about', 'skills', 'experience', 'projects', 'contact'],
      hero_layout: 'left',
      hero_size: 'regular',
      hero_show_badges: true,
      hero_show_glows: true,
      about_style: 'grid',
      about_tilt: true,
      experience_style: 'alternating',
      experience_show_certs: true,
      skills_style: 'glowing',
      skills_size: 'md',
      projects_cols: 'col-3',
      projects_hover_zoom: true,
      contact_layout: 'wide',
      contact_icons_style: 'glow',
      custom_css: ''
    };

    if (!packedStr) {
      return { theme: '1', vis: defaultVis };
    }
    
    const parts = packedStr.split('|');
    const theme = parts[0] || '1';
    const vis = { ...defaultVis };
    
    if (parts[1]) {
      parts[1].split(',').forEach(pair => {
        const [key, val] = pair.split(':');
        if (key && val !== undefined) {
          if (key === 'sectionOrder') {
            vis[key] = val.split('-');
          } else if (val === 'true') {
            vis[key] = true;
          } else if (val === 'false') {
            vis[key] = false;
          } else {
            vis[key] = val;
          }
        }
      });
    }
    return { theme, vis };
  }

  packTemplate(theme: string, vis: VisibilitySettings): string {
    const pairs = Object.entries(vis).map(([key, val]) => {
      if (key === 'sectionOrder' && Array.isArray(val)) {
        return `${key}:${val.join('-')}`;
      }
      return `${key}:${val}`;
    }).join(',');
    return `${theme}|${pairs}`;
  }
}
