import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService, VisibilitySettings } from '../../core/services/theme.service';
import { ProjectOrderService } from '../../core/services/project-order.service';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './dashboard.component.html',
  styles: [`
    /* Empty States */
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border: 2px dashed var(--border);
      border-radius: 24px;
      animation: fadeIn 0.5s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .empty-icon-wrapper {
      width: 90px;
      height: 90px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(135deg, var(--accent2) 0%, var(--accent) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
      box-shadow: 0 8px 24px rgba(108, 99, 255, 0.4);
    }

    .empty-icon {
      font-size: 2.5rem;
    }

    .empty-state h3 {
      font-size: 1.6rem;
      font-weight: 700;
      background: linear-gradient(135deg, #fff 0%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--muted);
      font-size: 0.95rem;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    /* Loading States */
    .loading-state {
      text-align: center;
      padding: 3rem 2rem;
    }

    .ld-ring {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid var(--border);
      border-top-color: var(--accent2);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    /* Profile Card Enhancements */
    .profile-card {
      background: linear-gradient(145deg, var(--surface) 0%, var(--surface2) 100%);
      border: 2px solid var(--border);
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(108, 99, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      animation: slideUp 0.5s ease;
      position: relative;
      overflow: hidden;
    }

    .profile-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--accent2) 0%, var(--accent) 50%, var(--accent2) 100%);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .profile-avatar-wrap {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid var(--accent2);
      box-shadow: 0 0 30px rgba(108, 99, 255, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(108, 99, 255, 0.2);
      animation: pulse 3s infinite;
      position: relative;
    }

    .profile-avatar-wrap::after {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      background: linear-gradient(45deg, var(--accent2), var(--accent), var(--accent2));
      z-index: -1;
      animation: rotate 4s linear infinite;
    }

    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .profile-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      background: linear-gradient(135deg, var(--surface2) 0%, var(--surface) 100%);
    }

    .profile-top {
      display: flex;
      gap: 2.5rem;
      align-items: flex-start;
    }

    .profile-meta {
      flex: 1;
    }

    .profile-meta[style*="text-align:center"] {
      text-align: center !important;
    }

    .profile-meta[style*="text-align:center"] .profile-title-badge {
      display: inline-block;
    }

    .profile-name {
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, var(--accent2) 50%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 10px rgba(108, 99, 255, 0.3);
      letter-spacing: -0.5px;
    }

    .profile-title-badge {
      display: inline-block;
      padding: 10px 24px;
      background: linear-gradient(135deg, var(--accent2) 0%, var(--accent) 100%);
      border-radius: 24px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
      margin-top: 0.5rem;
      box-shadow: 0 4px 15px rgba(108, 99, 255, 0.4), 0 0 20px rgba(108, 99, 255, 0.2);
      transition: all 0.3s ease;
    }

    .profile-title-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(108, 99, 255, 0.5), 0 0 30px rgba(108, 99, 255, 0.3);
    }

    .profile-status {
      display: inline-block;
      margin-top: 1rem;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid transparent;
      transition: all 0.3s ease;
    }

    .profile-status.active {
      background: rgba(0, 255, 163, 0.15);
      color: var(--success);
      border-color: rgba(0, 255, 163, 0.3);
      box-shadow: 0 0 15px rgba(0, 255, 163, 0.2);
    }

    .profile-status.active:hover {
      background: rgba(0, 255, 163, 0.25);
      box-shadow: 0 0 25px rgba(0, 255, 163, 0.3);
    }

    .profile-status:not(.active) {
      background: rgba(255, 0, 122, 0.15);
      color: var(--danger);
      border-color: rgba(255, 0, 122, 0.3);
      box-shadow: 0 0 15px rgba(255, 0, 122, 0.2);
    }

    .profile-status:not(.active):hover {
      background: rgba(255, 0, 122, 0.25);
      box-shadow: 0 0 25px rgba(255, 0, 122, 0.3);
    }

    /* Glass Cards */
    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .glass-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }

    /* Project Cards */
    .project-card {
      overflow: hidden;
      animation: fadeInUp 0.5s ease;
    }

    .project-card-img {
      position: relative;
      overflow: hidden;
    }

    .project-card-img img {
      transition: transform 0.3s ease;
    }

    .project-card:hover .project-card-img img {
      transform: scale(1.05);
    }

    /* Skill Chips */
    .skill-chip {
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border: 1px solid var(--border);
      border-radius: 25px;
      padding: 8px 18px;
      font-weight: 600;
      transition: all 0.3s ease;
      animation: fadeIn 0.5s ease;
    }

    .skill-chip:hover {
      transform: scale(1.05);
      border-color: var(--accent2);
      box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3);
    }

    /* Contact Cards */
    .contact-card {
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
      animation: slideUp 0.5s ease;
    }

    .contact-link {
      transition: all 0.3s ease;
    }

    .contact-link:hover {
      transform: translateY(-2px);
      background: var(--accent2);
      color: #fff !important;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr !important;
      }

      .profile-top {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .profile-avatar-wrap {
        margin: 0 auto;
      }

      .profile-stats {
        grid-template-columns: repeat(2, 1fr) !important;
      }

      .appearance-grid {
        grid-template-columns: 1fr !important;
      }

      .empty-state {
        padding: 2rem 1rem;
      }

      .empty-icon-wrapper {
        width: 60px;
        height: 60px;
      }

      .empty-icon {
        font-size: 2rem;
      }

      .empty-state h3 {
        font-size: 1.2rem;
      }
    }

    /* Profile Grid Layout */
    .profile-grid {
      animation: fadeIn 0.5s ease;
      gap: 2rem;
    }

    /* Sidebar Cards */
    .sidebar-card {
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border: 2px solid var(--border);
      transition: all 0.3s ease;
      padding: 1.75rem;
      position: relative;
      overflow: hidden;
    }

    .sidebar-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(108, 99, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .sidebar-card:hover::before {
      left: 100%;
    }

    .sidebar-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(108, 99, 255, 0.2);
      border-color: var(--accent2);
    }

    .sidebar-card h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      font-size: 1.15rem;
    }

    .sidebar-card h4 .card-title-text {
      background: linear-gradient(135deg, #fff 0%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Profile Stats Enhancement */
    .profile-stats {
      padding: 1rem !important;
      gap: 0.75rem !important;
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border-radius: 16px;
      border: 2px solid var(--border);
      position: relative;
      overflow: hidden;
    }

    .profile-stats::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(108, 99, 255, 0.1) 0%, transparent 70%);
      animation: rotate 20s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .stat-item {
      padding: 0.75rem;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border: 2px solid var(--border);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      z-index: 1;
    }

    .stat-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent2), var(--accent));
      border-radius: 12px 12px 0 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .stat-item:hover::before {
      opacity: 1;
    }

    .stat-item:hover {
      transform: translateY(-4px) scale(1.03);
      background: linear-gradient(135deg, var(--surface2) 0%, var(--surface) 100%);
      border-color: var(--accent2);
      box-shadow: 0 8px 24px rgba(108, 99, 255, 0.3), 0 0 0 1px rgba(108, 99, 255, 0.1);
    }

    .stat-icon {
      font-size: 1.25rem !important;
      margin-bottom: 0.25rem !important;
      filter: drop-shadow(0 2px 8px rgba(108, 99, 255, 0.3));
      transition: transform 0.3s ease;
    }

    .stat-item:hover .stat-icon {
      transform: scale(1.2) rotate(5deg);
    }

    .stat-value {
      font-size: 1.5rem !important;
      font-weight: 900;
      background: linear-gradient(135deg, #fff 0%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 10px rgba(108, 99, 255, 0.2);
    }

    .stat-label {
      font-size: 0.7rem !important;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--muted);
    }

    /* Profile About Enhancement */
    .profile-about {
      padding: 1rem;
      background: var(--surface);
      border-radius: 16px;
      border: 1px solid var(--border);
    }

    .profile-about h4 {
      margin-bottom: 0.5rem;
      color: var(--accent2);
      font-size: 1rem;
    }

    .profile-about p {
      line-height: 1.6;
      color: var(--text);
      font-size: 0.9rem;
    }

    /* Button Enhancements */
    .btn {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
    }

    .btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(108, 99, 255, 0.5);
    }

    .btn:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent2) 0%, var(--accent) 100%);
      border: none;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, var(--accent2) 0%, var(--accent) 100%);
      filter: brightness(1.1);
    }

    .btn-secondary {
      background: var(--surface);
      border: 2px solid var(--border);
    }

    .btn-secondary:hover {
      border-color: var(--accent2);
      background: var(--surface2);
    }

    /* Section Headers */
    .section-header {
      animation: fadeIn 0.5s ease;
      position: relative;
    }

    .section-header::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, var(--accent2), var(--accent));
      border-radius: 2px;
      animation: expandWidth 0.5s ease;
    }

    @keyframes expandWidth {
      from { width: 0; }
      to { width: 60px; }
    }

    .section-title {
      background: linear-gradient(135deg, #fff 0%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    /* Sidebar Enhancements */
    .sidebar {
      transition: all 0.3s ease;
    }

    .nav-item {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      margin: 4px 0;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: linear-gradient(180deg, var(--accent2), var(--accent));
      transform: scaleY(0);
      transition: transform 0.3s ease;
      border-radius: 2px;
    }

    .nav-item.active::before {
      transform: scaleY(1);
    }

    .nav-item.active {
      background: rgba(108, 99, 255, 0.15);
      border: 1px solid rgba(108, 99, 255, 0.2);
    }

    .nav-item:hover {
      background: rgba(108, 99, 255, 0.1);
      transform: translateX(4px);
    }

    /* Logout Button */
    .btn-logout {
      background: linear-gradient(135deg, var(--danger) 0%, #ff4757 100%);
      border: none;
      color: #fff;
      font-size: 0.9rem;
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(255, 0, 122, 0.3);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-logout:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(255, 0, 122, 0.5);
    }

    .btn-logout:active {
      transform: scale(0.95);
    }

    /* Scrollbar Removal for Profile Section */
    .profile-section::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }

    .profile-section {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    /* Modal Enhancements */
    .modal {
      animation: slideUp 0.4s ease;
      border: 2px solid var(--border);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .modal form {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .modal-header {
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border-bottom: 2px solid var(--border);
      padding: 1.5rem;
    }

    .modal-header h3 {
      background: linear-gradient(135deg, #fff 0%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 2px solid var(--border);
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
    }

    /* Theme Cards */
    .theme-card {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .theme-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(108, 99, 255, 0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .theme-card:hover::before {
      opacity: 1;
    }

    .theme-card:hover {
      transform: translateY(-6px) scale(1.02);
      border-color: var(--accent2);
      box-shadow: 0 12px 32px rgba(108, 99, 255, 0.3);
    }

    .theme-card.active {
      border-color: var(--accent2);
      box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.3), 0 8px 24px rgba(108, 99, 255, 0.2);
    }

    .theme-card.active::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 8px;
      background: linear-gradient(135deg, var(--accent2), var(--accent));
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.4);
      animation: popIn 0.3s ease;
    }

    @keyframes popIn {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    /* Toggle Switches are styled globally in styles.css */

    /* Modern Sorting Buttons */
    .btn-sort {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      color: var(--muted);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-sort:hover {
      background: rgba(108, 99, 255, 0.12);
      border-color: var(--accent2);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.25);
    }

    .btn-sort:active {
      transform: translateY(0);
    }

    .sort-arrow {
      font-size: 0.65rem;
      font-weight: bold;
      transition: transform 0.25s ease;
    }

    .btn-sort:hover .sort-arrow {
      transform: scale(1.2);
    }

    /* Visibility Items */
    .visibility-list {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
      width: 100%;
    }

    .visibility-item {
      padding: 12px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: all 0.3s ease;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 100%;
    }

    .visibility-item:hover {
      border-color: var(--accent2);
      background: var(--surface2);
    }

    /* Toast Notifications */
    .toast {
      position: fixed;
      top: 18px;
      right: 18px;
      z-index: 9999;
      animation: slideInRight 0.3s ease;
    }

    .toast-inner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: min(320px, calc(100vw - 36px));
      max-width: min(420px, calc(100vw - 36px));
      padding: 0.75rem 1rem;
      border-radius: 12px;
      background: rgba(15, 18, 29, 0.9);
      border: 1px solid var(--border);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .toast-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      font-size: 0.8rem;
    }

    .toast-message {
      color: #fff;
      font-size: 0.88rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .toast.success .toast-inner {
      border-color: rgba(34, 211, 165, 0.25);
      background: rgba(15, 18, 29, 0.9);
    }

    .toast.success .toast-icon {
      background: rgba(34, 211, 165, 0.12);
      color: #22d3a5;
      border: 1px solid rgba(34, 211, 165, 0.25);
      box-shadow: 0 0 12px rgba(34, 211, 165, 0.15);
    }

    .toast.error .toast-inner {
      border-color: rgba(244, 63, 94, 0.25);
      background: rgba(15, 18, 29, 0.9);
    }

    .toast.error .toast-icon {
      background: rgba(244, 63, 94, 0.12);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.25);
      box-shadow: 0 0 12px rgba(244, 63, 94, 0.15);
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Responsive Design - Dashboard */
    @media (max-width: 1024px) {
      .sidebar {
        width: 260px !important;
      }

      .main-content {
        margin-left: 260px !important;
      }

      .sidebar.collapsed + .main-content {
        margin-left: 80px !important;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed !important;
        left: -100% !important;
        z-index: 1000 !important;
        transition: left 0.3s ease !important;
      }

      .sidebar.mobile-open {
        left: 0 !important;
      }

      .main-content {
        margin-left: 0 !important;
      }

      .sidebar.collapsed + .main-content {
        margin-left: 0 !important;
      }

      .topbar {
        padding: 1rem !important;
      }

      .topbar-title {
        font-size: 1.25rem !important;
      }

      .content-grid {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
      }

      .card {
        padding: 1.5rem !important;
      }

      .form-group {
        margin-bottom: 1rem !important;
      }

      .form-control {
        padding: 0.75rem !important;
        font-size: 0.9rem !important;
      }

      .btn {
        padding: 0.75rem 1.5rem !important;
        font-size: 0.9rem !important;
      }

      .table-responsive {
        overflow-x: auto !important;
      }

      .mobile-menu-btn {
        display: flex !important;
      }
    }

    @media (max-width: 480px) {
      .sidebar {
        width: 100% !important;
      }

      .topbar {
        padding: 0.75rem !important;
      }

      .topbar-title {
        font-size: 1rem !important;
      }

      .card {
        padding: 1rem !important;
      }

      .form-control {
        padding: 0.6rem !important;
        font-size: 0.85rem !important;
      }

      .btn {
        padding: 0.6rem 1.25rem !important;
        font-size: 0.85rem !important;
      }

      .user-badge {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0.5rem !important;
      }

      .user-avatar {
        width: 40px !important;
        height: 40px !important;
        font-size: 0.9rem !important;
      }

      .user-name {
        font-size: 0.9rem !important;
      }

      .user-role {
        font-size: 0.8rem !important;
      }

      .btn-logout {
        width: 36px !important;
        height: 36px !important;
        font-size: 0.85rem !important;
      }
    }

    @media (min-width: 769px) {
      .mobile-menu-btn {
        display: none !important;
      }
    }

    /* Sidebar Logo Styles */
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 2px solid var(--border);
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
      border: 2px solid var(--accent2);
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, var(--accent2) 50%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }

    .sidebar-toggle {
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border: 2px solid var(--border);
      color: var(--text);
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .sidebar-toggle:hover {
      background: var(--accent2);
      color: #fff;
      border-color: var(--accent2);
      transform: scale(1.05);
    }

    .sidebar.collapsed .sidebar-logo {
      display: none !important;
    }

    .sidebar.collapsed .sidebar-header {
      justify-content: center !important;
      padding: 1.25rem 0.5rem !important;
    }

    .sidebar.collapsed .logo-text {
      display: none;
    }

    /* Advanced CSS Stylesheet Workspace Layout overrides */
    .css-workspace-layout {
      display: flex !important;
      flex-direction: column !important;
      gap: 20px;
      min-height: 400px;
      margin-bottom: 0;
    }
    
    .css-editor-column {
      width: 100% !important;
    }
    
    .css-preview-column {
      width: 100% !important;
      min-width: 0;
    }

    /* Force beautiful Split View side-by-side columns ONLY on Large Screens (Desktop/Laptop) */
    @media (min-width: 1025px) {
      .css-workspace-layout.layout-split {
        display: grid !important;
        grid-template-columns: minmax(360px, 0.9fr) minmax(460px, 1.1fr) !important;
        gap: 16px !important;
        flex-direction: row !important;
      }
      
      .css-workspace-layout.layout-split .css-editor-column,
      .css-workspace-layout.layout-split .css-preview-column {
        width: auto !important;
      }
    }

    /* Prevent clipping when simulated devices are wider than their wrapper */
    .preview-iframe-wrapper {
      justify-content: flex-start !important; /* Prevents center-based left-side truncation on overflow */
      overflow-x: auto !important;
      overflow-y: hidden !important;
    }

    .preview-iframe-wrapper iframe {
      margin: 0 auto !important; /* Perfect auto-centering when preview fits, robust left-aligned scrolling when it overflows */
    }

    /* Custom CSS workspace polish */
    .custom-css-page .section-header {
      display: flex !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      gap: 1rem !important;
      margin-bottom: 1.5rem !important;
      text-align: left !important;
    }

    .custom-css-page .section-title {
      font-size: 1.65rem !important;
      margin-bottom: 0.35rem !important;
      color: var(--text) !important;
      -webkit-text-fill-color: var(--text) !important;
    }

    .custom-css-page .section-header p {
      color: var(--muted) !important;
      font-size: 0.95rem !important;
      max-width: 560px;
    }

    .custom-css-page > .appearance-panel {
      padding: 1rem !important;
      border-radius: 18px !important;
      border: 1px solid color-mix(in srgb, var(--border) 70%, rgba(var(--accent-rgb), 0.3)) !important;
      background:
        linear-gradient(135deg, rgba(var(--accent-rgb), 0.08), transparent 34%),
        linear-gradient(180deg, var(--surface), color-mix(in srgb, var(--surface2) 72%, var(--surface))) !important;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
      overflow: hidden;
    }

    .custom-css-page .appearance-panel-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.7rem !important;
      color: var(--text) !important;
      font-size: 1.08rem !important;
    }

    .custom-css-page .appearance-panel-title + div {
      color: var(--text-dim) !important;
      margin-bottom: 0 !important;
    }

    .custom-css-page .appearance-panel-title + div + div {
      display: none !important;
      align-items: flex-start !important;
      gap: 0.55rem !important;
      padding: 0.75rem 0.9rem !important;
      margin-bottom: 1rem !important;
      border-radius: 12px !important;
      color: #fecdd3 !important;
      background: rgba(244, 63, 94, 0.08) !important;
      border: 1px solid rgba(244, 63, 94, 0.22) !important;
    }

    .custom-css-page .editor-toolbar {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      background: color-mix(in srgb, var(--surface2) 82%, transparent) !important;
      border: 1px solid var(--border) !important;
      border-radius: 14px !important;
      padding: 0.55rem !important;
      margin-top: 0.85rem !important;
      margin-bottom: 0.85rem !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .custom-css-page .appearance-panel-title + div + div.editor-toolbar {
      display: flex !important;
    }

    .custom-css-page .editor-toolbar > div {
      gap: 0.5rem !important;
      flex-wrap: wrap !important;
    }

    .custom-css-page .editor-toolbar span {
      color: var(--text-dim) !important;
    }

    .custom-css-page .btn-tool {
      min-height: 32px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.4rem !important;
      padding: 0.4rem 0.7rem !important;
      border-radius: 10px !important;
      border: 1px solid var(--border) !important;
      background: rgba(255, 255, 255, 0.035) !important;
      color: var(--text-dim) !important;
      font-size: 0.8rem !important;
      font-weight: 700 !important;
      text-decoration: none !important;
      cursor: pointer !important;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease !important;
    }

    .custom-css-page .btn-tool i,
    .custom-css-page .section-header .btn i,
    .custom-css-page .appearance-save-bar .btn i {
      font-size: 0.82rem;
      opacity: 0.9;
    }

    .custom-css-page .btn-tool:hover {
      transform: translateY(-1px);
      color: var(--text) !important;
      border-color: var(--accent2) !important;
      background: rgba(var(--accent-rgb), 0.1) !important;
    }

    .custom-css-page .btn-tool[style*="rgba(108, 99, 255, 0.2)"],
    .custom-css-page .btn-tool[style*="rgba(6, 182, 212, 0.2)"] {
      color: var(--accent2) !important;
      border-color: var(--accent2) !important;
      background: rgba(var(--accent-rgb), 0.16) !important;
      box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.08);
    }

    .custom-css-page .css-editor-column,
    .custom-css-page .css-preview-column {
      display: flex !important;
      flex-direction: column !important;
      gap: 0.55rem !important;
      min-width: 0;
    }

    .custom-css-page .css-editor-column > div:first-child,
    .custom-css-page .css-preview-column > div:first-child span:first-child {
      color: var(--accent2) !important;
      font-size: 0.86rem !important;
      font-weight: 800 !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.45rem !important;
    }

    .custom-css-page .css-preview-column > div:first-child span:nth-child(2) {
      display: none !important;
    }

    .custom-css-page textarea {
      width: 100% !important;
      height: 100% !important;
      min-height: 220px !important;
      padding: 1rem !important;
      resize: vertical !important;
      color: #d6ccff !important;
      caret-color: var(--accent2);
      background:
        linear-gradient(180deg, rgba(var(--accent-rgb), 0.05), transparent 140px),
        #070912 !important;
      border: 1px solid color-mix(in srgb, var(--border) 70%, rgba(var(--accent-rgb), 0.35)) !important;
      border-radius: 14px !important;
      font-family: Consolas, "Courier New", monospace !important;
      font-size: 0.86rem !important;
      line-height: 1.65 !important;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.025), 0 14px 30px rgba(0, 0, 0, 0.22);
      outline: none;
    }

    .custom-css-page textarea:focus {
      border-color: var(--accent2) !important;
      box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.14), inset 0 0 0 1px rgba(255, 255, 255, 0.035);
    }

    .custom-css-page .css-autocomplete-dropdown {
      position: absolute !important;
      bottom: 12px !important;
      left: 12px !important;
      right: 12px !important;
      overflow: hidden !important;
      border-radius: 12px !important;
      border: 1px solid var(--border) !important;
      background: color-mix(in srgb, var(--surface2) 92%, #000) !important;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.44) !important;
      z-index: 100 !important;
    }

    .custom-css-page .css-autocomplete-dropdown ul {
      list-style: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .custom-css-page .css-autocomplete-dropdown > div:first-child {
      display: flex !important;
      justify-content: space-between !important;
      gap: 1rem !important;
      padding: 0.5rem 0.75rem !important;
      color: var(--text-dim) !important;
      font-size: 0.72rem !important;
      border-bottom: 1px solid var(--border) !important;
      background: rgba(255, 255, 255, 0.03) !important;
    }

    .custom-css-page .suggestion-item {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 1rem !important;
      padding: 0.65rem 0.75rem !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
      cursor: pointer !important;
    }

    .custom-css-page .suggestion-item > div {
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }

    .custom-css-page .suggestion-item span[style*="font-size: 0.65rem"] {
      border-radius: 6px !important;
    }

    .custom-css-page .preview-iframe-wrapper {
      position: relative !important;
      display: flex !important;
      align-items: stretch !important;
      justify-content: flex-start !important;
      padding: 0.9rem 0.65rem !important;
      border-radius: 16px !important;
      border: 1px solid color-mix(in srgb, var(--border) 70%, rgba(var(--accent2-rgb), 0.28)) !important;
      background:
        radial-gradient(circle at 18px 18px, rgba(255,255,255,0.08) 1px, transparent 1.5px),
        linear-gradient(135deg, #060812, color-mix(in srgb, var(--surface) 35%, #05070d)) !important;
      background-size: 22px 22px, auto !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 30px rgba(0, 0, 0, 0.24);
    }

    .custom-css-page .preview-iframe-wrapper iframe {
      height: 100% !important;
      display: block !important;
      background: var(--bg) !important;
      transition: width 0.28s ease, max-width 0.28s ease, box-shadow 0.28s ease, border-radius 0.28s ease !important;
    }

    .custom-css-page .appearance-save-bar {
      margin-top: 0.85rem !important;
      display: flex !important;
      align-items: center !important;
      gap: 1rem !important;
      flex-wrap: wrap !important;
    }

    .custom-css-page .appearance-save-bar .btn {
      border-radius: 12px !important;
      padding: 0.7rem 1rem !important;
    }

    .custom-css-page .appearance-save-bar .btn > span {
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.55rem !important;
    }

    .custom-css-page .appearance-saved-msg {
      color: var(--success) !important;
      font-weight: 700 !important;
    }

    @media (max-width: 768px) {
      .custom-css-page .section-header {
        flex-direction: column !important;
        align-items: stretch !important;
      }

      .custom-css-page .section-header > div:last-child,
      .custom-css-page .section-header button {
        width: 100% !important;
      }

      .custom-css-page .btn-tool {
        flex: 1 1 auto !important;
      }

      .custom-css-page .preview-iframe-wrapper {
        padding: 0.75rem !important;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  @ViewChild('previewIframe') previewIframe!: ElementRef<HTMLIFrameElement>;

  readonly safePortfolioUrl = signal<SafeResourceUrl | null>(null);
  readonly editorLayout = signal<'split' | 'stacked'>('split');
  readonly previewMode = signal<'desktop' | 'tablet' | 'mobile'>('desktop');

  setEditorLayout(layout: 'split' | 'stacked'): void {
    this.editorLayout.set(layout);
  }

  setPreviewMode(mode: 'desktop' | 'tablet' | 'mobile'): void {
    this.previewMode.set(mode);
  }

  readonly cssSuggestions = signal<{ name: string; description: string; type: string }[]>([]);
  readonly activeSuggestionIndex = signal<number>(0);

  readonly cssSuggestionsData = {
    classes: [
      { name: ".hero-title", description: "Hero section main title / name" },
      { name: ".hero-subtitle", description: "Hero section job headline text" },
      { name: ".navbar", description: "Global floating navigation bar container" },
      { name: ".nav-links a", description: "Links inside the navigation menu" },
      { name: ".btn-primary", description: "Cosmic violet accent glow button" },
      { name: ".btn-secondary", description: "Outline glass dark button" },
      { name: ".glass-card", description: "Reflective glassmorphism container card" },
      { name: ".project-card", description: "Individually wrapped showcase project card" },
      { name: ".timeline-content", description: "Career milestone experience content wrapper" },
      { name: ".timeline-date", description: "Pill capsule displaying experience date ranges" },
      { name: ".skill-pill", description: "Rounded glowing badge container for skill items" },
      { name: ".logo", description: "Brand name logo on the top-left of the navbar" },
      { name: ".badge", description: "Introductory small text capsule above hero name" },
      { name: ".contact-box", description: "Glass contact form widget container" }
    ],
    variables: [
      { name: "--bg", description: "Global canvas deep dark cosmic background" },
      { name: "--surface", description: "Glassmorphism card backdrop fill color" },
      { name: "--surface2", description: "Secondary slightly lighter card backdrop" },
      { name: "--surface3", description: "Highly transparent structural fill" },
      { name: "--border", description: "Subtle border styling for dividers and cards" },
      { name: "--border-hi", description: "Accent border styling on card hover focus" },
      { name: "--accent", description: "Primary theme cosmic glow color" },
      { name: "--accent2", description: "Secondary glowing complementary color" },
      { name: "--accent3", description: "Tertiary warm glow background highlight" },
      { name: "--accent-glow", description: "Cosmic shadow glow backdrop color" },
      { name: "--text-primary", description: "Bright crisp white main reading text" },
      { name: "--text-secondary", description: "Muted reading secondary description text" },
      { name: "--muted", description: "Faded caption text and icons" }
    ],
    properties: [
      { name: "color: ", description: "Sets the text foreground color" },
      { name: "background: ", description: "Sets background fills, gradients, or colors" },
      { name: "font-family: ", description: "Overrides font-family typography" },
      { name: "font-size: ", description: "Sets the size of the font" },
      { name: "font-weight: ", description: "Sets font thickness (e.g. 700 for Bold)" },
      { name: "border-radius: ", description: "Rounds the corners of an element" },
      { name: "border: ", description: "Applies a solid, dashed, or stylized outline" },
      { name: "box-shadow: ", description: "Applies outer neon glow or shadow effects" },
      { name: "display: flex; ", description: "Enables robust flexbox grid alignments" },
      { name: "opacity: ", description: "Sets transparency of the element (0.0 to 1.0)" },
      { name: "transform: scale(1.05); ", description: "Slightly enlarges the element size" },
      { name: "transition: all 0.3s ease; ", description: "Ensures silky smooth hover transitions" },
      { name: "filter: blur(20px); ", description: "Applies blur/glassmorphism sweep styling" }
    ]
  };

  onCssInput(cssValue: string, textarea: HTMLTextAreaElement): void {
    const currentVis = this.themeService.visibility();
    const newVis = { ...currentVis, custom_css: this.encodeCss(cssValue) };
    this.themeService.applyVisibility(newVis);
    this.injectCssIntoIframe(cssValue);
    this.calculateSuggestions(cssValue, textarea);
  }

  onKeyDown(event: KeyboardEvent, textarea: HTMLTextAreaElement): void {
    const list = this.cssSuggestions();
    if (list.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeSuggestionIndex.update(idx => (idx + 1) % list.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeSuggestionIndex.update(idx => (idx - 1 + list.length) % list.length);
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const selected = list[this.activeSuggestionIndex()];
      if (selected) {
        this.insertSuggestion(selected, textarea);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cssSuggestions.set([]);
    }
  }

  insertSuggestion(item: { name: string; type: string }, textarea: HTMLTextAreaElement): void {
    const value = textarea.value;
    const selectionEnd = textarea.selectionEnd;
    const textBeforeCursor = value.substring(0, selectionEnd);
    const textAfterCursor = value.substring(selectionEnd);

    const words = textBeforeCursor.split(/[\s{}:;=]/);
    const lastWord = words[words.length - 1];
    
    const prefix = textBeforeCursor.substring(0, textBeforeCursor.length - lastWord.length);
    const newValue = prefix + item.name + textAfterCursor;

    textarea.value = newValue;
    this.onCssInput(newValue, textarea);

    textarea.focus();
    const newCursorPos = prefix.length + item.name.length;
    setTimeout(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    this.cssSuggestions.set([]);
  }

  private calculateSuggestions(value: string, textarea: HTMLTextAreaElement): void {
    const selectionEnd = textarea.selectionEnd;
    const textBeforeCursor = value.substring(0, selectionEnd);
    
    // Check if cursor is inside curly braces { ... }
    let insideCurlyBraces = false;
    for (let i = 0; i < textBeforeCursor.length; i++) {
      if (textBeforeCursor[i] === '{') {
        insideCurlyBraces = true;
      } else if (textBeforeCursor[i] === '}') {
        insideCurlyBraces = false;
      }
    }

    const words = textBeforeCursor.split(/[\s{}:;=]/);
    const lastWord = words[words.length - 1];

    if (!lastWord || lastWord.length < 1) {
      this.cssSuggestions.set([]);
      return;
    }

    const term = lastWord.toLowerCase();
    
    let allItems: { name: string; description: string; type: string }[] = [];
    if (insideCurlyBraces) {
      // If we are typing inside braces, only show CSS properties and CSS variables
      allItems = [
        ...this.cssSuggestionsData.variables.map(v => ({ ...v, type: 'Variable' })),
        ...this.cssSuggestionsData.properties.map(p => ({ ...p, type: 'Property' }))
      ];
    } else {
      // If we are outside braces, only show CSS selectors (Classes)
      allItems = [
        ...this.cssSuggestionsData.classes.map(c => ({ ...c, type: 'Class' }))
      ];
    }

    const matches = allItems
      .filter(item => item.name.toLowerCase().includes(term) && item.name.toLowerCase() !== term)
      .sort((a, b) => {
        // Prioritize items that start with the exact typed term (e.g. 'c' matches 'color' first)
        const aStarts = a.name.toLowerCase().startsWith(term);
        const bStarts = b.name.toLowerCase().startsWith(term);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      })
      .slice(0, 5);

    this.cssSuggestions.set(matches);
    this.activeSuggestionIndex.set(0);
  }

  onIframeLoaded(): void {
    const rawCss = this.decodeCss(this.themeService.visibility().custom_css || '');
    this.injectCssIntoIframe(rawCss);
  }

  private injectCssIntoIframe(cssValue: string): void {
    try {
      const iframe = this.previewIframe?.nativeElement;
      if (!iframe) return;

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      let styleElement = iframeDoc.getElementById('live-css-preview') as HTMLStyleElement;
      if (!styleElement) {
        styleElement = iframeDoc.createElement('style');
        styleElement.id = 'live-css-preview';
        const target = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0] || iframeDoc.body;
        if (!target) return;
        target.appendChild(styleElement);
      }

      styleElement.textContent = cssValue;
    } catch (e) {
      console.warn('Could not inject live CSS preview:', e);
    }
  }

  // Active UI states
  readonly activeSection = signal<string>('profile');
  readonly sidebarCollapsed = signal<boolean>(false);
  readonly mobileSidebarOpen = signal<boolean>(false);
  readonly showProjectDetailsModal = signal<boolean>(false);
  readonly selectedProject = signal<any>(null);

  // Toast notifications
  readonly toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);
  private toastTimeout: any;

  // Inject services
  private projectOrderService = inject(ProjectOrderService);

  // Data States
  readonly profile = signal<any>(null);
  readonly projects = signal<any[]>([]);
  readonly skills = signal<any[]>([]);
  readonly experiences = signal<any[]>([]);
  readonly contacts = signal<any[]>([]);

  // Loading States
  readonly loadingProfile = signal<boolean>(true);
  readonly loadingProjects = signal<boolean>(true);
  readonly loadingSkills = signal<boolean>(true);
  readonly loadingExperiences = signal<boolean>(true);
  readonly loadingContacts = signal<boolean>(true);

  // Contacts Interactive Signals
  readonly showQrCode = signal<boolean>(false);
  readonly copiedMail = signal<boolean>(false);
  readonly copiedWeb = signal<boolean>(false);

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toast.set({ message, type });
    this.toastTimeout = setTimeout(() => {
      this.toast.set(null);
    }, 3000);
  }

  getInitials(name: string): string {
    if (!name) return '??';
    
    // Normalize and handle camelCase or spaced words
    let processedName = name.trim();
    
    // If it is a single camelCase word, split it (e.g. "MohammedZaghloul" -> "Mohammed Zaghloul")
    if (!processedName.includes(' ') && !processedName.includes('_') && !processedName.includes('-')) {
      processedName = processedName.replace(/([a-z])([A-Z])/g, '$1 $2');
    }
    
    const words = processedName.split(/[\s_\-\.]+/).filter(w => w.length > 0);
    
    if (words.length >= 2) {
      // First two letters of first word + first two letters of second word (e.g. "MoZa")
      const first = words[0].substring(0, 2);
      const second = words[1].substring(0, 2);
      const formatted = (first.charAt(0).toUpperCase() + first.charAt(1).toLowerCase()) +
                        (second.charAt(0).toUpperCase() + second.charAt(1).toLowerCase());
      return formatted;
    } else if (words.length === 1) {
      // If it's a single word, take first 4 letters (e.g. "Mohammed" -> "Moha")
      const word = words[0];
      if (word.length >= 4) {
        return word.substring(0, 2).toUpperCase() + word.substring(2, 4).toLowerCase();
      }
      return word.toUpperCase();
    }
    
    return '??';
  }

  formatUserName(name: string): string {
    if (!name) return '';
    const lower = name.toLowerCase().trim();
    if (lower === 'mohammedzaghloul') return 'Mohammed Zaghloul';
    if (lower === 'mohamedzaghloul') return 'Mohamed Zaghloul';
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  isProduction(): boolean {
    return !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
  }

  ngOnInit(): void {
    const uid = this.authService.userId();
    if (!uid) {
      this.router.navigate(['/login']);
      return;
    }
    this.safePortfolioUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(`/portfolio/${uid}`));
    this.initDashboardData(uid);
  }

  initDashboardData(uid: string): void {
    this.loadingProfile.set(true);
    this.portfolioService.getUserProfile(uid).subscribe({
      next: (res) => {
        this.profile.set(res);
        this.loadingProfile.set(false);

        // Unpack templates & apply
        const { theme, vis } = this.themeService.unpackTemplate(res.template);
        this.themeService.applyTheme(theme);
        this.themeService.applyVisibility(vis);

        // Inject custom CSS into live preview iframe on load
        const rawCss = this.decodeCss(vis.custom_css || '');
        this.injectCssIntoIframe(rawCss);

        // Load other items
        this.loadProjects();
        this.loadSkills();
        this.loadExperiences();
        this.loadContacts();
      },
      error: () => {
        this.loadingProfile.set(false);
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  togglePortfolioStatus(): void {
    if (!this.profile()) return;

    const newStatus = !this.profile().isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    const themeStr = this.themeService.currentTheme();
    const vis = this.themeService.visibility();
    const packed = this.themeService.packTemplate(themeStr, vis);

    const formData = new FormData();
    formData.append('UserName', this.profile().userName || '');
    formData.append('Title', this.profile().title || '');
    formData.append('About', this.profile().about || '');
    formData.append('IsActive', newStatus.toString());
    formData.append('Template', packed);

    console.log('Updating portfolio status to:', newStatus);

    this.portfolioService.updateUserProfile(formData).subscribe({
        next: (res) => {
          console.log('Update response:', res);
          this.initDashboardData(this.authService.userId() || '');
          this.showToast(`Portfolio is now ${newStatus ? 'ACTIVE' : 'INACTIVE'}`, 'success');
        },
        error: (err: any) => {
          console.error('Failed to update status:', err);
          this.showToast('Failed to update portfolio status: ' + (err.error?.message || err.message || 'Unknown error'), 'error');
        }
      });
  }

  dateValidator(startDateKey: string, endDateKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get(startDateKey)?.value;
      const endDate = control.get(endDateKey)?.value;
      const isOngoing = control.get('isOngoing')?.value;
      const isCurrentRole = control.get('isCurrentRole')?.value;

      if (isOngoing || isCurrentRole) {
        return null;
      }

      if (!startDate || !endDate) {
        return null;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        return { dateInvalid: true };
      }

      return null;
    };
  }

  // Form groups
  profileForm = this.fb.group({
    userName: ['', [Validators.required]],
    title: [''],
    email: ['', [Validators.email]],
    about: [''],
    template: ['1']
  });

  projectForm = this.fb.group({
    id: [0],
    name: ['', [Validators.required]],
    description: [''],
    link: [''],
    techStack: [''],
    githubLink: [''],
    startDate: ['', [Validators.required]],
    endDate: [''],
    isOngoing: [false]
  }, { validators: this.dateValidator('startDate', 'endDate') });

  skillForm = this.fb.group({
    id: [0],
    name: ['', [Validators.required]]
  });

  experienceForm = this.fb.group({
    id: [0],
    title: ['', [Validators.required]],
    company: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: [''],
    description: [''],
    isCurrentRole: [false]
  }, { validators: this.dateValidator('startDate', 'endDate') });

  contactForm = this.fb.group({
    id: [0],
    email: ['', [Validators.required, Validators.email]],
    github: [''],
    linkedin: [''],
    facebook: [''],
    instagram: [''],
    tiktok: ['']
  });

  // Modals Visibility
  readonly showProfileModal = signal<boolean>(false);
  readonly showProjectModal = signal<boolean>(false);
  readonly showSkillModal = signal<boolean>(false);
  readonly showExperienceModal = signal<boolean>(false);
  readonly showContactModal = signal<boolean>(false);
  readonly showDeleteModal = signal<boolean>(false);
  readonly showCssGuideModal = signal<boolean>(false);
  readonly showCertViewerModal = signal<boolean>(false);
  readonly activeCertViewerUrl = signal<string>('');
  readonly safeCertPdfUrl = signal<any | null>(null);

  // File Upload State
  selectedProfileImgFile: File | null = null;
  profileImgPreviewUrl: string | null = null;
  removeProfileImgRequested = false;
  selectedResumeFile: File | null = null;
  removeResumeRequested = false;

  selectedProjectImgFile: File | null = null;
  projectImgPreviewUrl: string | null = null;

  selectedCertImgFile: File | null = null;
  certImgPreviewUrl: string | null = null;
  currentCertUrl: string = '';

  // Delete Action State
  pendingDelete: { type: string; id: number } | null = null;

  // Form Submitting flags
  readonly isSubmitting = signal<boolean>(false);
  readonly appearanceSaved = signal<boolean>(false);

  // Loaders
  loadProjects(): void {
    const uid = this.authService.userId() || '';
    this.loadingProjects.set(true);
    this.portfolioService.getProjects(uid).subscribe({
      next: (res) => {
        const orderedProjects = this.projectOrderService.getOrderedProjects(res);
        this.projects.set(orderedProjects);
        this.loadingProjects.set(false);
      },
      error: () => this.loadingProjects.set(false)
    });
  }

  // Drag & Drop handler for projects
  onProjectDrop(event: any): void {
    if (event.previousIndex === event.currentIndex) return;
    
    moveItemInArray(this.projects(), event.previousIndex, event.currentIndex);
    this.projectOrderService.saveOrder(this.projects());
    this.showToast('Project order saved!', 'success');
  }

  loadSkills(): void {
    const uid = this.authService.userId() || '';
    this.loadingSkills.set(true);
    this.portfolioService.getSkills(uid).subscribe({
      next: (res) => {
        this.skills.set(res);
        this.loadingSkills.set(false);
      },
      error: () => this.loadingSkills.set(false)
    });
  }

  loadExperiences(): void {
    const uid = this.authService.userId() || '';
    this.loadingExperiences.set(true);
    this.portfolioService.getExperiences(uid).subscribe({
      next: (res) => {
        this.experiences.set(res);
        this.loadingExperiences.set(false);
      },
      error: () => this.loadingExperiences.set(false)
    });
  }

  loadContacts(): void {
    const uid = this.authService.userId() || '';
    this.loadingContacts.set(true);
    this.portfolioService.getContact(uid).subscribe({
      next: (res) => {
        this.contacts.set(res ? [res] : []);
        this.loadingContacts.set(false);
      },
      error: () => {
        this.contacts.set([]);
        this.loadingContacts.set(false);
      }
    });
  }

  // General Nav Helpers
  showSection(sectionName: string): void {
    this.activeSection.set(sectionName);
    this.mobileSidebarOpen.set(false);
  }

  toggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.mobileSidebarOpen.update(v => !v);
    } else {
      this.sidebarCollapsed.update(v => !v);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const p = this.profile();
    return p ? this.getInitials(p.userName || p.email || '') : '?';
  }

  getProfileImageUrl(): string {
    const p = this.profile();
    if (!p || !p.image) return '';
    return p.image.startsWith('/') ? `${this.portfolioService.apiHost}${p.image}` : p.image;
  }

  getProjectImageUrl(img: string): string {
    if (!img) return '';
    return img.startsWith('/') ? `${this.portfolioService.apiHost}${img}` : img;
  }

  get fullPortfolioUrl(): string {
    const uid = this.authService.userId();
    if (!uid) return '';
    return `${window.location.protocol}//${window.location.host}/portfolio/${uid}`;
  }

  copyProfileLink(): void {
    const uid = this.authService.userId();
    const url = `${window.location.protocol}//${window.location.host}/portfolio/${uid}`;
    navigator.clipboard.writeText(url).then(() => {
      this.showToast('Profile link copied to clipboard', 'success');
    }).catch((err: any) => {
      console.error('Copy failed:', err);
      this.showToast('Failed to copy profile link', 'error');
    });
  }

  // Contacts Interactive Helper Methods
  toggleQrCode(): void {
    this.showQrCode.set(!this.showQrCode());
  }

  copyMailTo(email: string): void {
    const mailto = `mailto:${email}`;
    navigator.clipboard.writeText(mailto).then(() => {
      this.copiedMail.set(true);
      this.showToast('Direct email link copied to clipboard', 'success');
      setTimeout(() => this.copiedMail.set(false), 2000);
    });
  }

  copyPortfolioDirectLink(): void {
    const uid = this.authService.userId();
    const url = `${window.location.protocol}//${window.location.host}/portfolio/${uid}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedWeb.set(true);
      this.showToast('Portfolio link copied to clipboard', 'success');
      setTimeout(() => this.copiedWeb.set(false), 2000);
    });
  }

  getConnectedCount(c: any): number {
    if (!c) return 0;
    let count = 0;
    if (c.email) count++;
    if (c.github) count++;
    if (c.linkedin) count++;
    if (c.facebook) count++;
    if (c.instagram) count++;
    if (c.tikTok) count++;
    return count;
  }

  get livePortfolioUrl(): string {
    const uid = this.authService.userId();
    return `${window.location.protocol}//${window.location.host}/portfolio/${uid}`;
  }

  get encodedPortfolioUrl(): string {
    return encodeURIComponent(this.livePortfolioUrl);
  }

  // Profile Edit
  openProfileModal(): void {
    const p = this.profile();
    if (p) {
      const { theme } = this.themeService.unpackTemplate(p.template);
      this.profileForm.patchValue({
        userName: p.userName || '',
        title: p.title || '',
        email: p.email || '',
        about: p.about || '',
        template: theme || '1'
      });
      this.profileImgPreviewUrl = this.getProfileImageUrl();
      this.selectedProfileImgFile = null;
      this.removeProfileImgRequested = false;
      this.selectedResumeFile = null;
      this.removeResumeRequested = false;
    }
    this.showProfileModal.set(true);
  }

  onProfileFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileImgFile = file;
      this.profileImgPreviewUrl = URL.createObjectURL(file);
      this.removeProfileImgRequested = false;
    }
  }

  removeProfileImage(): void {
    this.selectedProfileImgFile = null;
    this.profileImgPreviewUrl = null;
    this.removeProfileImgRequested = true;
  }

  onResumeFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      this.showToast('Resume must be PDF, DOC, or DOCX', 'error');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Resume file must be 5MB or less', 'error');
      event.target.value = '';
      return;
    }

    this.selectedResumeFile = file;
    this.removeResumeRequested = false;
  }

  removeResume(): void {
    this.selectedResumeFile = null;
    this.removeResumeRequested = true;
  }

  getResumeUrl(): string {
    const resumeUrl = this.profile()?.resumeUrl || '';
    if (!resumeUrl) return '';
    return resumeUrl.startsWith('/') ? `${this.portfolioService.apiHost}${resumeUrl}` : resumeUrl;
  }

  handleSaveProfile(): void {
    if (this.profileForm.invalid) return;
    this.isSubmitting.set(true);

    let userName = this.profileForm.get('userName')?.value || '';
    userName = userName.trim();
    // Remove all spaces from username to make it clean & valid for route parsing
    userName = userName.replace(/\s+/g, '');

    const form = new FormData();
    form.append('UserName', userName);
    form.append('Title', this.profileForm.get('title')?.value || '');
    form.append('Email', this.profileForm.get('email')?.value || '');
    form.append('About', this.profileForm.get('about')?.value || '');

    // Pack current visibility
    const themeStr = this.profileForm.get('template')?.value || '1';
    const vis = this.themeService.visibility();
    const packed = this.themeService.packTemplate(themeStr, vis);
    form.append('Template', packed);
    form.append('RemoveImage', String(this.removeProfileImgRequested && !this.selectedProfileImgFile));
    form.append('RemoveResume', String(this.removeResumeRequested && !this.selectedResumeFile));

    if (this.selectedProfileImgFile) {
      form.append('ImageFile', this.selectedProfileImgFile);
    }

    if (this.selectedResumeFile) {
      form.append('ResumeFile', this.selectedResumeFile);
    }

    this.portfolioService.updateUserProfile(form).subscribe({
      next: (res) => {
        this.profile.set(res);
        this.themeService.applyTheme(themeStr);
        this.removeProfileImgRequested = false;
        this.removeResumeRequested = false;
        this.selectedProfileImgFile = null;
        this.selectedResumeFile = null;
        this.profileImgPreviewUrl = res?.image ? (res.image.startsWith('/') ? `${this.portfolioService.apiHost}${res.image}` : res.image) : null;
        this.isSubmitting.set(false);
        this.showProfileModal.set(false);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showToast('حدث خطأ أثناء تعديل الحساب: ' + (err.error?.message || 'يرجى المحاولة مجدداً'), 'error');
      }
    });
  }

  // Projects Add / Edit
  openAddProject(): void {
    this.projectForm.reset({ id: 0, name: '', description: '', link: '', techStack: '', githubLink: '', startDate: '', endDate: '', isOngoing: false });
    this.selectedProjectImgFile = null;
    this.projectImgPreviewUrl = null;
    this.showProjectModal.set(true);
  }

  openEditProject(p: any): void {
    const isOngoing = !p.endDate;
    this.projectForm.patchValue({
      id: p.id,
      name: p.name || '',
      description: p.description || '',
      link: p.link || '',
      techStack: p.techStack || '',
      githubLink: p.githubLink || '',
      startDate: p.startDate ? p.startDate.substring(0, 10) : '',
      endDate: p.endDate ? p.endDate.substring(0, 10) : '',
      isOngoing: isOngoing
    });
    this.selectedProjectImgFile = null;
    this.projectImgPreviewUrl = p.image ? this.getProjectImageUrl(p.image) : null;
    this.showProjectModal.set(true);
  }

  openProjectDetails(p: any): void {
    this.selectedProject.set(p);
    this.showProjectDetailsModal.set(true);
  }

  onProjectFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedProjectImgFile = file;
      this.projectImgPreviewUrl = URL.createObjectURL(file);
    }
  }

  removeProjectImage(): void {
    this.selectedProjectImgFile = null;
    this.projectImgPreviewUrl = null;
  }

  handleSaveProject(): void {
    if (this.projectForm.invalid) return;
    this.isSubmitting.set(true);

    const uid = this.authService.userId() || '';
    const id = this.projectForm.get('id')?.value || 0;
    const isOngoing = this.projectForm.get('isOngoing')?.value;

    const rawLink = this.projectForm.get('link')?.value || '';
    const rawGithubLink = this.projectForm.get('githubLink')?.value || '';

    const formattedLink = this.formatGeneralUrl(rawLink);
    const formattedGithubLink = this.formatGeneralUrl(rawGithubLink);

    const form = new FormData();
    form.append('name', this.projectForm.get('name')?.value || '');
    form.append('description', this.projectForm.get('description')?.value || '');
    form.append('link', formattedLink);
    form.append('techStack', this.projectForm.get('techStack')?.value || '');
    form.append('githubLink', formattedGithubLink);
    form.append('startDate', this.projectForm.get('startDate')?.value || '');
    
    if (!isOngoing) {
      form.append('endDate', this.projectForm.get('endDate')?.value || '');
    }
    
    form.append('userId', uid);

    if (id > 0) {
      form.append('id', id.toString());
      if (this.selectedProjectImgFile) {
        form.append('imageFile', this.selectedProjectImgFile);
      }
      this.portfolioService.updateProject(id, form).subscribe({
        next: () => {
          this.loadProjects();
          this.isSubmitting.set(false);
          this.showProjectModal.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    } else {
      if (this.selectedProjectImgFile) {
        form.append('image', this.selectedProjectImgFile);
      }
      this.portfolioService.createProject(form).subscribe({
        next: () => {
          this.loadProjects();
          this.isSubmitting.set(false);
          this.showProjectModal.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  // Skills
  openAddSkill(): void {
    this.skillForm.reset({ id: 0, name: '' });
    this.showSkillModal.set(true);
  }

  openEditSkill(s: any): void {
    this.skillForm.patchValue({
      id: s.id,
      name: s.name || ''
    });
    this.showSkillModal.set(true);
  }

  handleSaveSkill(): void {
    if (this.skillForm.invalid) return;
    this.isSubmitting.set(true);

    const uid = this.authService.userId() || '';
    const id = this.skillForm.get('id')?.value || 0;
    const name = this.skillForm.get('name')?.value || '';

    const payload = { id, name, userId: uid };

    if (id > 0) {
      this.portfolioService.updateSkill(id, payload).subscribe({
        next: () => {
          this.loadSkills();
          this.isSubmitting.set(false);
          this.showSkillModal.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.portfolioService.createSkill(payload).subscribe({
        next: () => {
          this.loadSkills();
          this.isSubmitting.set(false);
          this.showSkillModal.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  // Experiences
  openAddExperience(): void {
    this.experienceForm.reset({ id: 0, title: '', company: '', startDate: '', endDate: '', description: '', isCurrentRole: false });
    this.experienceForm.get('endDate')?.enable();
    this.selectedCertImgFile = null;
    this.certImgPreviewUrl = null;
    this.currentCertUrl = '';
    this.showExperienceModal.set(true);
  }

  openEditExperience(e: any): void {
    let descText = e.description || '';
    let certUrl = '';
    const match = descText.match(/\[CERTIFICATE:(.+?)\]/);
    if (match) {
      certUrl = match[1];
      descText = descText.replace(match[0], '').trim();
    }

    const isCurrent = !e.endDate || e.endDate === 'Present';
    
    // Enable or disable before patching value to avoid status/validation discrepancy
    const endDateControl = this.experienceForm.get('endDate');
    if (isCurrent) {
      endDateControl?.disable();
    } else {
      endDateControl?.enable();
    }

    this.experienceForm.patchValue({
      id: e.id,
      title: e.title || '',
      company: e.company || '',
      startDate: e.startDate ? e.startDate.substring(0, 7) : '',
      endDate: isCurrent ? '' : (e.endDate ? e.endDate.substring(0, 7) : ''),
      description: descText,
      isCurrentRole: isCurrent
    });

    this.selectedCertImgFile = null;
    this.currentCertUrl = certUrl;
    this.certImgPreviewUrl = certUrl ? (certUrl.startsWith('/') ? `${this.portfolioService.apiHost}${certUrl}` : certUrl) : null;
    this.showExperienceModal.set(true);
  }

  onCertFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCertImgFile = file;
      this.certImgPreviewUrl = URL.createObjectURL(file);
    }
  }

  isCurrentRole(): boolean {
    return this.experienceForm.get('isCurrentRole')?.value || false;
  }

  toggleCurrentRole(event: any): void {
    const isChecked = event.target.checked;
    this.experienceForm.patchValue({ isCurrentRole: isChecked });
    const endDateControl = this.experienceForm.get('endDate');
    if (isChecked) {
      endDateControl?.setValue('');
      endDateControl?.disable();
    } else {
      endDateControl?.enable();
    }
  }

  removeCertificate(): void {
    this.selectedCertImgFile = null;
    this.currentCertUrl = '';
    this.certImgPreviewUrl = null;
  }

  handleSaveExperience(): void {
    if (this.experienceForm.invalid) return;
    this.isSubmitting.set(true);

    const uid = this.authService.userId() || '';
    const id = this.experienceForm.get('id')?.value || 0;
    let desc = this.experienceForm.get('description')?.value || '';

    // Handle Certificate File Upload First if Selected
    if (this.selectedCertImgFile) {
      const form = new FormData();
      form.append('file', this.selectedCertImgFile);
      this.portfolioService.uploadAttachment(form).subscribe({
        next: (uploadRes) => {
          if (uploadRes && uploadRes.url) {
            desc = desc + ` [CERTIFICATE:${uploadRes.url}]`;
          }
          this.submitExperience(id, uid, desc);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error('Certificate upload error:', err);
          const errorMsg = err?.error?.message || err?.message || 'Unknown error';
          this.showToast(`فشل رفع شهادة الخبرة. Error: ${errorMsg}`, 'error');
        }
      });
    } else {
      if (this.currentCertUrl) {
        desc = desc + ` [CERTIFICATE:${this.currentCertUrl}]`;
      }
      this.submitExperience(id, uid, desc);
    }
  }

  private submitExperience(id: number, uid: string, description: string): void {
    const isCurrentRole = this.experienceForm.get('isCurrentRole')?.value || false;
    let startDate = this.experienceForm.get('startDate')?.value || '';
    let endDate = isCurrentRole ? null : (this.experienceForm.get('endDate')?.value || '');

    // Convert YYYY-MM to YYYY-MM-DD for backend DateOnly parsing
    if (startDate && startDate.length === 7) {
      startDate = `${startDate}-01`;
    }
    if (endDate && endDate.length === 7) {
      endDate = `${endDate}-01`;
    }

    const payload = {
      id,
      title: this.experienceForm.get('title')?.value || '',
      company: this.experienceForm.get('company')?.value || '',
      startDate: startDate,
      endDate: endDate,
      description,
      userId: uid
    };

    if (id > 0) {
      this.portfolioService.updateExperience(id, payload).subscribe({
        next: () => {
          this.loadExperiences();
          this.isSubmitting.set(false);
          this.showExperienceModal.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.portfolioService.createExperience(payload).subscribe({
        next: () => {
          this.loadExperiences();
          this.isSubmitting.set(false);
          this.showExperienceModal.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  getExpCertState(desc: string): boolean {
    return !!(desc && desc.includes('[CERTIFICATE:'));
  }

  getCleanExpDesc(desc: string): string {
    if (!desc) return '';
    return desc.replace(/\[CERTIFICATE:(.+?)\]/, '').trim();
  }

  getExpCertUrl(desc: string): string {
    if (!desc) return '';
    const match = desc.match(/\[CERTIFICATE:(.+?)\]/);
    if (!match) return '';
    const url = match[1];
    return url.startsWith('/') ? `${this.portfolioService.apiHost}${url}` : url;
  }

  openCertViewerModal(url: string): void {
    this.activeCertViewerUrl.set(url);
    if (url.toLowerCase().endsWith('.pdf')) {
      const pdfUrl = url.includes('#') ? url : `${url}#view=FitH`;
      this.safeCertPdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl));
    } else {
      this.safeCertPdfUrl.set(null);
    }
    this.showCertViewerModal.set(true);
  }

  closeCertViewerModal(): void {
    this.showCertViewerModal.set(false);
    this.activeCertViewerUrl.set('');
    this.safeCertPdfUrl.set(null);
  }

  getDownloadUrl(url: string | null): string {
    if (!url) return '';
    if (url.includes('?view=true')) {
      return url.replace('?view=true', '?download=true');
    }
    if (url.includes('?download=true')) {
      return url;
    }
    return url + '?download=true';
  }

  // Contacts
  openAddContact(): void {
    this.contactForm.reset({ id: 0, email: '', github: '', linkedin: '', facebook: '', instagram: '', tiktok: '' });
    this.showContactModal.set(true);
  }

  openEditContact(c: any): void {
    this.contactForm.patchValue({
      id: c.id,
      email: c.email || '',
      github: c.github || '',
      linkedin: c.linkedin || '',
      facebook: c.facebook || '',
      instagram: c.instagram || '',
      tiktok: c.tikTok || ''
    });
    this.showContactModal.set(true);
  }

  handleSaveContact(): void {
    if (this.contactForm.invalid) return;
    this.isSubmitting.set(true);

    const uid = this.authService.userId() || '';
    const id = this.contactForm.get('id')?.value || 0;

    const githubRaw = this.contactForm.get('github')?.value || '';
    const linkedinRaw = this.contactForm.get('linkedin')?.value || '';
    const facebookRaw = this.contactForm.get('facebook')?.value || '';
    const instagramRaw = this.contactForm.get('instagram')?.value || '';
    const tiktokRaw = this.contactForm.get('tiktok')?.value || '';

    const payload = {
      id,
      email: this.contactForm.get('email')?.value || '',
      github: this.formatSocialLink(githubRaw, 'github') || null,
      linkedin: this.formatSocialLink(linkedinRaw, 'linkedin') || null,
      facebook: this.formatSocialLink(facebookRaw, 'facebook') || null,
      instagram: this.formatSocialLink(instagramRaw, 'instagram') || null,
      tikTok: this.formatSocialLink(tiktokRaw, 'tiktok') || null,
      userId: uid
    };

    if (id > 0) {
      this.portfolioService.updateContact(id, payload).subscribe({
        next: () => {
          this.loadContacts();
          this.isSubmitting.set(false);
          this.showContactModal.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.portfolioService.createContact(payload).subscribe({
        next: () => {
          this.loadContacts();
          this.isSubmitting.set(false);
          this.showContactModal.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  formatSocialLink(value: string, platform: string): string {
    if (!value) return '';
    let val = value.trim();
    if (!val) return '';

    // If it's already a full URL, return it as-is
    if (val.startsWith('http://') || val.startsWith('https://')) {
      return val;
    }

    // Extract handle if it's an email address
    let handle = val;
    if (val.includes('@')) {
      handle = val.split('@')[0];
    }

    // Remove leading slashes, @ symbols or whitespace
    handle = handle.replace(/^[/\s@]+/, '');

    // Now format based on platform
    switch (platform.toLowerCase()) {
      case 'github':
        return `https://github.com/${handle}`;
      case 'linkedin':
        return `https://linkedin.com/in/${handle}`;
      case 'facebook':
        return `https://facebook.com/${handle}`;
      case 'instagram':
        return `https://instagram.com/${handle}`;
      case 'tiktok':
        return `https://tiktok.com/@${handle}`;
      default:
        return val;
    }
  }

  getCleanHandle(value: string): string {
    if (!value) return '';
    let val = value.trim();
    if (val.startsWith('http://') || val.startsWith('https://')) {
      try {
        const url = new URL(val);
        let path = url.pathname.replace(/^\/|\/$/g, '');
        if (url.hostname.includes('linkedin.com')) {
          path = path.replace(/^in\//, '');
        }
        if (url.hostname.includes('tiktok.com')) {
          path = path.replace(/^@/, '');
        }
        return path || url.hostname;
      } catch {
        return val;
      }
    }
    if (val.includes('@')) {
      return val.split('@')[0];
    }
    return val;
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

  // Appearance Section
  saveVisibility(vis: any): void {
    const p = this.profile();
    if (!p) return;
    const themeStr = this.themeService.currentTheme();
    const packed = this.themeService.packTemplate(themeStr, vis);

    const form = new FormData();
    form.append('UserName', p.userName || '');
    form.append('Title', p.title || '');
    form.append('About', p.about || '');
    form.append('Template', packed);

    this.portfolioService.updateUserProfile(form).subscribe({
      next: (res) => {
        this.profile.set(res);
      },
      error: () => {}
    });
  }

  decodeCss(encoded: string): string {
    if (!encoded) return '';
    try {
      return decodeURIComponent(escape(atob(encoded)));
    } catch {
      return encoded;
    }
  }

  encodeCss(raw: string): string {
    if (!raw) return '';
    try {
      return btoa(unescape(encodeURIComponent(raw)));
    } catch {
      return raw;
    }
  }

  selectThemeCard(num: string): void {
    console.log('Selecting theme:', num);
    this.themeService.applyTheme(num);
    const vis = this.themeService.visibility();
    this.saveVisibility(vis);

    // Instantly apply theme attribute to preview iframe body without reloading
    try {
      const iframe = this.previewIframe?.nativeElement;
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc && iframeDoc.body) {
          const themeName = this.themeService.themeMap[num] || 'nebula';
          iframeDoc.body.setAttribute('data-theme', themeName);
        }
      }
    } catch (e) {
      console.warn('Could not inject theme into iframe:', e);
    }
  }

  toggleSectionVisibility(section: string): void {
    const currentVis = this.themeService.visibility();
    const newVis = { ...currentVis, [section]: !currentVis[section] };
    this.themeService.applyVisibility(newVis);
    this.saveVisibility(newVis);
  }

  updateCustomOption(key: string, value: any): void {
    const currentVis = this.themeService.visibility();
    const newVis = { ...currentVis, [key]: value };
    this.themeService.applyVisibility(newVis);
    this.saveVisibility(newVis);
  }

  applyPreset(presetName: string): void {
    const currentVis = this.themeService.visibility();
    let newVis = { ...currentVis };
    
    if (presetName === 'nebula') {
      newVis = {
        ...newVis,
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
        contact_icons_style: 'glow'
      };
      this.themeService.applyTheme('1');
    } else if (presetName === 'minimal') {
      newVis = {
        ...newVis,
        hero_layout: 'center',
        hero_size: 'regular',
        hero_show_badges: false,
        hero_show_glows: false,
        about_style: 'stack',
        about_tilt: false,
        experience_style: 'left',
        experience_show_certs: true,
        skills_style: 'minimal',
        skills_size: 'sm',
        projects_cols: 'col-2',
        projects_hover_zoom: false,
        contact_layout: 'compact',
        contact_icons_style: 'text'
      };
      this.themeService.applyTheme('3');
    } else if (presetName === 'cyberpunk') {
      newVis = {
        ...newVis,
        hero_layout: 'left',
        hero_size: 'large',
        hero_show_badges: true,
        hero_show_glows: true,
        about_style: 'grid',
        about_tilt: true,
        experience_style: 'alternating',
        experience_show_certs: true,
        skills_style: 'glowing',
        skills_size: 'lg',
        projects_cols: 'row',
        projects_hover_zoom: true,
        contact_layout: 'wide',
        contact_icons_style: 'glow'
      };
      this.themeService.applyTheme('5');
    }
    
    this.themeService.applyVisibility(newVis);
    this.saveVisibility(newVis);
    this.showToast('Applied preset styling successfully!', 'success');
  }

  moveSection(section: string, direction: number): void {
    const currentVis = this.themeService.visibility();
    const currentOrder = [...currentVis.sectionOrder];
    const currentIndex = currentOrder.indexOf(section);
    
    if (currentIndex === -1) return;
    
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;
    
    // Swap sections
    [currentOrder[currentIndex], currentOrder[newIndex]] = [currentOrder[newIndex], currentOrder[currentIndex]];
    
    const newVis = { ...currentVis, sectionOrder: currentOrder };
    this.themeService.applyVisibility(newVis);
    this.saveVisibility(newVis);
  }

  onSectionDrop(event: CdkDragDrop<string[]>): void {
    const currentVis = this.themeService.visibility();
    const currentOrder = [...currentVis.sectionOrder];
    
    moveItemInArray(currentOrder, event.previousIndex, event.currentIndex);
    
    const newVis = { ...currentVis, sectionOrder: currentOrder };
    this.themeService.applyVisibility(newVis);
    this.saveVisibility(newVis);
    this.showToast('Section order updated!', 'success');
  }

  reloadPreviewIframe(): void {
    try {
      const iframe = this.previewIframe?.nativeElement;
      if (iframe) {
        const currentSrc = iframe.src;
        iframe.src = '';
        setTimeout(() => {
          iframe.src = currentSrc;
        }, 50);
      }
    } catch (e) {
      console.warn('Failed to reload preview iframe:', e);
    }
  }

  saveAppearance(): void {
    const p = this.profile();
    if (!p) return;
    this.isSubmitting.set(true);

    const themeStr = this.themeService.currentTheme();
    const vis = this.themeService.visibility();
    const packed = this.themeService.packTemplate(themeStr, vis);

    const form = new FormData();
    form.append('UserName', p.userName || '');
    form.append('Title', p.title || '');
    form.append('About', p.about || '');
    form.append('Template', packed);

    this.portfolioService.updateUserProfile(form).subscribe({
      next: (res) => {
        this.profile.set(res);
        this.isSubmitting.set(false);
        this.appearanceSaved.set(true);
        this.reloadPreviewIframe(); // Reload live preview to fully sync layout & visibility settings
        setTimeout(() => this.appearanceSaved.set(false), 3000);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  toggleVisibility(section: string): void {
    const vis = { ...this.themeService.visibility() };
    vis[section] = !vis[section];
    this.themeService.applyVisibility(vis);
    this.saveVisibility(vis);
  }

  // Deletions
  confirmDelete(type: string, id: number): void {
    this.pendingDelete = { type, id };
    this.showDeleteModal.set(true);
  }

  executeDelete(): void {
    if (!this.pendingDelete) return;
    const { type, id } = this.pendingDelete;

    let obs;
    if (type === 'project') obs = this.portfolioService.deleteProject(id);
    else if (type === 'skill') obs = this.portfolioService.deleteSkill(id);
    else if (type === 'experience') obs = this.portfolioService.deleteExperience(id);
    else if (type === 'contact') obs = this.portfolioService.deleteContact(id);

    if (obs) {
      obs.subscribe({
        next: () => {
          this.showDeleteModal.set(false);
          this.pendingDelete = null;
          if (type === 'project') this.loadProjects();
          else if (type === 'skill') this.loadSkills();
          else if (type === 'experience') this.loadExperiences();
          else if (type === 'contact') this.loadContacts();
        },
        error: () => {
          this.showDeleteModal.set(false);
          this.pendingDelete = null;
          this.showToast('فشلت عملية الحذف.', 'error');
        }
      });
    }
  }

  formatDateString(dateString: string): string {
    if (!dateString || dateString.toLowerCase() === 'present') {
      return 'Present';
    }
    let cleanDateString = dateString;
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      cleanDateString = `${dateString}-01`;
    }
    const date = new Date(cleanDateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  getExperienceDateRange(exp: any): string {
    const start = this.formatDateString(exp.startDate);
    const end = exp.endDate ? this.formatDateString(exp.endDate) : 'Present';
    if (start === end) return start;
    return `${start} - ${end}`;
  }
}

