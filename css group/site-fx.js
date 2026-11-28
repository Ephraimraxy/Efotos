/* CSS Group – motion layer (mouse, scroll, hover and click animations). Pure JS, no libraries.
   Respects "reduce motion" and only uses mouse effects on devices with a mouse. */
(function () {
  'use strict';
  var calm = matchMedia('(prefers-reduced-motion:reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  if (calm) return;

  /* ---- 1. header shrinks and gets a shadow while scrolling ---- */
  function onScroll() { var h = document.querySelector('.hd'); if (h) h.classList.toggle('shrunk', window.scrollY > 40); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---- 2. scroll animations: each kind of section moves differently ---- */
  var MAP = [
    ['.trio > div', 'an-jump'], ['.sc', 'an-flipin'], ['.vis > div', 'an-spin'], ['.vc', 'an-flipx'], ['.nums > div', 'an-jump'], ['.vm > div', 'an-side'],
    ['.nw', 'an-rise'], ['.pjc', 'an-zoom'], ['.gal .ph', 'an-tilt'], ['.about > *', 'an-rise'], ['.feat .wrap > *', 'an-side'], ['.stat .wrap > div', 'an-jump'],
    ['.quote', 'an-zoom'], ['.cbk', 'an-rise'], ['.sv > *', 'an-side'], ['.off', 'an-rise'], ['.top2', 'an-rise'], ['.ft .cols > div', 'an-rise']
  ];
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
  function prepare(root) {
    if (!io) return;
    MAP.forEach(function (m) {
      $$(m[0], root).forEach(function (el, i) {
        if (el.getAttribute('data-an')) return; el.setAttribute('data-an', '1'); el.classList.remove('reveal'); el.classList.add('an', m[1]);
        el.style.setProperty('--d', (Math.min(i, 8) * 90) + 'ms');
        var r = el.getBoundingClientRect(); if (r.top < innerHeight * .92 && r.bottom > 0) { requestAnimationFrame(function () { el.classList.add('in'); }); } else io.observe(el);
      });
    });
    $$('.fr h2, .news h2, .pj h2, .feat h2, .about h2, .quote p', root).forEach(function (h) { if (!h.getAttribute('data-ul')) { h.setAttribute('data-ul', '1'); h.classList.add('uline'); io.observe(h); } });
  }
  var busy = false;
  function sched() { if (busy) return; busy = true; requestAnimationFrame(function () { busy = false; prepare(document); }); }
  document.addEventListener('DOMContentLoaded', sched); new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
  sched();

  /* ---- 3. mouse movement ---- */
  if (fine) {
    var hero = null, hx = 0, hy = 0, cx = 0, cy = 0, raf = 0;
    function loop() {
      cx += (hx - cx) * .08; cy += (hy - cy) * .08;
      if (hero && hero.isConnected) { hero.style.setProperty('--mx', cx.toFixed(3)); hero.style.setProperty('--my', cy.toFixed(3)); }
      raf = (Math.abs(hx - cx) > .002 || Math.abs(hy - cy) > .002) ? requestAnimationFrame(loop) : 0;
    }
    document.addEventListener('pointermove', function (e) {
      hero = document.querySelector('.hero'); if (!hero) return; var r = hero.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) { hx = 0; hy = 0; } else { hx = (e.clientX - r.left) / r.width - .5; hy = (e.clientY - r.top) / r.height - .5; hero.style.setProperty('--px', (e.clientX - r.left) + 'px'); hero.style.setProperty('--py', (e.clientY - r.top) + 'px'); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    /* glare + 3D tilt on cards that are not flip cards */
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.nw, .vc, .vis > div, .trio > div, .pjc, .vm > div'); if (!c) return;
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--rx', ((.5 - y) * 9).toFixed(2) + 'deg'); c.style.setProperty('--ry', ((x - .5) * 11).toFixed(2) + 'deg'); c.style.setProperty('--gx', (x * 100).toFixed(0) + '%'); c.style.setProperty('--gy', (y * 100).toFixed(0) + '%'); c.classList.add('tilting');
    }, { passive: true });
    document.addEventListener('pointerout', function (e) { var c = e.target.closest && e.target.closest('.tilting'); if (c && !c.contains(e.relatedTarget)) { c.classList.remove('tilting'); c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); } });
  }

  /* ---- 4. click effects: jump + ring burst ---- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.btn, .nav > ul > li > a, .logo'); if (!b) return;
    b.classList.remove('popped'); void b.offsetWidth; b.classList.add('popped'); setTimeout(function () { b.classList.remove('popped'); }, 700);
    var r = b.getBoundingClientRect(), s = document.createElement('span'); s.className = 'burst'; s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px'; if (getComputedStyle(b).position === 'static') b.style.position = 'relative'; b.appendChild(s); setTimeout(function () { s.remove(); }, 700);
  });
  /* tap on a flip card on touch screens: first tap flips, second opens */
  document.addEventListener('click', function (e) {
    if (fine) return; var c = e.target.closest && e.target.closest('.sc'); if (!c) return;
    if (!c.classList.contains('flipped')) { e.preventDefault(); $$('.sc.flipped').forEach(function (x) { x.classList.remove('flipped'); }); c.classList.add('flipped'); }
  });
})();
