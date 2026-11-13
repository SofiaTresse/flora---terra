(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const menu = document.getElementById('mobile-menu');
  const menuBtn = document.getElementById('menu-btn');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastFocused = null;

  /* Header com fundo ao rolar */
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Menu mobile */
  function openMenu() {
    if (!menu || !menuBtn) return;
    lastFocused = document.activeElement;
    menu.removeAttribute('inert');
    menu.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const closeBtn = menu.querySelector('.menu-close');
    if (closeBtn) window.setTimeout(() => closeBtn.focus(), 150);
  }

  function closeMenu() {
    if (!menu || !menuBtn) return;
    menu.classList.remove('is-open');
    menu.setAttribute('inert', '');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
  }

  if (menu) {
    menu.querySelectorAll('[data-close-menu]').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (!menu.classList.contains('is-open')) return;

      if (event.key === 'Escape') {
        closeMenu();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = menu.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 980 && menu && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* Revelação suave ao rolar */
  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px'
    });

    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  /* Newsletter */
  const newsletter = document.getElementById('newsletter');
  const newsletterNote = document.getElementById('newsletter-note');

  if (newsletter) {
    newsletter.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = newsletter.querySelector('input[type="email"]');

      if (!email || !email.value || !email.checkValidity()) {
        if (newsletterNote) newsletterNote.textContent = 'Digite um e-mail válido para receber a flor da semana.';
        if (email) email.focus();
        return;
      }

      if (newsletterNote) {
        newsletterNote.textContent = 'Obrigada! Em breve, flores e histórias no seu e-mail.';
      }
      newsletter.reset();
    });
  }

  /* Ano atual */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Parallax delicado do arranjo */
  const hero = document.querySelector('.hero');
  const heroArch = document.querySelector('.arch--hero');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hero && heroArch && canHover && !prefersReducedMotion) {
    let frame = null;

    hero.addEventListener('pointermove', function (event) {
      if (window.innerWidth < 960) return;
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(function () {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        heroArch.style.transform = 'translate3d(' + (x * 10).toFixed(2) + 'px,' + (y * 8).toFixed(2) + 'px,0)';
      });
    });

    hero.addEventListener('pointerleave', function () {
      heroArch.style.transform = '';
    });
  }
})();
