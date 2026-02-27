/* =========================================
   MY MY — SCRIPT.JS — PREMIUM 2026
   ========================================= */

(function () {
  'use strict';

  /* ===== SCROLL PROGRESS BAR ===== */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ===== HEADER SCROLL EFFECT ===== */
  const header = document.getElementById('header');
  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }

  /* ===== QUICK ORDER STICKY PANEL (desktop) ===== */
  const quickOrder = document.getElementById('quickOrder');
  function updateQuickOrder() {
    if (quickOrder) quickOrder.classList.toggle('visible', window.scrollY > window.innerHeight * 0.3);
  }

  /* ===== REVEAL ON SCROLL ===== */
  // Use rootMargin so elements near viewport top trigger immediately
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const idx = siblings.indexOf(entry.target);
          const delay = Math.max(0, idx) * 80;
          setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 320));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
  );

  function initReveal() {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ===== ACTIVE NAV HIGHLIGHT ===== */
  const navLinks = document.querySelectorAll('.header-nav a');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

  /* ===== COMBINED SCROLL HANDLER ===== */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateHeader();
        updateQuickOrder();
        parallaxHero();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ===== PARALLAX HERO (subtle) ===== */
  const heroContent = document.querySelector('.hero-content');
  const heroDeco = document.querySelector('.hero-deco-layer');
  function parallaxHero() {
    if (!heroContent || window.scrollY > window.innerHeight) return;
    const y = window.scrollY;
    heroContent.style.transform = `translateY(${y * 0.08}px)`;
    if (heroDeco) heroDeco.style.transform = `translateY(${y * 0.04}px)`;
  }

  /* ===== DISH FILTERS ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      dishCards.forEach(card => {
        const tags = card.dataset.tags || '';
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('hidden', !show);
        if (show) {
          // re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 300ms, transform 300ms';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        }
      });
    });
  });

  /* ===== POPUP GOOGLE AVIS ===== */
  const popup = document.getElementById('reviewPopup');
  const popupClose = document.getElementById('popupClose');
  const popupLater = document.getElementById('popupLater');
  const STORAGE_KEY = 'mymy_review_popup_seen';
  const LATER_KEY = 'mymy_review_popup_later';

  function shouldShowPopup() {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return false;
      const later = localStorage.getItem(LATER_KEY);
      if (later) return (Date.now() - parseInt(later)) / 86400000 >= 7;
      return true;
    } catch (e) { return true; }
  }

  function showPopup() {
    if (!popup || !shouldShowPopup()) return;
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      popup.classList.add('show');
      if (popupClose) popupClose.focus();
    }));
  }

  function hidePopup(markSeen = true) {
    if (!popup) return;
    popup.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { popup.style.display = 'none'; }, 400);
    if (markSeen) { try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {} }
  }

  function hidePopupLater() {
    if (!popup) return;
    popup.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { popup.style.display = 'none'; }, 400);
    try { localStorage.setItem(LATER_KEY, Date.now().toString()); } catch (e) {}
  }

  if (popup) {
    const timer35s = setTimeout(showPopup, 35000);
    const scrollTrigger = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 60) { clearTimeout(timer35s); window.removeEventListener('scroll', scrollTrigger); showPopup(); }
    };
    window.addEventListener('scroll', scrollTrigger, { passive: true });
    if (popupClose) popupClose.addEventListener('click', () => hidePopup(true));
    if (popupLater) popupLater.addEventListener('click', () => hidePopupLater());
    popup.addEventListener('click', (e) => { if (e.target === popup) hidePopup(true); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('show')) hidePopup(true);
    });
    const popupLeave = document.getElementById('popupLeave');
    if (popupLeave) popupLeave.addEventListener('click', () => {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    });
    // Focus trap
    popup.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = popup.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ===== TOAST HELPER ===== */
  const toastEl = document.getElementById('toast');
  function showToast(msg, duration = 2500) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  /* ===== COPY ON LONG PRESS ===== */
  const callBtn = document.getElementById('callBtn');
  if (callBtn) {
    let pressTimer;
    callBtn.addEventListener('mousedown', () => {
      pressTimer = setTimeout(() => {
        navigator.clipboard && navigator.clipboard.writeText('03 86 59 49 99')
          .then(() => showToast('📋 Numéro copié !'));
      }, 700);
    });
    ['mouseup', 'mouseleave'].forEach(ev => callBtn.addEventListener(ev, () => clearTimeout(pressTimer)));
  }

  /* ===== INIT ===== */
  updateHeader();
  updateQuickOrder();
  initReveal();

})();
