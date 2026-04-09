/* main.js — Mustofa Yusuf Portfolio
   Clean, dependency-ordered structure
   ─────────────────────────────────── */

'use strict';

/* ────────────────────────────────────────────────
   All logic wrapped in DOMContentLoaded to ensure
   elements exist before we query them, and to avoid
   reference-before-declaration errors.
──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. ELEMENT REFERENCES ──────────────────── */
  const html        = document.documentElement;
  const themeBtn    = document.getElementById('theme-toggle');
  const iconLight   = document.getElementById('icon-light');
  const iconDark    = document.getElementById('icon-dark');
  const loadingEl   = document.getElementById('loading-screen');
  const mainPage    = document.getElementById('main-page');
  const headerEl    = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const navLinksEl  = document.getElementById('nav-links');
  const navLinkList = document.querySelectorAll('.nav-link');
  const sections    = document.querySelectorAll('section[id]');
  const typedEl     = document.getElementById('typed-text');
  const revealEls   = document.querySelectorAll('.reveal');
  const statNums    = document.querySelectorAll('.stat-num');
  const backTop     = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const canvas      = document.getElementById('particles-canvas');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* ── 2. THEME ───────────────────────────────── */

  let particleColor   = 'rgba(129,140,248,0.6)';
  let connectionColor = 'rgba(129,140,248,0.12)';

  function isDark() {
    const attr = html.getAttribute('data-theme');
    if (attr === 'dark')  return true;
    if (attr === 'light') return false;
    return prefersDark.matches;
  }

  function updateParticleColors() {
    if (isDark()) {
      particleColor   = 'rgba(129,140,248,0.6)';
      connectionColor = 'rgba(129,140,248,0.12)';
    } else {
      particleColor   = 'rgba(99,102,241,0.4)';
      connectionColor = 'rgba(99,102,241,0.08)';
    }
  }

  function applyThemeIcon() {
    if (isDark()) {
      if (iconLight) iconLight.style.display = 'inline';
      if (iconDark)  iconDark.style.display  = 'none';
    } else {
      if (iconLight) iconLight.style.display = 'none';
      if (iconDark)  iconDark.style.display  = 'inline';
    }
    updateParticleColors();
  }

  // Restore saved theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);
  applyThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      applyThemeIcon();
    });
  }

  prefersDark.addEventListener('change', () => {
    if (!localStorage.getItem('portfolio-theme')) applyThemeIcon();
  });

  /* ── 3. LOADING SCREEN ──────────────────────── */

  // Hide main page immediately
  if (mainPage) {
    mainPage.style.cssText = 'opacity:0; visibility:hidden; transition:opacity 0.7s ease;';
  }

  function dismissLoader() {
    if (mainPage) {
      mainPage.style.visibility = 'visible';
      void mainPage.offsetWidth; // Force reflow
      mainPage.style.opacity = '1';
    }
    if (loadingEl) {
      loadingEl.style.transition = 'opacity 0.6s ease';
      loadingEl.style.opacity    = '0';
      setTimeout(() => { loadingEl.style.display = 'none'; }, 650);
    }
  }

  // CSS progress bar animates for 2.8s, so dismiss after 3.2s
  setTimeout(dismissLoader, 3200);

  /* ── 4. NAVBAR SCROLL ───────────────────────── */

  window.addEventListener('scroll', () => {
    if (headerEl) {
      headerEl.classList.toggle('scrolled', window.scrollY > 50);
    }
  }, { passive: true });

  /* ── 5. HAMBURGER MENU ──────────────────────── */

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksEl.classList.toggle('open');
    });
  }

  /* ── 6. SMOOTH SCROLL + CLOSE MENU ─────────── */

  navLinkList.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      if (hamburger) hamburger.classList.remove('open');
      if (navLinksEl) navLinksEl.classList.remove('open');
    });
  });

  /* ── 7. ACTIVE NAV ON SCROLL ────────────────── */

  function updateActiveNav() {
    const sp = window.scrollY + 130;
    sections.forEach(sec => {
      const link = document.querySelector(`.nav-link[data-section="${sec.id}"]`);
      if (!link) return;
      if (sp >= sec.offsetTop && sp < sec.offsetTop + sec.offsetHeight) {
        navLinkList.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── 8. TYPING EFFECT ───────────────────────── */

  const words = [
    'Full Stack Developer',
    'Laravel Developer',
    'MERN Stack Developer',
    'Frontend Developer',
    'Web Automation Engineer',
  ];

  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const word = words[wordIdx];
    if (!deleting) {
      typedEl.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      typedEl.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 90);
  }

  setTimeout(typeLoop, 3800); // Start after loading screen gone

  /* ── 9. SCROLL REVEAL ───────────────────────── */

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const parent = entry.target.parentElement;
      const idx    = [...parent.querySelectorAll('.reveal:not(.visible)')].indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.max(idx, 0) * 100);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  /* ── 10. COUNTER ANIMATION ──────────────────── */

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.getAttribute('data-target');
      const step   = target / (1400 / 16);
      let current  = 0;
      const tick   = () => {
        current += step;
        if (current >= target) { el.textContent = target; return; }
        el.textContent = Math.floor(current);
        requestAnimationFrame(tick);
      };
      tick();
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObs.observe(el));

  /* ── 11. BACK TO TOP ────────────────────────── */

  window.addEventListener('scroll', () => {
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 12. CONTACT FORM → WHATSAPP ───────────── */

  if (contactForm) {
    const submitBtn = document.getElementById('form-submit');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name  = document.getElementById('user_name')?.value.trim()  ?? '';
      const email = document.getElementById('user_email')?.value.trim() ?? '';
      const msg   = document.getElementById('message')?.value.trim()    ?? '';
      if (!name || !email || !msg) return;

      if (submitBtn) {
        submitBtn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
        submitBtn.disabled   = true;
      }

      const mailto = `mailto:mustopayusup12@gmail.com?subject=Portfolio%20Contact&body=${encodeURIComponent(
        `Hello Mustofa,\n\n${msg}\n\nFrom: ${name} (${email})`
      )}`;

      setTimeout(() => {
        window.location.href = mailto;
        if (submitBtn) {
          submitBtn.innerHTML          = '<i class="fa-solid fa-check"></i> Sent!';
          submitBtn.style.background   = 'linear-gradient(135deg,#22c55e,#16a34a)';
        }
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML        = '<i class="fa-solid fa-paper-plane"></i> Send Message';
            submitBtn.style.background = '';
            submitBtn.disabled         = false;
          }
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  /* ── 13. CANVAS PARTICLES ───────────────────── */

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function buildParticles() {
      const num = Math.min(50, Math.floor(canvas.width / 20));
      particles  = Array.from({ length: num }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r:  Math.random() * 1.8 + 0.8,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth   = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    buildParticles();
    draw();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resize();
      buildParticles();
      draw();
    }, { passive: true });
  }

}); // end DOMContentLoaded
