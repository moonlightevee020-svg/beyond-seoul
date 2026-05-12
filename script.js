/* ===== Beyond Seoul — Interactive Script ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  });
  // Fallback in case load already fired
  if (document.readyState === 'complete') {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  }

  /* ---------- Cursor Glow ---------- */
  const glow = document.getElementById('cursorGlow');
  let glowX = 0, glowY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', e => { glowX = e.clientX; glowY = e.clientY; });
  (function animateGlow() {
    currentX += (glowX - currentX) * 0.08;
    currentY += (glowY - currentY) * 0.08;
    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';
    requestAnimationFrame(animateGlow);
  })();

  /* ---------- Header scroll ---------- */
  const header = document.getElementById('siteHeader');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    lastScroll = window.scrollY;
  }, { passive: true });

  /* ---------- Mobile Hamburger ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  /* ---------- Slide System ---------- */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  const tabs = document.querySelectorAll('.dest-tab');
  const counter = document.querySelector('.slide-counter .current');
  const footerSlideLinks = document.querySelectorAll('[data-slide-link]');
  let currentSlide = 0;
  let slideInterval;
  let isTransitioning = false;

  function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;

    const prev = slides[currentSlide];
    const next = slides[index];

    prev.classList.remove('active');
    prev.classList.add('leaving');
    next.classList.add('active');

    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');

    // Update tabs
    tabs.forEach(t => t.classList.remove('active'));
    tabs[index].classList.add('active');

    // Update counter
    counter.textContent = String(index + 1).padStart(2, '0');

    setTimeout(() => {
      prev.classList.remove('leaving');
      isTransitioning = false;
    }, 800);

    currentSlide = index;
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startAutoplay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    startAutoplay();
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
      resetAutoplay();
    });
  });

  // Tab clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      goToSlide(parseInt(tab.dataset.slide));
      resetAutoplay();
    });
  });

  // Footer destination links
  footerSlideLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(link.dataset.slideLink);
      goToSlide(idx);
      resetAutoplay();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { goToSlide((currentSlide + 1) % slides.length); resetAutoplay(); }
    if (e.key === 'ArrowLeft') { goToSlide((currentSlide - 1 + slides.length) % slides.length); resetAutoplay(); }
  });

  // Touch / swipe support
  let touchStartX = 0;
  const viewport = document.querySelector('.slides-viewport');
  viewport.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 60) {
      if (diff < 0) goToSlide((currentSlide + 1) % slides.length);
      else goToSlide((currentSlide - 1 + slides.length) % slides.length);
      resetAutoplay();
    }
  }, { passive: true });

  startAutoplay();

  /* ---------- Scroll Reveal ---------- */
  const reveals = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  /* ---------- Active nav on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- Destination Card Interaction ---------- */
  const destCards = document.querySelectorAll('.dest-card');
  destCards.forEach(card => {
    card.addEventListener('click', () => {
      const dest = card.dataset.dest;
      let slideIdx = 0;
      if (dest === 'jeonju') slideIdx = 1;
      if (dest === 'sokcho') slideIdx = 2;
      goToSlide(slideIdx);
      resetAutoplay();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ---------- Smooth scroll for all anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Parallax on slide visuals ---------- */
  const slideVisuals = document.querySelectorAll('.slide-visual');
  document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    slideVisuals.forEach(v => {
      v.style.transform = `translate(${mx * 8}px, ${my * 6}px)`;
    });
  });

});
