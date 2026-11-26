/* Signature cursor / hover interaction – ONE per site, chosen with window.FX.sig in config.js.
   label | sparkle | plane | lens | stage | depth | preview | frame | ripple
   Only runs with a mouse (fine pointer) and when "reduce motion" is off. */
(() => {
  const F = window.FX || {}, sig = F.sig;
  if (!sig || !matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const $$ = (s, r = document) => (s ? [...r.querySelectorAll(s)] : []);
  const lerp = (a, b, t) => a + (b - a) * t;
  const mk = (cls, tag = 'div') => { const d = document.createElement(tag); d.className = cls; document.body.append(d); return d; };
  const rel = c => { if (getComputedStyle(c).position === 'static') c.style.position = 'relative'; };
  const track = (c, fn) => { c.addEventListener('pointermove', e => fn(e, c.getBoundingClientRect())); };
  const INTERACTIVE = 'a,button,[data-modal],[data-video],[data-zoom],summary,input,select,textarea,label';

  const SIG = {
    /* 1 · LABEL – a dot that turns into a word ("Play", "Open", "View", "Go") */
    label() {
      const c = mk('fxp-label'), t = document.createElement('span'); c.append(t);
      let x = -99, y = -99, rx = x, ry = y;
      addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; c.classList.add('on'); });
      document.addEventListener('pointerleave', () => c.classList.remove('on'));
      const map = [['[data-video],.video-card,.exc-video', 'Play'], ['[data-zoom],.photo,.thumb', 'View'], ['[data-modal],.btn,button', 'Open'], ['a[href]', 'Go'], ['input,textarea,select,label', '']];
      document.addEventListener('pointerover', e => { let w = null; for (const [s, l] of map) if (e.target.closest(s)) { w = l; break; } c.classList.toggle('big', !!w); c.classList.toggle('hide', w === ''); t.textContent = w || ''; });
      (function loop() { rx = lerp(rx, x, .2); ry = lerp(ry, y, .2); c.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
    },

    /* 2 · SPARKLE – a neon particle trail + borders that glow toward the cursor */
    sparkle() {
      const cv = mk('fxp-canvas', 'canvas'), g = cv.getContext('2d'); let W, H; const rs = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; }; rs(); addEventListener('resize', rs);
      const P = []; let lx = 0, ly = 0;
      addEventListener('pointermove', e => {
        const d = Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY;
        for (let i = 0, n = Math.min(4, 1 + (d / 20 | 0)); i < n; i++) P.push({ x: lx, y: ly, vx: (Math.random() - .5) * 1.8, vy: (Math.random() - .5) * 1.8 - .5, l: 1, s: 2 + Math.random() * 4, h: 285 + Math.random() * 70, star: Math.random() < .4 });
        if (P.length > 170) P.splice(0, P.length - 170);
      });
      const star = (x, y, r) => { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .35 : r * 1.6; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); };
      (function loop() {
        g.clearRect(0, 0, W, H);
        for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.x += p.vx; p.y += p.vy; p.vy += .018; p.l -= .021; if (p.l <= 0) { P.splice(i, 1); continue; } g.globalAlpha = p.l; g.fillStyle = `hsl(${p.h} 100% 66%)`; g.shadowColor = `hsl(${p.h} 100% 60%)`; g.shadowBlur = 14; if (p.star) star(p.x, p.y, p.s * p.l + 1); else { g.beginPath(); g.arc(p.x, p.y, p.s * p.l, 0, 7); g.fill(); } }
        requestAnimationFrame(loop);
      })();
      $$(F.neon).forEach(card => { const b = document.createElement('i'); b.className = 'fxp-neonb'; card.append(b); rel(card); track(card, (e, r) => card.style.setProperty('--ang', (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90) + 'deg')); });
    },

    /* 3 · PLANE – a paper plane that banks toward where you steer; photos pan inside their cards */
    plane() {
      const c = mk('fxp-plane'); c.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M2 12 22 3l-5 18-5-7z" fill="currentColor"/><path d="m12 14 10-11" stroke="#fff" stroke-width="1.3" fill="none"/></svg>';
      let x = -99, y = -99, rx = x, ry = y, ang = 0;
      addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; c.classList.add('on'); });
      document.addEventListener('pointerleave', () => c.classList.remove('on'));
      document.addEventListener('pointerover', e => c.classList.toggle('hov', !!e.target.closest(INTERACTIVE)));
      (function loop() { const dx = x - rx, dy = y - ry; rx += dx * .14; ry += dy * .14; if (Math.hypot(dx, dy) > 2) { const t = Math.atan2(dy, dx) * 180 / Math.PI + 45; ang += (((t - ang + 540) % 360) - 180) * .12; } c.style.transform = `translate(${rx}px,${ry}px) rotate(${ang}deg)`; requestAnimationFrame(loop); })();
      $$(F.pan).forEach(card => { card.classList.add('fxp-pan'); track(card, (e, r) => { card.style.setProperty('--px', ((.5 - (e.clientX - r.left) / r.width) * 30).toFixed(1) + 'px'); card.style.setProperty('--py', ((.5 - (e.clientY - r.top) / r.height) * 22).toFixed(1) + 'px'); }); card.addEventListener('pointerleave', () => { card.style.setProperty('--px', '0px'); card.style.setProperty('--py', '0px'); }); });
    },

    /* 4 · LENS – black-and-white photos turn to colour inside a circle that follows the cursor */
    lens() {
      $$(F.lens).forEach(card => { const l = document.createElement('i'); l.className = 'fxp-lens'; card.append(l); card.classList.add('fxp-lensed'); rel(card); track(card, (e, r) => { card.style.setProperty('--mx', e.clientX - r.left + 'px'); card.style.setProperty('--my', e.clientY - r.top + 'px'); }); });
    },

    /* 5 · STAGE – a spotlight sweeps the hero; cards catch a holographic sheen from the cursor */
    stage() {
      $$(F.beam).forEach(h => { const b = document.createElement('i'); b.className = 'fxp-beam'; h.append(b); track(h, (e, r) => { h.style.setProperty('--bx', e.clientX - r.left + 'px'); h.style.setProperty('--by', e.clientY - r.top + 'px'); }); h.addEventListener('pointerenter', () => h.classList.add('beam-on')); h.addEventListener('pointerleave', () => h.classList.remove('beam-on')); });
      $$(F.sheen).forEach(c => { const s = document.createElement('i'); s.className = 'fxp-sheen'; c.append(s); rel(c); track(c, (e, r) => c.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100).toFixed(1))); });
    },

    /* 6 · DEPTH – icons, titles and text float at different depths; buttons fill like liquid from where you enter */
    depth() {
      $$(F.depth).forEach(c => { c.classList.add('fxp-depth'); track(c, (e, r) => { c.style.setProperty('--dx', (((e.clientX - r.left) / r.width - .5) * 2).toFixed(2)); c.style.setProperty('--dy', (((e.clientY - r.top) / r.height - .5) * 2).toFixed(2)); }); c.addEventListener('pointerleave', () => { c.style.setProperty('--dx', 0); c.style.setProperty('--dy', 0); }); });
      $$(F.liquid).forEach(b => { const l = document.createElement('i'); l.className = 'fxp-liq'; b.prepend(l); b.classList.add('fxp-liqb'); const at = e => { const r = b.getBoundingClientRect(); l.style.left = e.clientX - r.left + 'px'; l.style.top = e.clientY - r.top + 'px'; }; b.addEventListener('pointerenter', e => { at(e); b.classList.add('liq-on'); }); b.addEventListener('pointerleave', e => { at(e); b.classList.remove('liq-on'); }); });
    },

    /* 7 · PREVIEW – hovering a card floats its photo next to the cursor, tilting as you move */
    preview() {
      const pv = mk('fxp-prev'); let x = 0, y = 0, rx = 0, rot = 0, ry = 0;
      Object.entries(F.preview || {}).forEach(([sel, keys]) => $$(sel).forEach((c, i) => {
        c.addEventListener('pointerenter', () => { let src = null; const M = window.MEDIA || {}; if (Array.isArray(keys)) { const m = M[keys[i % keys.length]]; src = m && m.src; } else { const p = c.matches('[data-media]') ? c : c.querySelector('[data-media]'); const m = p && M[p.dataset.media]; src = m && m.src; } if (src) { pv.style.backgroundImage = `url("${src}")`; pv.classList.add('on'); } });
        c.addEventListener('pointerleave', () => pv.classList.remove('on'));
      }));
      addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; });
      (function loop() { const dx = x - rx; rx = lerp(rx, x, .12); ry = lerp(ry, y, .12); rot = lerp(rot, Math.max(-14, Math.min(14, dx * .3)), .15); pv.style.transform = `translate(${rx + 30}px,${ry - 100}px) rotate(${rot}deg)`; requestAnimationFrame(loop); })();
    },

    /* 8 · FRAME – the cursor is a small square that stretches into a frame around whatever you hover */
    frame() {
      const f = mk('fxp-frame'); let x = -99, y = -99, tgt = null; const sel = F.frame || 'a,button';
      const place = () => {
        let r = tgt && tgt.getBoundingClientRect(); if (r && (r.width > 780 || r.height > 520)) { tgt = null; r = null; }
        if (r) { f.classList.add('lock'); f.style.cssText = `left:${r.left - 6}px;top:${r.top - 6}px;width:${r.width + 12}px;height:${r.height + 12}px;border-radius:${(parseFloat(getComputedStyle(tgt).borderTopLeftRadius) || 0) + 5}px`; }
        else { f.classList.remove('lock'); f.style.cssText = `left:${x - 6}px;top:${y - 6}px;width:12px;height:12px;border-radius:3px`; }
      };
      addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; f.classList.add('on'); if (!tgt) place(); });
      document.addEventListener('pointerover', e => { tgt = e.target.closest(sel); place(); });
      document.addEventListener('pointerleave', () => f.classList.remove('on'));
      addEventListener('scroll', () => tgt && place(), { passive: true });
    },

    /* 9 · RIPPLE – soft water rings spread from the cursor; a click sends out a big wave */
    ripple() {
      let lx = 0, ly = 0, t = 0;
      const wave = (x, y, big) => { const w = document.createElement('i'); w.className = 'fxp-wave' + (big ? ' big' : ''); w.style.left = x + 'px'; w.style.top = y + 'px'; document.body.append(w); setTimeout(() => w.remove(), 2300); };
      addEventListener('pointermove', e => { const n = performance.now(); if (n - t > 110 && Math.hypot(e.clientX - lx, e.clientY - ly) > 34) { t = n; lx = e.clientX; ly = e.clientY; wave(lx, ly); } });
      addEventListener('pointerdown', e => wave(e.clientX, e.clientY, true));
    }
  };
  if (SIG[sig]) SIG[sig]();
})();
