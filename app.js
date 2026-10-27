/* ═══════════════════════════════════════════════════════════════
   app.js — SAP Fiori Executive Report
   Navigation · scroll-spy · placeholder charts
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────── NAV + SCROLL SPY ─────────── */
  const pills    = Array.from(document.querySelectorAll('.pill'));
  const targets  = pills.map(p => document.querySelector(p.getAttribute('href')));

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

  /* ─────────── PLACEHOLDER MORE LINKS ─────────── */
  document.querySelectorAll('.more').forEach(a =>
    a.addEventListener('click', e => e.preventDefault())
  );

  /* ─────────── CHARTS (Chart.js) ─────────── */
  if (typeof Chart === 'undefined') return;

  const css   = getComputedStyle(document.documentElement);
  const token = n => css.getPropertyValue(n).trim();
  const PALETTE = ['--c1','--c2','--c3','--c4','--c5','--c6'].map(token);
  const INK     = token('--ink-600');
  const LINE    = token('--line');

  Chart.defaults.font.family = token('--font') || 'Arial, sans-serif';
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = INK;

  /* ── Bar chart (placeholder) ── */
  const bar = document.getElementById('barChart');
  if (bar) {
    new Chart(bar, {
      type: 'bar',
      data: {
        labels: ['(text)', '(text)', '(text)', '(text)', '(text)', '(text)'],
        datasets: [{
          label: '(text)',
          data: [42, 58, 35, 70, 50, 63],   // (XX) placeholder values
          backgroundColor: PALETTE[0],
          borderRadius: 4,
          maxBarThickness: 40
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: LINE }, beginAtZero: true, ticks: { callback: () => '(XX)' } }
        }
      }
    });
  }

  /* ── Donut chart (placeholder) ── */
  const donut = document.getElementById('donutChart');
  if (donut) {
    new Chart(donut, {
      type: 'doughnut',
      data: {
        labels: ['(text)', '(text)', '(text)', '(text)'],
        datasets: [{
          data: [35, 25, 22, 18],   // (XX) placeholder values
          backgroundColor: PALETTE.slice(0, 4),
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
