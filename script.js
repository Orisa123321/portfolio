/* ============================================================
   ORI SHARABI PORTFOLIO — INTERACTIVE JAVASCRIPT
   ============================================================ */

'use strict';

// ==================== NAVBAR SCROLL ====================
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleNavbarScroll() {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);

  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  }

  // Active nav link highlight
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ==================== HAMBURGER / MOBILE MENU ====================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobileMenu();
  }
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
      window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
      closeMobileMenu();
    }
  });
});

// ==================== SCROLL TO TOP BUTTON ====================
const scrollTopBtn = document.getElementById('scroll-top-btn');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

// ==================== SCROLL REVEAL ====================
function addRevealClasses() {
  const revealTargets = [
    { selector: '.skill-category',       delay: true  },
    { selector: '.project-card',         delay: true  },
    { selector: '.edu-main-card',        delay: false },
    { selector: '.section-header',       delay: false },
    { selector: '.contact-inner > *',    delay: true  },
  ];

  revealTargets.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (delay && i < 4) {
        el.classList.add(`reveal-delay-${i + 1}`);
      }
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        if (entry.target.classList.contains('hero-stats')) {
          entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) revealObserver.observe(heroStats);

window.addEventListener('DOMContentLoaded', () => {
  addRevealClasses();
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  document.querySelector('.hero-left')?.classList.add('revealed');
  document.querySelector('.hero-right')?.classList.add('revealed');
});

// ==================== SKILL BADGE HOVER GLOW ====================
document.querySelectorAll('.skill-badge').forEach(badge => {
  badge.addEventListener('mouseenter', function () {
    this.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.2)';
  });
  badge.addEventListener('mouseleave', function () {
    this.style.boxShadow = '';
  });
});

// ==================== CARD MOUSE TILT ====================
document.querySelectorAll('.project-card, .edu-main-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    this.style.transform = `translateY(-5px) perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
  });
});

// ==================== TYPING HEADLINE EFFECT ====================
(function typingEffect() {
  const el = document.querySelector('#hero-tagline');
  if (!el) return;

  const originalText = el.textContent.trim();
  el.textContent = '';
  el.style.borderRight  = '2px solid #10b981';
  el.style.display      = 'inline-block';
  el.style.whiteSpace   = 'nowrap';
  el.style.overflow     = 'hidden';

  let i = 0;
  function type() {
    if (i < originalText.length) {
      el.textContent += originalText[i++];
      setTimeout(type, 38 + Math.random() * 18);
    } else {
      setTimeout(() => { el.style.borderRight = 'none'; }, 1800);
    }
  }
  setTimeout(type, 700);
})();

// ==================== FLOATING PARTICLES ====================
(function particleSystem() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    pointer-events:none; z-index:0; opacity:0.35;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const MAX = 35;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x       = Math.random() * canvas.width;
      this.y       = Math.random() * canvas.height;
      this.size    = Math.random() * 1.4 + 0.4;
      this.speedX  = (Math.random() - 0.5) * 0.35;
      this.speedY  = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.35 + 0.08;
      this.color   = Math.random() > 0.55 ? '#10b981' : '#38bdf8';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < MAX; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
})();

// ==================== SCROLL INDICATOR HIDE ====================
const scrollIndicator = document.getElementById('scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    scrollIndicator.style.opacity    = window.scrollY > 100 ? '0' : '1';
    scrollIndicator.style.transition = 'opacity 0.4s ease';
  }, { passive: true });
}

// ==================== PROJECT CARD STAGGER ====================
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 70}ms`;
});

// ==================== FOOTER YEAR ====================
const copyrightEl = document.querySelector('.footer-copyright');
if (copyrightEl) {
  copyrightEl.innerHTML = copyrightEl.innerHTML.replace('2026', new Date().getFullYear());
}

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

// ==================== REDUCED MOTION SUPPORT ====================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.profile-ring, .floating-badge, .badge-dot')
    .forEach(el => el.style.animation = 'none');
  const canvas = document.getElementById('particle-canvas');
  if (canvas) canvas.remove();
}

// ==================== TECH PILL TOOLTIPS ====================
document.querySelectorAll('.tech-pill').forEach(pill => {
  pill.title = pill.textContent.trim();
});

// ==================== CONSOLE GREETING ====================
console.log(
  '%c👋 Hi! Welcome to Ori Sharabi\'s Portfolio',
  'color:#10b981; font-size:14px; font-weight:bold; padding:4px;'
);
console.log(
  '%c🔗 GitHub: https://github.com/Orisa123321 | LinkedIn: https://www.linkedin.com/in/OriSharabi/',
  'color:#94a3b8; font-size:12px;'
);
