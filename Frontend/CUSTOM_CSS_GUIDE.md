# 🎨 MZ Portfolio — Custom CSS & Styling Guide
> **Ultimate Reference Document for Designers & Developers**

This document serves as a comprehensive developer reference for customizing and overriding the visual styles of both the **MZ Dashboard** and the **Public Portfolio SPA** using the interactive **Stylesheet Editor** or global overrides.

---

## 🚀 1. Core Architecture & Selectors

To style the public portfolio page, target the following major components and utility classes in your custom CSS.

### 🌐 Global Page Layout
- `body`: The core container. Implements dynamic themes via `data-theme` attributes (e.g. `body[data-theme="nebula"]`).
- `.container`: Global content wrapper (centered, standard `1200px` max-width with `5%` horizontal padding).
- `.glass-card`: Premium semi-transparent backdrop cards utilizing CSS `backdrop-filter` blur effects.

---

### 🗺️ 2. Component Class Registry

Use this registry to target specific sections of your public portfolio page.

| Section | Target Selector | Key Inner Classes | Description |
| :--- | :--- | :--- | :--- |
| **Navbar** | `.navbar` | `.nav-content`, `.logo`, `.nav-links`, `.btn-contact`, `.lang-dropdown` | Global floating navigation bar. Switches padding, background blur, and bottom borders via `.navbar.scrolled`. |
| **Hero** | `.hero` | `.hero-title`, `.hero-title span`, `.hero-title-role`, `.hero-subtitle`, `.hero-actions`, `.hero-image`, `.image-wrapper` | Introduction banner. Includes full-name text gradient `span` and role title `span` with smooth spring scale animations. |
| **About** | `section.about` | `.about-main-card`, `.about-glow`, `.about-text`, `.about-quote-icon` | About / Biography card layout featuring ambient colored background blur blobs. |
| **Experience** | `section.experience`| `.timeline`, `.timeline-item`, `.timeline-dot`, `.timeline-content`, `.timeline-date` | Vertical experience chronology path. Timeline dots automatically scale up on hover. |
| **Skills** | `section.skills` | `.skills-grid`, `.skill-pill`, `.skill-pill .dot` | Multi-column grid containing glassmorphic tech capsule capsules. |
| **Projects** | `section.projects` | `.projects-grid`, `.project-card`, `.project-img-wrap`, `.project-info`, `.tech-pill`, `.project-cta` | Portfolio projects catalog. Custom cards utilize linear glow wrappers and 3D magnetic hover depth. |
| **Contacts** | `section.contact` | `.contact-box`, `.contact-info`, `.social-links`, `.social-icon` | Contact cards and platform-specific glowing social networks launcher buttons. |
| **Footer** | `footer` | `footer p` | Clean minimal page footer displaying the developer copyright strip. |

---

## 🎨 3. Global CSS Custom Properties (Theme Variables)

MZ Portfolio is powered by a high-grade dynamic design system. Override these variables globally under the `:root` or inside theme-specific scopes to instantly redefine the look and feel.

```css
:root {
  /* Colors */
  --bg:           #080a10;  /* Main Page Background */
  --surface:      #0f121d;  /* Frosted Card Backdrops */
  --surface2:     #171b2c;  /* Elevated Interactive Elements */
  --surface3:     #1f243b;  /* Popups, Dropdowns & Modals */
  --border:       rgba(255, 255, 255, 0.08); /* Faint Grid Boarders */
  --border-hi:    rgba(255, 255, 255, 0.18); /* Faint Active Boarders */
  --text:         #ffffff;  /* Solid Primary Text */
  --text-dim:     #a7a9be;  /* Muted Paragraphs & Subtitles */
  --muted:        #6272a4;  /* Faint Metas & Labels */
  
  /* Cosmic Glowing Accents */
  --accent:       #6c63ff;  /* Primary Cosmic Accent (Violet) */
  --accent2:      #a855f7;  /* Secondary Cosmic Accent (Purple) */
  --accent3:      #ec4899;  /* Auxiliary Cosmic Accent (Pink) */
  --accent-rgb:   108, 99, 255;
  --accent-glow:  rgba(108, 99, 255, 0.25);
  
  /* Border Radius & Animation Timings */
  --radius:       16px;
  --radius-sm:    10px;
  --transition:   all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## ⚡ 4. Custom CSS Best Practices

Follow these layout guidelines to write bulletproof, high-performance styling overrides:

1. **Use `!important` Wisely**: 
   Since the core stylesheet and Tailwind utilities are loaded first, append `!important` to your custom CSS declarations to ensure they override baseline styles immediately.
   ```css
   .hero-title span { color: #00ffc4 !important; }
   ```
2. **Use Hardware-Accelerated Transforms**:
   When designing custom hover scale or float animations, always specify `will-change` and `backface-visibility` to lock layers and prevent font blurring or text gradient clipping:
   ```css
   .project-card:hover {
     transform: scale(1.03) !important;
     will-change: transform;
     backface-visibility: hidden;
   }
   ```
3. **Respect Document Directions (RTL/LTR)**:
   Use `[dir="rtl"]` and `:not([dir="rtl"])` selectors to ensure absolute elements or align-specific borders display correctly across both Arabic and English languages:
   ```css
   [dir="rtl"] .share-btn { left: auto; right: 20px !important; }
   ```

---

## 🌌 5. Interactive CSS Recipes & Overrides

Copy and paste these ready-to-use premium templates into the **Stylesheet Editor** to completely transform your portfolio instantly.

### 🌟 Recipe A: Pulsing Cosmic Neon Glow
*Adds dynamic pulsing borders, floating bounce hover offsets, and neon gradients to projects and skills.*
```css
/* Pulsing Cosmic Neon */
.project-card {
  border: 1px solid rgba(0, 255, 196, 0.25) !important;
  box-shadow: 0 10px 30px rgba(0, 255, 196, 0.05) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}
.project-card:hover {
  transform: translateY(-8px) scale(1.02) !important;
  border-color: #00ffc4 !important;
  box-shadow: 0 20px 40px rgba(0, 255, 196, 0.25), 0 0 30px rgba(168, 85, 247, 0.25) !important;
}
.project-info h3 {
  background: linear-gradient(135deg, #00ffc4, #a855f7) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}
```

### 👾 Recipe B: Digital Cyberpunk Grid
*Replaces background layers with an animated holographic developer grid and neon pink/yellow accents.*
```css
/* Cyberpunk Dev Grid */
body {
  background: #060814 !important;
  background-image: 
    linear-gradient(rgba(255, 0, 122, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 122, 0.05) 1px, transparent 1px) !important;
  background-size: 30px 30px !important;
}
.hero-title-role {
  color: #ff007a !important;
  text-shadow: 0 0 12px rgba(255, 0, 122, 0.6) !important;
}
.hero-title span {
  background: linear-gradient(135deg, #ff007a, #ffe600) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}
```

### ❄️ Recipe C: Ultra-Glassmorphic Matte Backdrop
*Enforces highly frosted glass, deep shadows, and subtle white boundary highlights across all container cards.*
```css
/* Matte Frosted Glass */
.glass-card {
  background: rgba(255, 255, 255, 0.02) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}
```
