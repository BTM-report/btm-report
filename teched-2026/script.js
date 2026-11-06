// script.js — SAP TechEd 2026 Learning Hub

(function () {
  'use strict';

  /* ── Theme ── */
  const stored = localStorage.getItem('theme');
  if (stored) document.documentElement.setAttribute('data-theme', stored);

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
  }

  /* ── Nav: scroll effects & active section ── */
  const nav = document.getElementById('main-nav');
  const progressBar = document.getElementById('nav-progress');
  const sections = Array.from(document.querySelectorAll('section[id], div[id].section'));

  function onScroll() {
    if (!nav) return;
    // Scrolled class
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Progress bar
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // Progress tracker
    updateProgressTracker();
  }

  /* ── Progress tracker ── */
  const seenSections = new Set();
  const sectionIds = ['teched','big-picture','top5','baip','joule','bdc','btm','ecosystem','toolkit','study'];

  function updateProgressTracker() {
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75) seenSections.add(id);
    });
    const pct = Math.round((seenSections.size / sectionIds.length) * 100);
    const lbl = document.getElementById('progress-label');
    if (lbl) lbl.textContent = pct + '% explored';
  }

  /* ── Smooth scroll ── */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '64');
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── Fade-in on scroll ── */
  function setupFadeIn() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }

  /* ── Flip cards ── */
  function setupFlipCards() {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
      card.addEventListener('keypress', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });
  }

  /* ── Tab switchers (generic) ── */
  function setupTabs(containerSelector, btnSelector, panelSelector) {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach(container => {
      const btns = container.querySelectorAll(btnSelector);
      const panels = container.querySelectorAll(panelSelector);
      btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          if (panels[i]) panels[i].classList.add('active');
        });
      });
    });
  }

  /* ── BTM accordion ── */
  function setupAccordion() {
    document.querySelectorAll('.btm-acc-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const isOpen = btn.classList.contains('open');
        // Close all
        document.querySelectorAll('.btm-acc-trigger').forEach(b => b.classList.remove('open'));
        document.querySelectorAll('.btm-acc-body').forEach(b => b.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) {
          btn.classList.add('open');
          btn.nextElementSibling.classList.add('open');
        }
      });
    });
    // Open first by default
    const first = document.querySelector('.btm-acc-trigger');
    if (first) {
      first.classList.add('open');
      first.nextElementSibling.classList.add('open');
    }
  }

  /* ── Study guide checkboxes ── */
  function setupStudyGuide() {
    const panels = ['beginner', 'intermediate', 'advanced'];

    function loadChecked() {
      panels.forEach(level => {
        const saved = JSON.parse(localStorage.getItem('study-' + level) || '[]');
        document.querySelectorAll(`#study-${level} .study-item`).forEach((item, i) => {
          if (saved.includes(i)) item.classList.add('checked');
        });
      });
      updateStudyBars();
    }

    function saveChecked(level) {
      const checked = [];
      document.querySelectorAll(`#study-${level} .study-item`).forEach((item, i) => {
        if (item.classList.contains('checked')) checked.push(i);
      });
      localStorage.setItem('study-' + level, JSON.stringify(checked));
    }

    function updateStudyBars() {
      panels.forEach(level => {
        const items = document.querySelectorAll(`#study-${level} .study-item`);
        const checked = document.querySelectorAll(`#study-${level} .study-item.checked`);
        const pct = items.length ? Math.round((checked.length / items.length) * 100) : 0;
        const fill = document.querySelector(`#study-${level} .study-progress-fill`);
        const lbl = document.querySelector(`#study-${level} .study-progress-label`);
        if (fill) fill.style.width = pct + '%';
        if (lbl) lbl.textContent = `${checked.length}/${items.length} completed`;
      });
    }

    panels.forEach(level => {
      document.querySelectorAll(`#study-${level} .study-item`).forEach((item, i) => {
        const cb = item.querySelector('.study-checkbox');
        if (!cb) return;
        cb.addEventListener('click', () => {
          item.classList.toggle('checked');
          saveChecked(level);
          updateStudyBars();
        });
      });
    });

    loadChecked();
  }

  /* ── Copy to clipboard ── */
  function setupCopyBtns() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        const el = target ? document.getElementById(target) : btn.previousElementSibling;
        const text = el ? (el.textContent || el.innerText) : '';
        if (!text) return;
        navigator.clipboard.writeText(text.trim()).then(() => {
          const orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied!';
          btn.classList.add('copied');
          setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
        }).catch(() => {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = text.trim(); ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          const orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied!'; btn.classList.add('copied');
          setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
        });
      });
    });
  }

  /* ── Search ── */
  function setupSearch() {
    const input = document.getElementById('nav-search');
    if (!input) return;

    function clearHighlights() {
      document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      });
    }

    function highlightText(node, term) {
      if (node.nodeType === 3) {
        const idx = node.textContent.toLowerCase().indexOf(term.toLowerCase());
        if (idx === -1) return false;
        const before = document.createTextNode(node.textContent.slice(0, idx));
        const match = document.createElement('mark');
        match.className = 'search-highlight';
        match.textContent = node.textContent.slice(idx, idx + term.length);
        const after = document.createTextNode(node.textContent.slice(idx + term.length));
        const frag = document.createDocumentFragment();
        frag.appendChild(before); frag.appendChild(match); frag.appendChild(after);
        node.parentNode.replaceChild(frag, node);
        return true;
      }
      if (node.nodeType === 1 && !['SCRIPT','STYLE','MARK'].includes(node.tagName)) {
        Array.from(node.childNodes).forEach(child => highlightText(child, term));
      }
      return false;
    }

    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const term = input.value.trim();
        clearHighlights();
        if (term.length < 2) {
          // Show all cards
          document.querySelectorAll('.announcement-card, .eco-card, .pillar-card').forEach(el => el.classList.remove('search-hidden'));
          return;
        }
        highlightText(document.getElementById('main-content') || document.body, term);

        // Filter announcement cards
        document.querySelectorAll('.announcement-card').forEach(card => {
          const txt = card.textContent.toLowerCase();
          card.classList.toggle('search-hidden', !txt.includes(term.toLowerCase()));
        });
        // Filter eco cards
        document.querySelectorAll('.eco-card').forEach(card => {
          const txt = card.textContent.toLowerCase();
          card.classList.toggle('search-hidden', !txt.includes(term.toLowerCase()));
        });
      }, 300);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        input.value = '';
        clearHighlights();
        document.querySelectorAll('.search-hidden').forEach(el => el.classList.remove('search-hidden'));
      }
    });
  }

  /* ── Mobile menu ── */
  function setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const links = document.querySelector('.nav-links');
    if (!btn || !links) return;
    let open = false;
    btn.addEventListener('click', () => {
      open = !open;
      links.style.display = open ? 'flex' : '';
      links.style.flexDirection = open ? 'column' : '';
      links.style.position = open ? 'absolute' : '';
      links.style.top = open ? 'var(--nav-h)' : '';
      links.style.left = open ? '0' : '';
      links.style.right = open ? '0' : '';
      links.style.background = open ? 'var(--surface)' : '';
      links.style.padding = open ? '12px 24px 20px' : '';
      links.style.borderBottom = open ? '1px solid var(--border)' : '';
      links.style.zIndex = open ? '999' : '';
      btn.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        open = false;
        links.style.display = '';
        btn.textContent = '☰';
      });
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    // Theme button
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
      const cur = document.documentElement.getAttribute('data-theme');
      themeBtn.textContent = cur === 'dark' ? '☀️' : '🌙';
      themeBtn.addEventListener('click', toggleTheme);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    setupSmoothScroll();
    setupFadeIn();
    setupFlipCards();
    setupTabs('.toolkit-container', '.tab-btn', '.tab-panel');
    setupTabs('.study-container', '.study-tab', '.study-panel');
    setupAccordion();
    setupStudyGuide();
    setupCopyBtns();
    setupSearch();
    setupMobileMenu();
  });

})();
