/* ═══════════════════════════════════════════════════════════════
   app.js — BTM Communications Report (H2 2026)
   Navigation · scroll-spy · activity charts (counts from the report)
   Built on the SAP Fiori Executive Report design system.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────── NAV + SCROLL SPY ─────────── */
  const pills   = Array.from(document.querySelectorAll('.pill'));
  const targets = pills.map(p => document.querySelector(p.getAttribute('href')));

  function activate(pill) {
    pills.forEach(p => p.classList.remove('pill--active'));
    pill.classList.add('pill--active');
  }

  pills.forEach(p => p.addEventListener('click', () => activate(p)));

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const i = targets.indexOf(e.target);
        if (i > -1) activate(pills[i]);
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  targets.forEach(t => t && spy.observe(t));

  /* ─────────── NON-NAVIGATING "MORE" LINKS ───────────
     Internal/pipeline items use href="#" and should not jump. */
  document.querySelectorAll('.more').forEach(a => {
    if (a.getAttribute('href') === '#') {
      a.addEventListener('click', e => e.preventDefault());
    }
  });

  /* ─────────── CHARTS (Chart.js) ───────────
     All values below are real counts of activities in this report
     (derived from the source activity register), not estimated metrics. */
  if (typeof Chart === 'undefined') return;

  const css   = getComputedStyle(document.documentElement);
  const token = n => css.getPropertyValue(n).trim();
  const PALETTE = ['--c1','--c2','--c3','--c4','--c5','--c6'].map(token);
  const INK     = token('--ink-600');
  const LINE    = token('--line');
  const OK      = token('--ok');
  const WARN    = token('--warn');
  const BLUE    = token('--sap-blue');

  Chart.defaults.font.family = (token('--font') || 'Arial, sans-serif').replace(/"/g, '');
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = INK;

  /* ── Bar: activities by section (counts) ── */
  const bar = document.getElementById('barChart');
  if (bar) {
    new Chart(bar, {
      type: 'bar',
      data: {
        labels: ['Thought\nLeadership', 'Sapphire\n& TechEd', 'Events &\nSpeaking', 'Analyst\nRelations', 'Employee\nComms', 'Strategic\nProjects'],
        datasets: [{
          label: 'Activities',
          data: [4, 4, 2, 1, 10, 2],   // real counts — sums to 23
          backgroundColor: PALETTE[0],
          borderRadius: 4,
          maxBarThickness: 46
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: { title: items => String(items[0].label).replace(/\n/g, ' ') } } },
        scales: {
          x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 0, font: { size: 10 } } },
          y: { grid: { color: LINE }, beginAtZero: true, ticks: { precision: 0, stepSize: 2 } }
        }
      }
    });
  }

  /* ── Donut: delivery status mix (counts) ── */
  const donut = document.getElementById('donutChart');
  if (donut) {
    new Chart(donut, {
      type: 'doughnut',
      data: {
        labels: ['Completed (10)', 'Confirmed (3)', 'Planned (10)'],
        datasets: [{
          data: [10, 3, 10],   // real counts — sums to 23
          backgroundColor: [OK, WARN, BLUE],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        cutout: '62%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, usePointStyle: true } }
        }
      }
    });
  }

})();
