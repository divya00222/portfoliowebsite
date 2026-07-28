/**
 * DJ Chaudhary Portfolio Engine — Main Application Script
 */

import { listenToCollection, sendContactMessage } from './app.js';
import { initThreeBackground } from './three-background.js';

// Default Fallback Data
const DEFAULT_PROJECTS = [
  {
    id: 'luxury-hotel',
    title: 'Grand Palace Luxury Hotel',
    tagline: 'High-end 5-Star Hotel Booking & Reservation Portal',
    category: 'Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    description: 'An elegant, high-conversion reservation portal for a luxury boutique resort. Features interactive 360 virtual room tours, real-time availability calendar, PHP-backed reservation management, and secure Stripe payment gateway.',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'Three.js'],
    githubUrl: 'https://github.com/djchaudhary/luxury-hotel-resort',
    demoType: 'hotel',
    highlights: [
      'Interactive room booking calendar with real-time PHP availability engine',
      '3D rotating luxury suite previews powered by Three.js',
      'Automated PDF invoice generation and email notifications',
      'Multilingual support & instant dynamic currency converter'
    ]
  },
  {
    id: 'mobile-store',
    title: 'NexTech Mobile Store',
    tagline: 'Smart Tech E-Shop & Smartphone Specs Comparison Engine',
    category: 'Mobile Store',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
    description: 'A sleek tech retail web app showcasing latest flagship smartphones, interactive side-by-side spec comparison, live search filtering, guest cart, and order tracking dashboard.',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'PHP', 'MySQL'],
    githubUrl: 'https://github.com/djchaudhary/nextech-mobile-store',
    demoType: 'mobile-store',
    highlights: [
      'Side-by-side smartphone spec comparator (RAM, Camera, Chipset, Battery)',
      'Instant AJAX live search with autocomplete and filter pills',
      'Shopping cart with local storage persistence and quick checkout modal',
      'Responsive dark glass UI with 60fps animations'
    ]
  },
  {
    id: 'real-estate',
    title: 'Apex Estates & Villas',
    tagline: 'Modern Property Portal with Interactive Map & Filter Search',
    category: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    description: 'A premier real estate directory platform allowing buyers to search luxury homes, filter by price/bedroom/amenities, view interactive floor plans, schedule agent calls, and submit inquiries.',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'GSAP'],
    githubUrl: 'https://github.com/djchaudhary/apex-realestate-portal',
    demoType: 'real-estate',
    highlights: [
      'Multi-parameter filter (Location, Price Range, Property Type, Beds/Baths)',
      'Mortgage calculator with interactive interest & monthly breakdown chart',
      'PHP lead management portal for estate agents',
      'High-speed image carousel & floor plan zoom inspector'
    ]
  },
  {
    id: 'ecommerce',
    title: 'Vogue & Urban E-Commerce',
    tagline: 'Full-Featured Fashion Online Store with Admin Dashboard',
    category: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    description: 'Comprehensive e-commerce platform equipped with customer product reviews, dynamic wishlists, coupon codes engine, order status tracking, and a powerful PHP/MySQL admin inventory dashboard.',
    technologies: ['PHP', 'MySQL', 'React', 'Tailwind CSS', 'REST API'],
    githubUrl: 'https://github.com/djchaudhary/vogue-ecommerce-php',
    demoType: 'ecommerce',
    highlights: [
      'Full PHP Admin Panel for product inventory, sales metrics, and stock alerts',
      'Dynamic promo code discount system with real-time total recalculation',
      'Interactive star ratings and verified buyer review submissions',
      'Optimized page speed score (98/100 performance rating)'
    ]
  },
  {
    id: 'video-downloader',
    title: 'StreamGrab Video Downloader',
    tagline: 'High-Speed Web Tool for Video Analysis & Media Format Extraction',
    category: 'Web App',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    description: 'A lightning-fast web application allowing users to parse video metadata, extract HD/4K stream formats, inspect audio bitrates, and convert video links with one-click instant download links.',
    technologies: ['JavaScript', 'React', 'PHP', 'Tailwind CSS', 'REST API'],
    githubUrl: 'https://github.com/djchaudhary/streamgrab-video-tool',
    demoType: 'video-downloader',
    highlights: [
      'Instant URL parsing with live preview thumbnail & resolution picker',
      'Clean glassmorphism progress indicator with speed monitor',
      'Client-side clipboard paste listener for zero-click convenience',
      'Zero external server dependency with lightweight API wrapper'
    ]
  },
  {
    id: 'restaurant',
    title: 'Savoria Gourmet Bistro',
    tagline: 'Interactive Food Menu & Online Table Reservation System',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    description: 'A mouth-watering website for a high-end gourmet restaurant. Includes categorized digital menu with dietary tags (Vegan, Gluten-Free), online table reservation, chef specialties gallery, and customer feedback form.',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'GSAP'],
    githubUrl: 'https://github.com/djchaudhary/savoria-restaurant-web',
    demoType: 'restaurant',
    highlights: [
      'Digital interactive menu with live dietary filtering and calorie badges',
      'PHP table booking system with party size and time slot reservation',
      'GSAP smooth entry animations for culinary dishes and testimonials',
      'Integrated Google Maps directions and direct WhatsApp ordering button'
    ]
  }
];

const DEFAULT_SKILLS = [
  { id: 'html5', name: 'HTML5', level: 98, category: 'frontend', icon: 'code-2', color: '#e34f26', experienceYears: '5+ Yrs', description: 'Semantic markup, accessibility (a11y), SEO architecture, and DOM optimization.' },
  { id: 'css3', name: 'CSS3', level: 95, category: 'frontend', icon: 'palette', color: '#1572b6', experienceYears: '5+ Yrs', description: 'Flexbox, Grid, keyframe animations, glassmorphism, responsive breakpoints.' },
  { id: 'js', name: 'JavaScript', level: 94, category: 'frontend', icon: 'file-json', color: '#f7df1e', experienceYears: '5+ Yrs', description: 'ES6+, async programming, DOM manipulation, custom Canvas/WebGL interactions.' },
  { id: 'tailwind', name: 'Tailwind CSS', level: 96, category: 'frontend', icon: 'wind', color: '#38bdf8', experienceYears: '4+ Yrs', description: 'Rapid UI development, custom design tokens, dark mode, component libraries.' },
  { id: 'react', name: 'React', level: 90, category: 'frontend', icon: 'atom', color: '#61dafb', experienceYears: '3+ Yrs', description: 'React Hooks, Context API, state management, SPA routing, component performance.' },
  { id: 'php', name: 'PHP', level: 92, category: 'backend', icon: 'server', color: '#777bb4', experienceYears: '5+ Yrs', description: 'Object-Oriented PHP, REST API development, MVC architecture, custom CMS.' },
  { id: 'mysql', name: 'MySQL', level: 88, category: 'database', icon: 'database', color: '#00758f', experienceYears: '4+ Yrs', description: 'Database schema design, query optimization, index tuning, foreign key relations.' },
  { id: 'git', name: 'Git & GitHub', level: 92, category: 'tools', icon: 'git-branch', color: '#f05032', experienceYears: '5+ Yrs', description: 'Version control workflows, branching strategies, GitHub Actions, page deployments.' }
];

const DEFAULT_TIMELINE = [
  { id: 'role-1', year: '2024 - PRESENT', role: 'Lead Full-Stack Web Developer', company: 'Nexus Digital Solutions', location: 'Chandigarh, IN', type: 'Full-time', description: 'Spearheading client web projects, leading front-end architecture, and building enterprise PHP backends for international clients.', highlights: ['Architected 15+ custom web applications with React, PHP, and Tailwind CSS', 'Improved average client page load speeds by 45% through bundle optimization', 'Mentored junior developers in Git workflows and clean code standards'], technologies: ['React', 'PHP', 'MySQL', 'Tailwind CSS', 'Three.js'] },
  { id: 'role-2', year: '2022 - 2024', role: 'Senior Front-End & PHP Developer', company: 'Aura Media Works', location: 'Remote', type: 'Full-time', description: 'Developed high-conversion e-commerce web portals, custom booking engines, and interactive web dashboards.', highlights: ['Engineered a custom PHP reservation system processing 10,000+ monthly bookings', 'Built a reusable UI library with Tailwind CSS reducing dev cycle times by 30%', 'Integrated multi-currency payment gateways (Stripe, PayPal, Razorpay)'], technologies: ['PHP', 'JavaScript', 'MySQL', 'Tailwind CSS', 'AJAX'] },
  { id: 'role-3', year: '2020 - 2022', role: 'Front-End UI Developer', company: 'Skyline Web Labs', location: 'Mohali, IN', type: 'Full-time', description: 'Created responsive marketing websites, interactive landing pages, and web app components with modern CSS animation.', highlights: ['Converted 25+ Figma UI designs into pixel-perfect, accessible HTML5/CSS3 templates', 'Integrated GSAP scroll animations for premium brand product launches', 'Maintained 99.5% uptime across all client hosted servers'], technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Bootstrap'] },
  { id: 'role-4', year: '2019 - 2020', role: 'Freelance Web Developer', company: 'Self-Employed', location: 'Global', type: 'Freelance', description: 'Delivered custom website solutions for small businesses, restaurants, hotels, and personal portfolios.', highlights: ['Built 20+ custom client websites with 100% 5-star feedback ratings', 'Established long-term maintenance contracts with key retail clients'], technologies: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'] }
];

const DEFAULT_TESTIMONIALS = [
  { id: 'test-1', name: 'Robert Sterling', role: 'General Manager', company: 'Grand Palace Resort & Spa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', content: 'DJ Chaudhary transformed our hotel booking website completely! The 3D room tour and seamless reservation flow increased our direct bookings by 38% in the first two months. Highly skilled and incredibly reliable.', rating: 5, projectRef: 'Grand Palace Luxury Hotel' },
  { id: 'test-2', name: 'Ananya Sharma', role: 'E-Commerce Director', company: 'NexTech Mobility', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', content: 'DJ built our mobile phone comparison store with incredible precision. The site is lightning fast on mobile devices, and the side-by-side spec comparator is a hit with our customers. Exceptional PHP & React developer!', rating: 5, projectRef: 'NexTech Mobile Store' },
  { id: 'test-3', name: 'Vikramaditya Verma', role: 'Founder & CEO', company: 'Apex Realty Group', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', content: 'Working with DJ was a game changer for our real estate firm. His attention to detail, glassmorphic design sensibilities, and clean database structure exceeded all expectations. Will definitely hire him again!', rating: 5, projectRef: 'Apex Estates Portal' },
  { id: 'test-4', name: 'Elena Rostova', role: 'Head Chef & Owner', company: 'Savoria Bistro', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', content: 'Our online menu and table reservation system is seamless! Customers love browsing our dishes, and managing party bookings on the PHP backend is so easy. DJ delivers top-tier work with great communication.', rating: 5, projectRef: 'Savoria Gourmet Bistro' }
];

// App State
let projectsData = [...DEFAULT_PROJECTS];
let skillsData = [...DEFAULT_SKILLS];
let timelineData = [...DEFAULT_TIMELINE];
let testimonialsData = [...DEFAULT_TESTIMONIALS];

let activeProjectCategory = 'All';
let activeSkillCategory = 'all';
let currentTestimonialIndex = 0;
let activeModalProject = null;

// Initialize Engine on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initTypingEffect();
  initMobileMenu();
  initThreeBackground('three-canvas-container');
  
  // Render initial components
  renderProjects();
  renderSkills();
  renderTimeline();
  renderTestimonials();

  // Setup Firestore Real-time Listeners
  setupFirestoreListeners();

  // Contact Form Submission
  initContactForm();

  // Resume Modal Trigger
  initResumeModal();

  // GSAP Animations
  initGSAP();

  // Create Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* --- Preloader --- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress');
  const progressText = document.getElementById('preloader-text');

  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (progressBar) progressBar.style.width = '100%';
      if (progressText) progressText.textContent = '100%';

      setTimeout(() => {
        preloader.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 700);
      }, 300);
    } else {
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (progressText) progressText.textContent = `${progress}%`;
    }
  }, 120);
}

/* --- Custom Cursor --- */
function initCustomCursor() {
  const outerRing = document.getElementById('cursor-ring');
  const innerDot = document.getElementById('cursor-dot');

  if (!outerRing || !innerDot) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    outerRing.style.display = 'none';
    innerDot.style.display = 'none';
    return;
  }

  document.body.classList.add('custom-cursor-active');

  let pos = { x: -100, y: -100 };
  let trailing = { x: -100, y: -100 };
  let isHovered = false;

  const lerp = (start, end, factor) => start + (end - start) * factor;

  window.addEventListener('mousemove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;

    innerDot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

    const target = e.target;
    if (
      target &&
      (target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive'))
    ) {
      isHovered = true;
      outerRing.className =
        'fixed top-0 left-0 pointer-events-none z-50 rounded-full border transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-amber-400 bg-amber-500/10 scale-125 shadow-[0_0_20px_rgba(245,158,11,0.4)]';
    } else {
      isHovered = false;
      outerRing.className =
        'fixed top-0 left-0 pointer-events-none z-50 rounded-full border transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2 w-9 h-9 border-amber-500/60 bg-transparent';
    }
  });

  function animateTrail() {
    trailing.x = lerp(trailing.x, pos.x, 0.18);
    trailing.y = lerp(trailing.y, pos.y, 0.18);
    outerRing.style.transform = `translate3d(${trailing.x}px, ${trailing.y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateTrail);
  }
  requestAnimationFrame(animateTrail);
}

/* --- Hero Typing Text Effect --- */
function initTypingEffect() {
  const typingEl = document.getElementById('hero-typing-text');
  if (!typingEl) return;

  const titles = [
    'Front-End Developer',
    'PHP Developer',
    'UI/UX Craftsman',
    '3D Web Enthusiast'
  ];

  let titleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeStep() {
    const currentTitle = titles[titleIdx];

    if (isDeleting) {
      typingEl.textContent = currentTitle.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingEl.textContent = currentTitle.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentTitle.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      titleIdx = (titleIdx + 1) % titles.length;
      delay = 500;
    }

    setTimeout(typeStep, delay);
  }

  typeStep();
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  const mobileNavLinks = mobileMenu.querySelectorAll('a');
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* --- Firestore Listeners --- */
function setupFirestoreListeners() {
  // Subscribe to Projects
  listenToCollection('projects', (docs) => {
    if (docs && docs.length > 0) {
      projectsData = [...docs].sort((a, b) => (a.order || 0) - (b.order || 0));
      renderProjects();
    }
  });

  // Subscribe to Skills
  listenToCollection('skills', (docs) => {
    if (docs && docs.length > 0) {
      skillsData = [...docs].sort((a, b) => (a.order || 0) - (b.order || 0));
      renderSkills();
    }
  });

  // Subscribe to Experience
  listenToCollection('experience', (docs) => {
    if (docs && docs.length > 0) {
      timelineData = [...docs].sort((a, b) => (a.order || 0) - (b.order || 0));
      renderTimeline();
    }
  });

  // Subscribe to Testimonials
  listenToCollection('testimonials', (docs) => {
    if (docs && docs.length > 0) {
      testimonialsData = docs;
      renderTestimonials();
    }
  });
}

/* --- Projects Render & Filtering --- */
function renderProjects() {
  const container = document.getElementById('projects-grid');
  const filterContainer = document.getElementById('project-filters');
  if (!container) return;

  const categories = ['All', 'Hotel', 'Mobile Store', 'Real Estate', 'E-Commerce', 'Web App', 'Restaurant'];

  if (filterContainer) {
    filterContainer.innerHTML = categories
      .map(
        (cat) => `
        <button
          data-cat="${cat}"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
            activeProjectCategory === cat
              ? 'text-amber-400 bg-amber-500/15 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
              : 'text-slate-400 bg-slate-900/60 border border-slate-800 hover:text-white hover:bg-slate-800/60'
          }"
        >
          ${cat}
        </button>
      `
      )
      .join('');

    filterContainer.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeProjectCategory = btn.getAttribute('data-cat');
        renderProjects();
      });
    });
  }

  const filtered = projectsData.filter(
    (p) => activeProjectCategory === 'All' || p.category === activeProjectCategory
  );

  container.innerHTML = filtered
    .map(
      (project) => `
      <div class="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between group relative">
        <div class="relative h-56 w-full overflow-hidden bg-slate-900">
          <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/40 to-transparent"></div>
          <span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold">
            ${project.category}
          </span>
          <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button data-project-id="${project.id}" class="open-project-modal px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg transition-transform hover:scale-105">
              <i data-lucide="eye" class="w-4 h-4"></i>
              <span>Live Demo</span>
            </button>
            <a href="${project.githubUrl || '#'}" target="_blank" rel="noreferrer" class="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-transform hover:scale-105" title="GitHub Repository">
              <i data-lucide="github" class="w-4 h-4"></i>
            </a>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">${project.title}</h3>
            <p class="text-xs font-mono text-amber-300/80 mb-3">${project.tagline || ''}</p>
            <p class="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6">${project.description}</p>
          </div>

          <div>
            <div class="flex flex-wrap gap-1.5 mb-6">
              ${(project.technologies || [])
                .map(
                  (tech) => `<span class="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 text-[10px] font-mono">${tech}</span>`
                )
                .join('')}
            </div>

            <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button data-project-id="${project.id}" class="open-project-modal text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center space-x-1.5 group/btn">
                <span>Interactive Live Demo</span>
                <i data-lucide="external-link" class="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform"></i>
              </button>

              <a href="${project.githubUrl || '#'}" target="_blank" rel="noreferrer" class="text-xs font-mono text-slate-400 hover:text-slate-200 inline-flex items-center space-x-1">
                <i data-lucide="github" class="w-3.5 h-3.5"></i>
                <span>Code</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  // Attach modal trigger click listeners
  container.querySelectorAll('.open-project-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-project-id');
      const found = projectsData.find((p) => p.id === pId);
      if (found) openProjectModal(found);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

/* --- Skills Render & Filtering --- */
function renderSkills() {
  const container = document.getElementById('skills-grid');
  const filterContainer = document.getElementById('skill-filters');
  if (!container) return;

  const tabs = [
    { id: 'all', label: 'All Technologies' },
    { id: 'frontend', label: 'Front-End' },
    { id: 'backend', label: 'Back-End & DB' },
    { id: 'tools', label: 'Tools & Version Control' },
  ];

  if (filterContainer) {
    filterContainer.innerHTML = tabs
      .map(
        (tab) => `
        <button
          data-tab="${tab.id}"
          class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
            activeSkillCategory === tab.id
              ? 'text-amber-400 bg-amber-500/15 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
              : 'text-slate-400 bg-slate-900/60 border border-slate-800 hover:text-white hover:bg-slate-800/60'
          }"
        >
          ${tab.label}
        </button>
      `
      )
      .join('');

    filterContainer.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeSkillCategory = btn.getAttribute('data-tab');
        renderSkills();
      });
    });
  }

  const filtered = skillsData.filter((skill) => {
    if (activeSkillCategory === 'all') return true;
    if (activeSkillCategory === 'backend' && (skill.category === 'backend' || skill.category === 'database')) return true;
    return skill.category === activeSkillCategory;
  });

  container.innerHTML = filtered
    .map(
      (skill) => `
      <div class="glass-card rounded-2xl p-6 border border-slate-800/80 hover:border-amber-500/40 relative group flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform text-amber-400">
              <i data-lucide="${skill.icon || 'code-2'}" class="w-6 h-6"></i>
            </div>
            <span class="text-xs font-mono text-slate-400 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
              ${skill.experienceYears || '3+ Yrs'}
            </span>
          </div>

          <h3 class="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">${skill.name}</h3>
          <p class="text-xs text-slate-400 leading-relaxed mb-6">${skill.description}</p>
        </div>

        <div>
          <div class="flex justify-between items-center text-xs font-mono mb-2">
            <span class="text-slate-400 uppercase">Proficiency</span>
            <span class="text-amber-400 font-bold">${skill.level}%</span>
          </div>
          <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div class="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(245,158,11,0.5)]" style="width: ${skill.level}%; background-color: ${skill.color || '#f59e0b'};"></div>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  if (window.lucide) window.lucide.createIcons();
}

/* --- Timeline / Experience Render --- */
function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = timelineData
    .map(
      (item) => `
      <div class="relative pl-8 sm:pl-10 group">
        <div class="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#0d1322] border-2 border-amber-500 flex items-center justify-center group-hover:scale-125 group-hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-300">
          <i data-lucide="briefcase" class="w-3.5 h-3.5 text-amber-400"></i>
        </div>

        <div class="hidden sm:block absolute -left-36 md:-left-44 top-2 text-right">
          <span class="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold inline-block">
            ${item.year}
          </span>
        </div>

        <div class="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 hover:border-amber-500/40 relative">
          <div class="sm:hidden mb-3">
            <span class="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold inline-block">
              ${item.year}
            </span>
          </div>

          <div class="flex flex-wrap justify-between items-start gap-2 mb-2">
            <h3 class="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">${item.role}</h3>
            <span class="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">${item.type}</span>
          </div>

          <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-4">
            <span class="text-amber-300 font-semibold">${item.company}</span>
            <span>•</span>
            <span class="flex items-center space-x-1">
              <i data-lucide="map-pin" class="w-3 h-3 text-slate-500"></i>
              <span>${item.location}</span>
            </span>
          </div>

          <p class="text-slate-300 text-sm leading-relaxed mb-6">${item.description}</p>

          <div class="space-y-2 mb-6">
            ${(item.highlights || [])
              .map(
                (h) => `
              <div class="flex items-start space-x-2 text-xs text-slate-300">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5"></i>
                <span>${h}</span>
              </div>
            `
              )
              .join('')}
          </div>

          <div class="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80">
            ${(item.technologies || [])
              .map(
                (tech) => `<span class="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono">${tech}</span>`
              )
              .join('')}
          </div>
        </div>
      </div>
    `
    )
    .join('');

  if (window.lucide) window.lucide.createIcons();
}

/* --- Testimonials Render & Carousel Controls --- */
function renderTestimonials() {
  const container = document.getElementById('testimonials-card');
  if (!container || !testimonialsData.length) return;

  const active = testimonialsData[currentTestimonialIndex] || testimonialsData[0];

  container.innerHTML = `
    <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
      <div class="shrink-0 relative">
        <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500/40 p-1 bg-slate-900 shadow-xl">
          <img src="${active.avatar}" alt="${active.name}" class="w-full h-full object-cover rounded-xl" loading="lazy" />
        </div>
        <div class="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 p-1.5 rounded-lg text-amber-400 shadow-md">
          <i data-lucide="quote" class="w-4 h-4"></i>
        </div>
      </div>

      <div class="flex-1 text-center md:text-left">
        <div class="flex justify-center md:justify-start space-x-1 mb-4 text-amber-400">
          ${'<i data-lucide="star" class="w-5 h-5 fill-amber-400"></i>'.repeat(active.rating || 5)}
        </div>

        <p class="text-base sm:text-xl text-slate-200 italic leading-relaxed mb-6 font-light">
          "${active.content}"
        </p>

        <div>
          <h4 class="text-lg font-bold text-white">${active.name}</h4>
          <p class="text-xs font-mono text-amber-400">
            ${active.role} — <span class="text-slate-400">${active.company}</span>
          </p>
          <span class="inline-block mt-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-[11px] font-mono text-slate-400">
            Project: ${active.projectRef}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
      <div class="flex space-x-2">
        ${testimonialsData
          .map(
            (_, idx) => `
          <button data-index="${idx}" class="testimonial-dot h-2 rounded-full transition-all duration-300 ${
            currentTestimonialIndex === idx ? 'w-8 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'w-2 bg-slate-800 hover:bg-slate-700'
          }"></button>
        `
          )
          .join('')}
      </div>

      <div class="flex items-center space-x-2">
        <button id="testimonial-prev" class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 transition-colors">
          <i data-lucide="chevron-left" class="w-5 h-5"></i>
        </button>
        <button id="testimonial-next" class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 transition-colors">
          <i data-lucide="chevron-right" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;

  // Attach carousel events
  document.getElementById('testimonial-prev')?.addEventListener('click', () => {
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialsData.length) % testimonialsData.length;
    renderTestimonials();
  });

  document.getElementById('testimonial-next')?.addEventListener('click', () => {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialsData.length;
    renderTestimonials();
  });

  container.querySelectorAll('.testimonial-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      currentTestimonialIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      renderTestimonials();
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

/* --- Contact Form Handling --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const phone = document.getElementById('contact-phone')?.value || '';
    const projectType = document.getElementById('contact-project-type')?.value || 'Web Application';
    const budget = document.getElementById('contact-budget')?.value || '';
    const message = document.getElementById('contact-message')?.value;

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = 'p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono mt-4';
        statusEl.textContent = 'Please fill in all required fields (Name, Email, and Message).';
        statusEl.classList.remove('hidden');
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (statusEl) {
      statusEl.className = 'p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mt-4';
      statusEl.textContent = 'Sending message to Firestore database...';
      statusEl.classList.remove('hidden');
    }

    try {
      await sendContactMessage({
        name,
        email,
        phone,
        projectType,
        budget,
        message,
      });

      if (statusEl) {
        statusEl.className = 'p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mt-4';
        statusEl.textContent = '✓ Thank you! Your message has been received. DJ Chaudhary will get back to you shortly.';
      }

      form.reset();
    } catch (err) {
      console.error('Contact form submission error:', err);
      if (statusEl) {
        statusEl.className = 'p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono mt-4';
        statusEl.textContent = 'An error occurred while sending your message. Please try again or email directly.';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* --- Project Modal Logic --- */
function openProjectModal(project) {
  activeModalProject = project;
  const modal = document.getElementById('project-modal');
  const modalContainer = document.getElementById('project-modal-container');
  if (!modal || !modalContainer) return;

  renderProjectModalContent('demo');

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderProjectModalContent(activeTab = 'demo') {
  const modalContainer = document.getElementById('project-modal-container');
  if (!modalContainer || !activeModalProject) return;

  const project = activeModalProject;

  let demoHTML = '';
  if (project.demoType === 'hotel') {
    demoHTML = `
      <div class="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6">
        <div class="flex flex-wrap justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h4 class="text-lg font-bold text-white">Grand Palace Resort Booking Engine</h4>
            <p class="text-xs text-slate-400">Simulated real-time PHP availability & price calculation</p>
          </div>
          <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs rounded-full font-mono">
            PHP / MySQL API Active
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-mono text-slate-400 block mb-1">Room Category</label>
            <select id="modal-hotel-room" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500">
              <option value="250">Deluxe Ocean View ($250/night)</option>
              <option value="450" selected>Presidential Suite ($450/night)</option>
              <option value="750">Royal Villa with Pool ($750/night)</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-mono text-slate-400 block mb-1">Duration (Nights)</label>
            <input id="modal-hotel-nights" type="number" min="1" max="30" value="3" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>

          <div>
            <label class="text-xs font-mono text-slate-400 block mb-1">Guests</label>
            <input id="modal-hotel-guests" type="number" min="1" max="6" value="2" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
        </div>

        <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap justify-between items-center">
          <div>
            <span class="text-xs text-slate-300">Total Booking Estimate:</span>
            <div id="modal-hotel-total" class="text-2xl font-bold font-mono text-amber-400">$1,350 USD</div>
          </div>
          <button id="modal-hotel-btn" class="px-6 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md">
            Instant PHP Reservation
          </button>
        </div>
      </div>
    `;
  } else if (project.demoType === 'mobile-store') {
    demoHTML = `
      <div class="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6">
        <div class="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h4 class="text-lg font-bold text-white">NexTech Smartphone Spec Comparator</h4>
            <p class="text-xs text-slate-400">Select flagship models to compare chipset & camera specs</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
            <span class="text-xs font-mono text-amber-400">DEVICE A</span>
            <h5 class="text-base font-bold text-white mt-1">Nexus Ultra 24 Pro</h5>
            <ul class="mt-3 text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• Display: 6.8" AMOLED 120Hz</li>
              <li>• Chipset: Snapdragon 8 Gen 3</li>
              <li>• Camera: 200MP Triple Lens</li>
              <li>• Battery: 5000mAh 65W Fast Charge</li>
              <li>• Price: $1,199 USD</li>
            </ul>
          </div>

          <div class="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
            <span class="text-xs font-mono text-blue-400">DEVICE B</span>
            <h5 class="text-base font-bold text-white mt-1">iTech Edge 15 Ultra</h5>
            <ul class="mt-3 text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• Display: 6.7" Super Retina XDR</li>
              <li>• Chipset: A17 Pro Bionic</li>
              <li>• Camera: 48MP Pro System</li>
              <li>• Battery: 4422mAh MagSafe</li>
              <li>• Price: $1,299 USD</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (project.demoType === 'real-estate') {
    demoHTML = `
      <div class="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6">
        <div class="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h4 class="text-lg font-bold text-white">Apex Luxury Property Filter</h4>
            <p class="text-xs text-slate-400">Interactive search parameter filter & mortgage calculator</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 items-center">
          <div>
            <label class="text-xs font-mono text-slate-400 block mb-1">Max Budget</label>
            <input id="modal-re-budget" type="range" min="200000" max="3000000" step="100000" value="1500000" class="w-48 accent-amber-500" />
            <span id="modal-re-budget-val" class="text-xs font-mono text-amber-400 ml-2">$1500k</span>
          </div>

          <div>
            <label class="text-xs font-mono text-slate-400 block mb-1">Property Type</label>
            <select class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
              <option value="All">All Types</option>
              <option value="Villa">Luxury Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Estate">Waterfront Estate</option>
            </select>
          </div>
        </div>

        <div class="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
          <div>
            <span class="text-xs text-slate-400">Matching Properties Found:</span>
            <div id="modal-re-count" class="text-lg font-bold text-white">12 Luxury Listings Under $1,500k</div>
          </div>
          <button onclick="alert('Showing map pins under selected budget!')" class="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-500 transition-colors">
            View Map Pins
          </button>
        </div>
      </div>
    `;
  } else if (project.demoType === 'ecommerce') {
    demoHTML = `
      <div class="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6">
        <div class="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h4 class="text-lg font-bold text-white">Vogue & Urban Shopping Cart & Coupon Engine</h4>
            <p class="text-xs text-slate-400">Test promo discount code: Enter "DJ20" for 20% OFF</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
            <span class="text-white font-medium">Leather Urban Jacket</span>
            <div class="flex items-center space-x-4">
              <span class="text-slate-400 font-mono">$180 USD</span>
              <span class="text-amber-400 font-mono font-bold">Qty: 1</span>
            </div>
          </div>
          <div class="flex justify-between items-center p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
            <span class="text-white font-medium">Minimalist Sneaker</span>
            <div class="flex items-center space-x-4">
              <span class="text-slate-400 font-mono">$120 USD</span>
              <span class="text-amber-400 font-mono font-bold">Qty: 1</span>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <input id="modal-ecom-coupon" type="text" placeholder="Enter promo code (e.g. DJ20)" class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500" />
          <button id="modal-ecom-btn" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold text-amber-300 rounded-lg transition-colors">
            Apply Coupon
          </button>
        </div>

        <div class="p-4 bg-slate-800/90 rounded-xl border border-slate-700 flex justify-between items-center">
          <div>
            <div class="text-xs text-slate-400">
              Subtotal: <span class="font-mono text-slate-200">$300 USD</span>
              <span id="modal-ecom-discount-text" class="text-emerald-400 font-mono ml-2 hidden">(-20% Discount Applied)</span>
            </div>
            <div id="modal-ecom-total" class="text-xl font-bold font-mono text-amber-400 mt-1">Final Total: $300.00 USD</div>
          </div>
          <button onclick="alert('Checkout Order Confirmed! Total processed.')" class="px-6 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors">
            Process Order
          </button>
        </div>
      </div>
    `;
  } else if (project.demoType === 'video-downloader') {
    demoHTML = `
      <div class="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6">
        <div class="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h4 class="text-lg font-bold text-white">StreamGrab Video Format Inspector</h4>
            <p class="text-xs text-slate-400">Paste any media URL to inspect resolution & audio bitrates</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <input id="modal-video-url" type="text" value="https://youtube.com/watch?v=dj-chaudhary-3d-web" class="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500" />
          <button id="modal-video-parse" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2 shrink-0">
            <i data-lucide="search" class="w-4 h-4"></i>
            <span>Analyze URL</span>
          </button>
        </div>

        <div id="modal-video-res" class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3 animate-fadeIn hidden">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-emerald-400">✓ Video Stream Parsed Successfully</span>
            <span class="font-mono text-slate-300">Duration: 04:25 | FPS: 60fps</span>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-500/20">
            <select class="px-3 py-1.5 bg-slate-800 text-xs text-white rounded-lg border border-slate-700 font-mono">
              <option>1080p Full HD (60fps)</option>
              <option>4K Ultra HD (3840x2160)</option>
              <option>MP3 Audio High Bitrate 320kbps</option>
            </select>
            <button onclick="alert('Starting Download!')" class="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Instant Download</span>
            </button>
          </div>
        </div>
      </div>
    `;
  } else {
    demoHTML = `
      <div class="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6">
        <h4 class="text-lg font-bold text-white">${project.title}</h4>
        <p class="text-xs text-slate-300">${project.description}</p>
      </div>
    `;
  }

  modalContainer.innerHTML = `
    <div class="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
      <div class="flex items-center space-x-3">
        <div class="flex space-x-1.5">
          <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
          <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
          <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
        </div>
        <span class="text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
          ${project.title} — Live Interactive Preview
        </span>
      </div>

      <div class="flex items-center space-x-3">
        <a href="${project.githubUrl || '#'}" target="_blank" rel="noreferrer" class="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors" title="GitHub Repo">
          <i data-lucide="github" class="w-4 h-4"></i>
        </a>
        <button id="modal-close-btn" class="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
    </div>

    <div class="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between shrink-0">
      <div class="flex space-x-2">
        <button id="modal-tab-demo" class="px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          activeTab === 'demo' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }">
          Interactive Live Demo
        </button>
        <button id="modal-tab-overview" class="px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          activeTab === 'overview' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }">
          Key Features & Highlights
        </button>
      </div>

      <span class="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
        Built with ${(project.technologies || []).join(', ')}
      </span>
    </div>

    <div class="p-6 overflow-y-auto flex-1 bg-[#0a0f1d]">
      ${
        activeTab === 'demo'
          ? demoHTML
          : `
        <div class="space-y-6 text-slate-300">
          <div>
            <h4 class="text-lg font-bold text-white mb-2">Project Overview</h4>
            <p class="text-sm leading-relaxed text-slate-400">${project.description}</p>
          </div>

          <div>
            <h4 class="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono mb-3">Key Technical Accomplishments</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${(project.highlights || [])
                .map(
                  (h) => `
                <div class="flex items-start space-x-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
                  <span>${h}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      `
      }
    </div>

    <div class="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center shrink-0">
      <a href="${project.githubUrl || '#'}" target="_blank" rel="noreferrer" class="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
        <i data-lucide="github" class="w-4 h-4"></i>
        <span>View Source on GitHub</span>
      </a>

      <button id="modal-bottom-close" class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors">
        Close Preview
      </button>
    </div>
  `;

  // Attach modal tab & action listeners
  document.getElementById('modal-close-btn')?.addEventListener('click', closeProjectModal);
  document.getElementById('modal-bottom-close')?.addEventListener('click', closeProjectModal);

  document.getElementById('modal-tab-demo')?.addEventListener('click', () => renderProjectModalContent('demo'));
  document.getElementById('modal-tab-overview')?.addEventListener('click', () => renderProjectModalContent('overview'));

  // Hotel demo calculation
  const roomSelect = document.getElementById('modal-hotel-room');
  const nightsInput = document.getElementById('modal-hotel-nights');
  const totalEl = document.getElementById('modal-hotel-total');

  const updateHotelTotal = () => {
    if (roomSelect && nightsInput && totalEl) {
      const price = parseInt(roomSelect.value, 10);
      const nights = parseInt(nightsInput.value, 10) || 1;
      totalEl.textContent = `$${(price * nights).toLocaleString()} USD`;
    }
  };

  roomSelect?.addEventListener('change', updateHotelTotal);
  nightsInput?.addEventListener('input', updateHotelTotal);
  document.getElementById('modal-hotel-btn')?.addEventListener('click', () => {
    alert('Room Reserved! Confirmation sent via PHP API.');
  });

  // Real Estate Budget Slider
  const reBudget = document.getElementById('modal-re-budget');
  const reVal = document.getElementById('modal-re-budget-val');
  const reCount = document.getElementById('modal-re-count');

  reBudget?.addEventListener('input', () => {
    const val = parseInt(reBudget.value, 10);
    if (reVal) reVal.textContent = `$${(val / 1000).toFixed(0)}k`;
    if (reCount) reCount.textContent = `12 Luxury Listings Under $${(val / 1000).toFixed(0)}k`;
  });

  // E-Commerce Coupon
  const couponInput = document.getElementById('modal-ecom-coupon');
  const couponBtn = document.getElementById('modal-ecom-btn');
  const ecomTotal = document.getElementById('modal-ecom-total');
  const ecomDiscountText = document.getElementById('modal-ecom-discount-text');

  couponBtn?.addEventListener('click', () => {
    const code = couponInput?.value.trim().toUpperCase();
    if (code === 'DJ20' || code === 'SAVE20') {
      if (ecomTotal) ecomTotal.textContent = 'Final Total: $240.00 USD';
      if (ecomDiscountText) ecomDiscountText.classList.remove('hidden');
    } else {
      alert('Invalid code! Try "DJ20" for 20% OFF.');
    }
  });

  // Video Downloader Parse
  const videoParseBtn = document.getElementById('modal-video-parse');
  const videoRes = document.getElementById('modal-video-res');

  videoParseBtn?.addEventListener('click', () => {
    videoParseBtn.disabled = true;
    videoParseBtn.innerHTML = `<span>Parsing Stream...</span>`;
    setTimeout(() => {
      videoParseBtn.disabled = false;
      videoParseBtn.innerHTML = `<i data-lucide="search" class="w-4 h-4"></i><span>Analyze URL</span>`;
      if (videoRes) videoRes.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    }, 1000);
  });

  if (window.lucide) window.lucide.createIcons();
}

/* --- Resume Modal --- */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const triggerBtns = document.querySelectorAll('.open-resume-modal');
  const closeBtn = document.getElementById('resume-close-btn');
  const printBtns = document.querySelectorAll('.print-resume-btn');

  if (!modal) return;

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  });

  printBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });
}

/* --- GSAP Scroll Animations --- */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('section').forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}
