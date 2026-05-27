import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-public-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-portfolio.component.html',
    styles: [`
    /* Premium Dark Cosmic Variables */
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
      --glass-border-glow: rgba(124, 58, 237, 0.3);
      --gradient-primary: linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #3B82F6 100%);
      --gradient-cosmic: linear-gradient(135deg, #0B1020 0%, #070a14 100%);
      --shadow-glow: 0 0 50px rgba(124, 58, 237, 0.3);
      --shadow-glow-cyan: 0 0 50px rgba(6, 182, 212, 0.3);
      --shadow-card: 0 25px 50px rgba(0, 0, 0, 0.5);
      --border-radius: 20px;
      --transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Global Elements */
    :host ::ng-deep * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      scroll-behavior: smooth;
    }

    :host ::ng-deep body {
      font-family: 'Cairo', 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Cinematic Glow Blobs & Mesh */
    .bg-glow {
      position: fixed;
      width: 700px;
      height: 700px;
      border-radius: 50%;
      filter: blur(140px);
      opacity: 0.22;
      pointer-events: none;
      z-index: 0;
      animation: cosmicFloat 25s ease-in-out infinite;
    }

    .glow-1 {
      background: radial-gradient(circle, var(--accent-purple) 0%, transparent 70%);
      top: -300px;
      right: -200px;
      animation-delay: 0s;
    }

    .glow-2 {
      background: radial-gradient(circle, var(--accent-blue) 0%, transparent 70%);
      bottom: -300px;
      left: -200px;
      animation-delay: -10s;
    }

    .glow-3 {
      background: radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%);
      top: 40%;
      left: 30%;
      opacity: 0.1;
      animation-duration: 35s;
      animation-delay: -5s;
    }

    @keyframes cosmicFloat {
      0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
      33% { transform: translate(60px, -40px) scale(1.15) rotate(120deg); }
      66% { transform: translate(-40px, 80px) scale(0.9) rotate(240deg); }
    }

    /* Navigation Bar */
    :host ::ng-deep .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(11, 16, 32, 0.7);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--glass-border);
      padding: 1.25rem 0;
      transition: var(--transition);
    }

    :host ::ng-deep .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    :host ::ng-deep .logo {
      font-size: 1.6rem;
      font-weight: 900;
      background: linear-gradient(90deg, #fff 0%, var(--accent-purple-light) 50%, var(--accent-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
      letter-spacing: -0.5px;
    }

    :host ::ng-deep .nav-links {
      display: flex;
      align-items: center;
      gap: 2.5rem;
      list-style: none;
    }

    :host ::ng-deep .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: var(--transition);
      position: relative;
    }

    :host ::ng-deep .nav-links a:hover {
      color: #fff;
    }

    :host ::ng-deep .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--gradient-primary);
      transition: var(--transition);
    }

    :host ::ng-deep .nav-links a:hover::after {
      width: 100%;
    }

    :host ::ng-deep .btn-contact {
      background: linear-gradient(135deg, rgba(124, 90, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
      border: 1px solid rgba(124, 90, 246, 0.3) !important;
      color: #fff !important;
      padding: 0.6rem 1.4rem;
      border-radius: 12px;
      font-weight: 700;
      box-shadow: 0 0 30px rgba(124, 90, 246, 0.15);
      transition: var(--transition);
    }

    :host ::ng-deep .btn-contact:hover {
      border-color: rgba(6, 182, 212, 0.8) !important;
      background: linear-gradient(135deg, rgba(124, 90, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%);
      transform: none;
      box-shadow: 0 0 40px rgba(6, 182, 212, 0.3);
    }

    /* Premium Glass Cards */
    :host ::ng-deep .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(24px) saturate(120%);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius);
      padding: 2.5rem;
      box-shadow: var(--shadow-card);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    :host ::ng-deep .glass-card:hover {
      border-color: rgba(124, 90, 246, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(124, 90, 246, 0.15);
    }

    /* Container Utility */
    :host ::ng-deep .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      position: relative;
    }

    /* Section Headers */
    :host ::ng-deep .section-header {
      text-align: center;
      margin-bottom: 4rem;
      animation: slideUp 0.8s ease both;
    }

    :host ::ng-deep .section-header h2 {
      font-size: 3rem;
      font-weight: 900;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff 0%, var(--accent-purple-light) 50%, var(--accent-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
    }

    :host ::ng-deep .section-header h2 span {
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    :host ::ng-deep .section-header p {
      color: var(--text-secondary);
      font-size: 1.2rem;
      font-weight: 500;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Hero Section with Parallax Float Composition */
    :host ::ng-deep .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4rem;
      padding: 8rem 2rem 4rem;
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .hero-content {
      flex: 1.2;
      max-width: 700px;
      text-align: left;
    }

    [dir="rtl"] :host ::ng-deep .hero-content {
      text-align: right;
    }

    :host ::ng-deep .badge {
      display: inline-block;
      padding: 0.75rem 1.8rem;
      background: rgba(124, 90, 246, 0.1);
      border: 1px solid rgba(124, 90, 246, 0.25);
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent-purple-light);
      margin-bottom: 2.5rem;
      box-shadow: 0 4px 20px rgba(124, 90, 246, 0.15);
    }

    :host ::ng-deep .hero-title {
      font-size: 4.5rem;
      font-weight: 900;
      line-height: 1.15;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1.5px;
    }

    :host ::ng-deep .hero-title span {
      background: linear-gradient(90deg, var(--accent-purple-light) 0%, var(--accent-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    :host ::ng-deep .hero-subtitle {
      font-size: 1.4rem;
      color: var(--text-secondary);
      margin-bottom: 3rem;
      line-height: 1.8;
      font-weight: 500;
    }

    :host ::ng-deep .hero-actions {
      display: flex;
      gap: 1.5rem;
    }

    :host ::ng-deep .btn {
      padding: 1.1rem 2.2rem;
      border-radius: 16px;
      font-weight: 700;
      text-decoration: none;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.05rem;
      cursor: pointer;
    }

    :host ::ng-deep .btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-glow);
    }

    :host ::ng-deep .btn-primary:hover {
      transform: none;
      box-shadow: 0 0 50px rgba(124, 58, 237, 0.45);
    }

    :host ::ng-deep .btn-secondary {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
      border: 1px solid var(--glass-border);
    }

    :host ::ng-deep .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: none;
    }

    :host ::ng-deep .hero-image {
      flex: 0.8;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    :host ::ng-deep .image-wrapper {
      position: relative;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      overflow: visible;
      box-shadow: var(--shadow-glow);
      border: 2px solid rgba(124, 90, 246, 0.25);
    }

    :host ::ng-deep .profile-avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
      border: 2px solid rgba(124, 90, 246, 0.3);
      animation: morph 8s ease-in-out infinite;
      box-shadow: var(--shadow-glow);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: block;
      background: transparent !important;
    }

    :host ::ng-deep .hero-float-badge {
      position: absolute;
      padding: 0.8rem 1.4rem;
      background: rgba(11, 16, 32, 0.8);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: var(--shadow-card);
      animation: badgeFloat 4s ease-in-out infinite;
      color: #fff;
    }

    .badge-projects {
      top: 15%;
      right: -30px;
      animation-delay: 0s;
    }

    .badge-skills {
      bottom: 15%;
      left: -30px;
      animation-delay: 2s;
    }

    @keyframes badgeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    /* About Section */
    :host ::ng-deep .about {
      padding: 6rem 2rem;
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .about-main-card {
      position: relative;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius);
      padding: 3.5rem 3rem;
      box-shadow: var(--shadow-card);
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :host ::ng-deep .about-main-card:hover {
      border-color: rgba(6, 182, 212, 0.4);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.25);
      transform: none;
    }

    :host ::ng-deep .about-glow {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
      filter: blur(50px);
      z-index: 1;
      pointer-events: none;
    }

    :host ::ng-deep .about-body {
      position: relative;
      z-index: 2;
    }

    :host ::ng-deep .about-quote-icon {
      font-family: 'Georgia', serif;
      font-size: 6rem;
      line-height: 1;
      color: rgba(255, 255, 255, 0.05);
      position: absolute;
      top: -30px;
      left: 15px;
      pointer-events: none;
    }

    [dir="rtl"] :host ::ng-deep .about-quote-icon {
      left: auto;
      right: 15px;
    }

    :host ::ng-deep .about-text {
      font-size: 1.45rem;
      line-height: 2;
      color: var(--text-primary);
      margin-bottom: 2.5rem;
      font-weight: 500;
      position: relative;
      z-index: 2;
    }

    :host ::ng-deep .about-brand-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--accent-purple-light);
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.2);
      padding: 0.4rem 1.2rem;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    :host ::ng-deep .about-brand-tag .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-purple-light);
      box-shadow: 0 0 8px var(--accent-purple-light);
    }

    /* Experience Timeline Section */
    :host ::ng-deep .experience {
      padding: 6rem 2rem;
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }

    :host ::ng-deep .timeline::before {
      content: '';
      position: absolute;
      left: 20px;
      width: 2px;
      height: 100%;
      background: linear-gradient(180deg, var(--accent-purple) 0%, var(--accent-cyan) 100%);
      opacity: 0.25;
    }

    [dir="rtl"] :host ::ng-deep .timeline::before {
      left: auto;
      right: 20px;
    }

    :host ::ng-deep .timeline-item {
      position: relative;
      margin-bottom: 3.5rem;
      padding-left: 60px;
    }

    [dir="rtl"] :host ::ng-deep .timeline-item {
      padding-left: 0;
      padding-right: 60px;
    }

    :host ::ng-deep .timeline-dot {
      position: absolute;
      left: 20px;
      transform: translateX(-50%);
      top: 10px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 20px var(--accent-cyan);
      z-index: 2;
      transition: var(--transition);
    }

    [dir="rtl"] :host ::ng-deep .timeline-dot {
      left: auto;
      right: 20px;
      transform: translateX(50%);
    }

    :host ::ng-deep .timeline-item:hover .timeline-dot {
      background: var(--accent-purple-light);
      box-shadow: 0 0 25px var(--accent-purple-light);
      transform: translateX(-38%);
    }

    [dir="rtl"] :host ::ng-deep .timeline-item:hover .timeline-dot {
      transform: translateX(38%);
    }

    :host ::ng-deep .timeline-content {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius);
      padding: 2.5rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :host ::ng-deep .timeline-content:hover {
      border-color: rgba(6, 182, 212, 0.4);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 25px rgba(6, 182, 212, 0.2);
      transform: none;
    }

    :host ::ng-deep .timeline-date {
      display: inline-block;
      padding: 0.5rem 1.25rem;
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--accent-cyan);
      margin-bottom: 1.25rem;
    }

    :host ::ng-deep .timeline-content h3 {
      font-size: 1.7rem;
      font-weight: 850;
      margin-bottom: 0.5rem;
      color: #fff;
    }

    :host ::ng-deep .timeline-content h4 {
      font-size: 1.3rem;
      font-weight: 650;
      color: var(--accent-purple-light);
      margin-bottom: 1.25rem;
    }

    :host ::ng-deep .timeline-content p {
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 1.1rem;
    }

    /* Skills Section styling */
    :host ::ng-deep .skills {
      padding: 6rem 2rem;
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      max-width: 900px;
      margin: 0 auto;
    }

    :host ::ng-deep .skill-pill {
      padding: 0.8rem 1.8rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      color: var(--text-primary);
      transition: var(--transition);
      cursor: default;
      font-size: 1.15rem;
    }

    :host ::ng-deep .skill-pill:hover {
      background: rgba(255,255,255,0.02);
      border-color: var(--accent-cyan);
      transform: none;
      box-shadow: var(--shadow-glow-cyan);
    }

    :host ::ng-deep .skill-pill .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 10px var(--accent-cyan);
    }

    :host ::ng-deep .skill-pill:hover .dot {
      background: #fff;
      box-shadow: 0 0 12px #fff;
    }

    /* ══════════ ADVANCED PROJECTS SECTION & CARDS ══════════ */
    :host ::ng-deep .projects {
      padding: 6rem 2rem;
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      position: relative;
    }

    :host ::ng-deep .project-card-wrapper {
      position: relative;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    /* Floating glowing backdrops behind cards */
    :host ::ng-deep .project-card-glow {
      position: absolute;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0;
      z-index: -1;
      pointer-events: none;
      transition: all 0.6s ease;
    }

    :host ::ng-deep .glow-blue {
      background: var(--accent-blue);
      top: 20%;
      left: 20%;
    }

    :host ::ng-deep .glow-purple {
      background: var(--accent-purple);
      bottom: 20%;
      right: 20%;
    }

    :host ::ng-deep .glow-cyan {
      background: var(--accent-cyan);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    :host ::ng-deep .project-card-wrapper:hover .project-card-glow {
      opacity: 0.35;
      width: 220px;
      height: 220px;
    }

    :host ::ng-deep .project-card {
      overflow: hidden;
      position: relative;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0 !important;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(11, 16, 32, 0.5) !important;
    }

    /* Glass reflective sweep */
    :host ::ng-deep .glass-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.03) 40%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 60%, transparent 70%);
      transform: translateX(-100%);
      transition: transform 0.8s ease;
      pointer-events: none;
      z-index: 5;
    }

    :host ::ng-deep .project-card-wrapper:hover .glass-shimmer {
      transform: translateX(100%);
    }

    /* Floating Image Container with Parallax Cover */
    :host ::ng-deep .project-img-wrap {
      height: 180px;
      width: 100%;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    :host ::ng-deep .project-img {
      height: 100%;
      width: 100%;
      background-size: cover;
      background-position: center;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255,255,255,0.01);
    }

    :host ::ng-deep .project-img.has-image {
      transform: scale(1.01);
    }

    :host ::ng-deep .project-card-wrapper:hover .project-img.has-image {
      transform: scale(1.05);
    }

    :host ::ng-deep .fallback-icon {
      font-size: 4rem;
      color: rgba(255, 255, 255, 0.04);
      filter: drop-shadow(0 0 10px rgba(124, 90, 246, 0.1));
      transition: var(--transition);
    }

    :host ::ng-deep .project-card-wrapper:hover .fallback-icon {
      transform: scale(1.1);
      color: rgba(124, 90, 246, 0.3);
    }

    :host ::ng-deep .glass-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 60%, rgba(11, 16, 32, 0.9) 100%);
      z-index: 2;
    }

    /* Info Area */
    :host ::ng-deep .project-info {
      padding: 1.75rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 3;
    }

    /* Futuristic tags */
    :host ::ng-deep .tech-pills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    :host ::ng-deep .tech-pill {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.06);
      border: 1px solid rgba(6, 182, 212, 0.15);
      padding: 0.35rem 0.85rem;
      border-radius: 50px;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: var(--transition);
    }

    :host ::ng-deep .tech-pill .pill-dot {
      width: 5px;
      height: 5px;
      background: var(--accent-cyan);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--accent-cyan);
      display: inline-block;
    }

    :host ::ng-deep .project-card-wrapper:hover .tech-pill {
      border-color: rgba(6, 182, 212, 0.5);
      background: rgba(6, 182, 212, 0.12);
      color: #fff;
    }

    :host ::ng-deep .project-info h3 {
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
      color: #fff;
      letter-spacing: -0.5px;
      transition: var(--transition);
    }

    :host ::ng-deep .project-card-wrapper:hover .project-info h3 {
      color: var(--accent-purple-light);
    }

    :host ::ng-deep .project-info p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    /* CTA wrapper and button with magnetic micro-animations */
    :host ::ng-deep .cta-wrap {
      margin-top: auto;
    }

    :host ::ng-deep .project-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
      font-weight: 750;
      font-size: 1.05rem;
      color: #fff;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      transition: var(--transition);
    }

    :host ::ng-deep .project-cta i {
      font-size: 0.9rem;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :host ::ng-deep .project-card-wrapper:hover .project-cta {
      background: var(--gradient-primary);
      border-color: transparent;
      box-shadow: var(--shadow-glow);
    }

    :host ::ng-deep .project-card-wrapper:hover .project-cta i {
      transform: translateX(6px);
    }

    [dir="rtl"] :host ::ng-deep .project-card-wrapper:hover .project-cta i {
      transform: translateX(-6px);
    }

    /* Hover card neon glow borders */
    :host ::ng-deep .project-card-wrapper:hover .project-card {
      border-color: rgba(124, 90, 246, 0.5);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(124, 90, 246, 0.3);
    }

    /* Contact Section styling */
    :host ::ng-deep .contact {
      padding: 6rem 2rem;
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .contact-box {
      max-width: 850px;
      margin: 0 auto;
      text-align: center;
      padding: 4rem 3rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(11, 16, 32, 0.6) 100%);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-card);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :host ::ng-deep .contact-box:hover {
      border-color: rgba(124, 90, 246, 0.35);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(124, 90, 246, 0.25);
      transform: none;
    }

    :host ::ng-deep .contact-info h2 {
      font-size: 2.8rem;
      font-weight: 900;
      margin-bottom: 1.25rem;
      background: linear-gradient(135deg, #ffffff 0%, var(--accent-purple-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
    }

    :host ::ng-deep .contact-info h2 span {
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    :host ::ng-deep .contact-info p {
      color: var(--text-secondary);
      font-size: 1.2rem;
      margin-bottom: 3rem;
      font-weight: 500;
    }

    :host ::ng-deep .social-links {
      display: flex;
      justify-content: center;
      gap: 1.75rem;
      margin-bottom: 3rem;
    }

    :host ::ng-deep .social-icon {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: var(--text-primary);
      transition: var(--transition);
      box-shadow: var(--shadow-card);
    }

    :host ::ng-deep .social-icon:hover {
      background: var(--gradient-primary);
      border-color: transparent;
      transform: none;
      box-shadow: var(--shadow-glow);
      color: white;
    }

    :host ::ng-deep .btn-large {
      padding: 1.25rem 2.75rem;
      font-size: 1.15rem;
    }

    /* Footer */
    :host ::ng-deep footer {
      padding: 3rem 2rem;
      text-align: center;
      border-top: 1px solid var(--glass-border);
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 500;
      background: rgba(7, 10, 20, 0.95);
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    :host ::ng-deep footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 2px;
      background: var(--gradient-primary);
      border-radius: 2px;
    }

    :host ::ng-deep footer .container {
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep footer p {
      margin-bottom: 0.5rem;
      line-height: 1.8;
    }

    :host ::ng-deep footer .footer-brand {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(90deg, var(--accent-purple-light), var(--accent-cyan));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    :host ::ng-deep footer .footer-divider {
      display: inline-block;
      margin: 0 0.75rem;
      color: var(--glass-border);
    }

    /* Share Profile Button */
    :host ::ng-deep .share-btn {
      padding: 0.9rem 1.6rem;
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 750;
      font-size: 0.95rem;
      cursor: pointer;
      box-shadow: var(--shadow-glow);
      transition: var(--transition);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      max-width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host ::ng-deep .share-btn:hover {
      transform: none;
      box-shadow: 0 0 50px rgba(124, 58, 237, 0.55);
    }

    :host ::ng-deep .share-btn.hidden {
      display: none;
    }

    /* Back to Top Button */
    :host ::ng-deep .back-to-top {
      position: fixed;
      bottom: 2.5rem;
      right: 2.5rem;
      width: 50px;
      height: 50px;
      background: var(--gradient-primary);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      box-shadow: var(--shadow-glow);
      transition: var(--transition);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
    }

    :host ::ng-deep .back-to-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    :host ::ng-deep .back-to-top:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 60px rgba(124, 58, 237, 0.55);
    }

    [dir="rtl"] :host ::ng-deep .back-to-top {
      right: auto;
      left: 2.5rem;
    }

    :host ::ng-deep .mobile-menu-btn {
      display: none;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      width: 42px; height: 42px;
      align-items: center; justify-content: center;
      transition: var(--transition);
    }

    /* Mobile Menu styles */
    :host ::ng-deep .mobile-menu-overlay {
      position: fixed;
      inset: 0;
      background: rgba(11, 16, 32, 0.97);
      backdrop-filter: blur(30px);
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: var(--transition);
    }

    :host ::ng-deep .mobile-menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    :host ::ng-deep .mobile-menu-close {
      position: absolute;
      top: 2.5rem;
      right: 2.5rem;
      background: none;
      border: none;
      color: #fff;
      font-size: 2.5rem;
      cursor: pointer;
      transition: var(--transition);
    }

    :host ::ng-deep .mobile-menu-close:hover {
      transform: none;
      color: var(--accent-cyan);
    }

    :host ::ng-deep .mobile-nav-links {
      list-style: none;
      text-align: center;
    }

    :host ::ng-deep .mobile-nav-links li {
      margin: 2rem 0;
    }

    :host ::ng-deep .mobile-nav-links a {
      color: #fff;
      text-decoration: none;
      font-size: 1.8rem;
      font-weight: 800;
      transition: var(--transition);
    }

    :host ::ng-deep .mobile-nav-links a:hover {
      color: var(--accent-cyan);
      letter-spacing: 1px;
    }

    /* Loader */
    #loader {
      position: fixed;
      inset: 0;
      background: var(--bg-primary);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }

    #loader.fade {
      opacity: 0;
      visibility: hidden;
    }

    .ld-ring {
      display: inline-block;
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.05);
      border-top-color: var(--accent-purple-light);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 992px) {
      :host ::ng-deep .hero {
        flex-direction: column;
        text-align: center;
        padding-top: 8rem;
        gap: 4rem;
      }
      :host ::ng-deep .hero-content {
        text-align: center;
      }
      [dir="rtl"] :host ::ng-deep .hero-content {
        text-align: center;
      }
      :host ::ng-deep .hero-title {
        font-size: 3rem;
      }
      :host ::ng-deep .hero-actions {
        justify-content: center;
      }
      :host ::ng-deep .image-wrapper {
        width: 320px;
        height: 320px;
      }
    }

    /* Responsive Design - Mobile First */
    @media (max-width: 768px) {
      :host ::ng-deep .nav-links {
        display: none !important;
      }

      :host ::ng-deep .mobile-menu-btn {
        display: flex !important;
      }

      :host ::ng-deep .hero {
        padding: 4rem 1.5rem;
      }

      :host ::ng-deep .hero-title {
        font-size: 2rem !important;
      }

      :host ::ng-deep .hero-subtitle {
        font-size: 1rem !important;
      }

      :host ::ng-deep .hero-actions {
        flex-direction: column;
        gap: 1rem;
      }

      :host ::ng-deep .image-wrapper {
        width: 200px !important;
        height: 200px !important;
      }

      :host ::ng-deep .projects-grid {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
      }

      :host ::ng-deep .project-img-wrap {
        height: 200px !important;
      }

      :host ::ng-deep .project-info {
        padding: 1.25rem !important;
      }

      :host ::ng-deep .project-info h3 {
        font-size: 1.2rem !important;
      }

      :host ::ng-deep .skills-grid {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
        gap: 1rem !important;
      }

      :host ::ng-deep .timeline-item {
        padding-left: 1.5rem !important;
      }

      :host ::ng-deep .timeline-dot {
        left: -0.5rem !important;
      }

      :host ::ng-deep .social-links {
        gap: 1rem !important;
      }

      :host ::ng-deep .social-icon {
        width: 40px !important;
        height: 40px !important;
        font-size: 1rem !important;
      }

      :host ::ng-deep .footer-brand {
        font-size: 1rem !important;
      }

      :host ::ng-deep footer p {
        font-size: 0.85rem !important;
      }

      :host ::ng-deep .back-to-top {
        bottom: 1.5rem !important;
        right: 1.5rem !important;
        width: 45px !important;
        height: 45px !important;
      }

      [dir="rtl"] :host ::ng-deep .back-to-top {
        right: auto !important;
        left: 1.5rem !important;
      }
    }

    @media (max-width: 480px) {
      :host ::ng-deep .hero {
        padding: 3rem 1rem;
      }

      :host ::ng-deep .hero-title {
        font-size: 1.75rem !important;
      }

      :host ::ng-deep .hero-subtitle {
        font-size: 0.9rem !important;
      }

      :host ::ng-deep .image-wrapper {
        width: 150px !important;
        height: 150px !important;
      }

      :host ::ng-deep .project-img-wrap {
        height: 180px !important;
      }

      :host ::ng-deep .project-info h3 {
        font-size: 1.1rem !important;
      }

      :host ::ng-deep .project-info p {
        font-size: 0.9rem !important;
      }

      :host ::ng-deep .tech-pill {
        font-size: 0.75rem !important;
        padding: 0.3rem 0.7rem !important;
      }

      :host ::ng-deep .skills-grid {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)) !important;
      }

      :host ::ng-deep .skill-card {
        padding: 1rem !important;
      }

      :host ::ng-deep .skill-card h4 {
        font-size: 0.9rem !important;
      }

      :host ::ng-deep .section-title {
        font-size: 1.75rem !important;
      }

      :host ::ng-deep .section-subtitle {
        font-size: 0.9rem !important;
      }

      :host ::ng-deep .share-btn {
        padding: 0.75rem 1.25rem !important;
        font-size: 0.85rem !important;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      :host ::ng-deep .projects-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
      }

      :host ::ng-deep .skills-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
      }

      :host ::ng-deep .hero-title {
        font-size: 2.5rem !important;
      }

      :host ::ng-deep .image-wrapper {
        width: 280px !important;
        height: 280px !important;
      }
    }

    @media (min-width: 1025px) and (max-width: 1440px) {
      :host ::ng-deep .projects-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
      }

      :host ::ng-deep .hero-title {
        font-size: 2.75rem !important;
      }
    }
  `]

})
export class PublicPortfolioComponent implements OnInit, OnDestroy {
  readonly hoverCardId = signal<number | null>(null);
  readonly imageLoadFailed = signal<boolean>(false);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  readonly themeService = inject(ThemeService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly safeCustomCss = signal<SafeHtml | null>(null);

  decodeCss(encoded: string): string {
    if (!encoded) return '';
    try {
      return decodeURIComponent(escape(atob(encoded)));
    } catch {
      try {
        return atob(encoded);
      } catch {
        try {
          return decodeURIComponent(encoded);
        } catch {
          return encoded;
        }
      }
    }
  }

  readonly userId = signal<string | null>(null);
  readonly loading = signal<boolean>(true);
  readonly notFound = signal<boolean>(false);
  
  // Data Signals
  readonly profile = signal<any>(null);
  readonly projects = signal<any[]>([]);
  readonly skills = signal<any[]>([]);
  readonly experiences = signal<any[]>([]);
  readonly contact = signal<any>(null);

  // UI state
  readonly mobileMenuOpen = signal<boolean>(false);
  readonly shareButtonText = signal<string>('نسخ رابط الملف الشخصي');
  readonly copied = signal<boolean>(false);
  readonly isLoginPage = signal<boolean>(false);
  readonly showBackToTop = signal<boolean>(false);

  // Section order
  readonly sectionOrder = signal<string[]>(['hero', 'about', 'skills', 'experience', 'projects', 'contact']);

  // LTR/RTL link handles
  readonly arHref = signal<string>('');
  readonly enHref = signal<string>('');

  // Translations
  readonly activeLang = signal<'ar' | 'en'>('ar');
  readonly t = {
    ar: {
      about: 'من أنا',
      experience: 'الخبرات',
      skills: 'المهارات',
      projects: 'المشاريع',
      contact: 'تواصل معي',
      welcome: 'مرحباً بك في مساحتي الإبداعية 👋',
      iAm: 'أنا ',
      titleFallback: 'مطور برمجيات ومصمم',
      aboutFallback: 'أسعى لتحويل الأفكار المعقدة إلى تجارب رقمية بسيطة، أنيقة، وعالية الأداء. أهتم بالتفاصيل المعمارية وأؤمن بقوة التصميم الجيد.',
      browseProjects: 'تصفح أعمالي',
      contactMe: 'تواصل معي',
      projectSuffix: ' مشاريع',
      skillSuffix: ' مهارات',
      aboutTitle: 'نبذة ',
      aboutTitleSpan: 'عني',
      aboutSubtitle: 'من أنا وماذا أقدم',
      experienceTitle: 'الخبرات ',
      experienceTitleSpan: 'والإنجازات',
      experienceSubtitle: 'مسيرتي المهنية والتعليمية',
      noExperience: 'لا يوجد خبرات مضافة بعد.',
      skillsTitle: 'المهارات ',
      skillsTitleSpan: 'والخبرات',
      skillsSubtitle: 'الأدوات والتقنيات التي أستخدمها في بناء المشاريع',
      noSkills: 'لا يوجد مهارات مضافة حالياً.',
      projectsTitle: 'أحدث ',
      projectsTitleSpan: 'مشاريعي',
      projectsSubtitle: 'بعض من الأعمال التي أفخر بها',
      noProjects: 'لا يوجد مشاريع مضافة بعد.',
      viewDetails: 'عرض التفاصيل',
      contactTitle: 'لنتحدث عن ',
      contactTitleSpan: 'مشروعك القادم',
      contactSubtitle: 'أنا متاح دائماً للنقاش حول الأفكار الجديدة، المشاريع، أو حتى لمجرد إلقاء التحية.',
      sendMessage: 'أرسل لي رسالة',
      noContact: 'لا توجد بيانات اتصال مضافة بعد.',
      footerRights: 'جميع الحقوق محفوظة | تم التصميم بشغف 💡',
      shareText: 'نسخ رابط الملف الشخصي',
      copiedText: 'تم النسخ! ✓',
      notFoundTitle: 'لم يتم العثور على الملف الشخصي',
      notFoundSub: 'هذه الصفحة غير موجودة، تم حذفها، أو تم إخفاؤها.',
      viewCertificate: 'عرض الشهادة',
      langLabel: 'العربية',
      backEndTitle: 'تطوير الواجهات الخلفية',
      backEndDesc: 'بناء أنظمة قوية ومستقرة باستخدام تقنيات .NET، مع التركيز على الأداء العالي والتصميم المعماري النظيف (Clean Architecture).',
      frontEndTitle: 'تطوير الواجهات الأمامية',
      frontEndDesc: 'تصميم واجهات مستخدم تفاعلية وحديثة تضمن تجربة استخدام ممتازة على كافة الأجهزة المحمولة والمكتبية.',
      problemSolvingTitle: 'حل المشكلات',
      problemSolvingDesc: 'تحليل المتمتطلبات المعقدة وتحويلها إلى حلول برمجية قابلة للتطوير والصيانة بكفاءة عالية.',
    },
    en: {
      about: 'About Me',
      experience: 'Experiences',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
      welcome: '✨ Welcome to my creative space',
      iAm: 'I am ',
      titleFallback: 'Software Developer & Designer',
      aboutFallback: 'I strive to transform complex ideas into simple, elegant, and high-performance digital experiences.',
      browseProjects: 'View My Work',
      contactMe: 'Contact Me',
      projectSuffix: ' Projects',
      skillSuffix: ' Skills',
      aboutTitle: 'About ',
      aboutTitleSpan: 'Me',
      aboutSubtitle: 'Who I am & what I do',
      experienceTitle: 'Experiences & ',
      experienceTitleSpan: 'Education',
      experienceSubtitle: 'My professional and educational journey',
      noExperience: 'No experiences listed yet.',
      skillsTitle: 'Skills & ',
      skillsTitleSpan: 'Expertise',
      skillsSubtitle: 'Tools and technologies I use to build projects',
      noSkills: 'No skills listed yet.',
      projectsTitle: 'Featured ',
      projectsTitleSpan: 'Projects',
      projectsSubtitle: 'Some of the works I am proud of',
      noProjects: 'No projects listed yet.',
      viewDetails: 'View Details',
      contactTitle: "Let's work ",
      contactTitleSpan: 'Together',
      contactSubtitle: 'I am always open to discussing new ideas, projects, or just to say hello.',
      sendMessage: 'Send Me a Message',
      noContact: 'No contact details registered yet.',
      footerRights: 'All rights reserved | Designed with passion 💡',
      shareText: 'Copy Profile Link',
      copiedText: 'Copied! ✓',
      notFoundTitle: 'Profile Not Found',
      notFoundSub: 'This page does not exist, has been deleted, or is hidden.',
      viewCertificate: 'View Certificate',
      langLabel: 'English',
      backEndTitle: 'Backend Development',
      backEndDesc: 'Building robust and scalable systems using .NET technologies, with a focus on high performance and Clean Architecture.',
      frontEndTitle: 'Frontend Development',
      frontEndDesc: 'Designing interactive and modern user interfaces that ensure excellent experience across mobile and desktop devices.',
      problemSolvingTitle: 'Problem Solving',
      problemSolvingDesc: 'Analyzing complex requirements and translating them into scalable and maintainable software solutions.',
    }
  };

  setLanguage(lang: 'ar' | 'en'): void {
    this.activeLang.set(lang);
    if (lang === 'en') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      this.shareButtonText.set(this.t.en.shareText);
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      this.shareButtonText.set(this.t.ar.shareText);
    }
  }

  onLangSwitch(lang: 'ar' | 'en'): void {
    this.setLanguage(lang);
    this.router.navigate([lang === 'en' ? '/profile' : '/portfolio', this.userId()]);
  }

  ngOnInit(): void {
    // 1. Check if on login page
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.isLoginPage.set(currentUrl === '/login' || currentUrl === '/register');
    });

    // 2. Detect language from current route pathname
    const isProfileRoute = window.location.pathname.includes('/profile');
    this.setLanguage(isProfileRoute ? 'en' : 'ar');

    // 3. Add scroll listener for back to top button
    window.addEventListener('scroll', this.onScroll.bind(this));

    // 4. Resolve userId from QueryParams or PathParams
    this.route.queryParams.subscribe(params => {
      // Query param can also override language if specified (e.g. ?lang=en)
      if (params['lang'] === 'en' || params['l'] === 'en') {
        this.setLanguage('en');
      } else if (params['lang'] === 'ar' || params['l'] === 'ar') {
        this.setLanguage('ar');
      }

      let uid = params['userId'] || params['u'];
      if (!uid) {
        // Try path param
        uid = this.route.snapshot.paramMap.get('userId');
      }
      if (!uid) {
        // Fallback to local storage
        uid = localStorage.getItem('ld_userId') || '';
      }

      if (uid) {
        this.userId.set(uid);
        this.loadPortfolio(uid);
      } else {
        // Auto resolve from default or API
        this.autoResolveUserId();
      }
    });
  }

  private autoResolveUserId(): void {
    // Fetch any project to resolve a default userId
    this.portfolioService.getProjects('').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0 && res[0].userId) {
          const resolvedUid = res[0].userId;
          this.userId.set(resolvedUid);
          this.loadPortfolio(resolvedUid);
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

  private loadPortfolio(uid: string): void {
    this.loading.set(true);
    this.notFound.set(false);

    // Setup RTL & LTR links
    this.arHref.set(`/portfolio/${uid}`);
    this.enHref.set(`/profile/${uid}`);

    this.portfolioService.getUserProfile(uid).subscribe({
      next: (profile) => {
        if (!profile || !profile.isActive) {
          this.loading.set(false);
          this.notFound.set(true);
          return;
        }
        this.profile.set(profile);
        
        // Unpack and apply template theme & visibility
        const { theme, vis } = this.themeService.unpackTemplate(profile.template);
        this.themeService.applyTheme(theme);
        this.themeService.applyVisibility(vis);
        
        // Sanitize and inject custom CSS
        const rawCss = this.decodeCss(vis.custom_css || '');
        if (rawCss) {
          this.safeCustomCss.set(this.sanitizer.bypassSecurityTrustHtml(`<style>${rawCss}</style>`));
        } else {
          this.safeCustomCss.set(null);
        }
        
        // Set section order from visibility settings
        if (vis.sectionOrder && Array.isArray(vis.sectionOrder)) {
          this.sectionOrder.set(vis.sectionOrder);
        }

        // Load parallel child data
        this.loadChildData(uid);
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
      }
    });
  }

  private loadChildData(uid: string): void {
    // Projects
    this.portfolioService.getProjects(uid).subscribe({
      next: (res) => this.projects.set(res),
      error: () => {}
    });

    // Skills
    this.portfolioService.getSkills(uid).subscribe({
      next: (res) => this.skills.set(res),
      error: () => {}
    });

    // Experiences
    this.portfolioService.getExperiences(uid).subscribe({
      next: (res) => this.experiences.set(res),
      error: () => {}
    });

    // Contacts
    this.portfolioService.getContact(uid).subscribe({
      next: (res) => this.contact.set(res),
      error: () => {}
    });

    // Complete loading
    setTimeout(() => {
      this.loading.set(false);
      this.init3DTilt();
    }, 450);
  }

  private init3DTilt(): void {
    setTimeout(() => {
      // Only apply 3D tilt to about section cards, not project cards
      const cards = document.querySelectorAll('.about-main-card.glass-card, .image-wrapper');
      cards.forEach(card => {
        const c = card as HTMLElement;
        c.addEventListener('mousemove', (e: MouseEvent) => {
          if (this.themeService.visibility().about_tilt === false) return;
          const rect = c.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const xc = rect.width / 2;
          const yc = rect.height / 2;
          const angleX = (yc - y) / 12;
          const angleY = (x - xc) / 12;
          c.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1, 1, 1)`;
        });
        c.addEventListener('mouseleave', () => {
          c.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
      });
    }, 100);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  copyLink(): void {
    const routePrefix = this.activeLang() === 'en' ? 'profile' : 'portfolio';
    const shareUrl = `${window.location.protocol}//${window.location.host}/${routePrefix}/${this.userId()}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.copied.set(true);
      this.shareButtonText.set(this.t[this.activeLang()].copiedText);
      setTimeout(() => {
        this.copied.set(false);
        this.shareButtonText.set(this.t[this.activeLang()].shareText);
      }, 2000);
    });
  }

  // Parse cert helper
  getExperienceDescription(desc: string): { text: string; certUrl: string } {
    if (!desc) return { text: '', certUrl: '' };
    let text = desc;
    let certUrl = '';
    const match = desc.match(/\[CERTIFICATE:(.+?)\]/);
    if (match) {
      certUrl = match[1];
      text = desc.replace(match[0], '').trim();
    }
    // Only return certUrl if it's not empty
    if (!certUrl || certUrl.trim() === '') {
      certUrl = '';
    }
    return { text, certUrl };
  }

  getFullCertUrl(certUrl: string): string {
    if (!certUrl) return '';
    return certUrl.startsWith('/') ? `${this.portfolioService.apiHost}${certUrl}` : certUrl;
  }

  getProfileImageUrl(img: string): string {
    if (!img) return '';
    return img.startsWith('/') ? `${this.portfolioService.apiHost}${img}` : img;
  }

  formatUserName(name: string): string {
    if (!name) return '';
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  getShortBio(): string {
    const fullBio = this.profile()?.about || '';
    if (!fullBio) return this.t[this.activeLang()].aboutFallback;
    
    // If bio is short (less than 150 chars), use it as is
    if (fullBio.length < 150) return fullBio;
    
    // Otherwise, truncate to first sentence or ~120 chars
    const firstSentence = fullBio.split('.')[0];
    if (firstSentence.length < 120) return firstSentence + '.';
    
    return fullBio.substring(0, 120) + '...';
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

  getExperienceDateRange(exp: any): string {
    const start = this.formatDateString(exp.startDate);
    const end = exp.endDate ? this.formatDateString(exp.endDate) : 'Present';
    return `${start} - ${end}`;
  }

  getUniqueTechStack(techStack: string): string[] {
    if (!techStack) return [];
    const techArray = techStack.split(',').map(t => t.trim()).filter(t => t.length > 0);
    // Remove duplicates while preserving order
    return Array.from(new Set(techArray));
  }

  openCertificate(event: Event, url: string): void {
    event.preventDefault();
    // Open in same tab
    window.location.href = url;
    // Show toast notification
    this.showToast('Certificate opened successfully');
  }

  showToast(message: string): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      font-size: 0.95rem;
    `;

    // Add animation keyframes if not exists
    if (!document.getElementById('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  onScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.showBackToTop.set(scrollPosition > 300);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }
}
