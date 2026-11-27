/* Signature interactions, set 2 (window.FX.sig). Different from the set in fx-pack.js.
   dotfield | ink | confetti | petals | card3d | letterroll | magnifier | bubble | leaves | gps
   A site without `sig` stays plain. Mouse only; respects "reduce motion". */
(() => {
  const F = window.FX || {}, sig = F.sig;
  const prev = window.PackInit || (() => {});
  const NAMES = ['dotfield', 'ink', 'confetti', 'petals', 'card3d', 'letterroll', 'magnifier', 'bubble', 'leaves', 'gps'];
  if (!NAMES.includes(sig) || !matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const $$ = (s, r = document) => (s ? [...r.querySelectorAll(s)] : []);
  const lerp = (a, b, t) => a + (b - a) * t;
  const mk = (cls, tag = 'div') => { const d = document.createElement(tag); d.className = cls; document.body.append(d); return d; };
  const rel = c => { if (getComputedStyle(c).position === 'static') c.style.position = 'relative'; };
  let bind = () => {};

  const fullCanvas = () => { const cv = mk('fxp2-canvas', 'canvas'), g = cv.getContext('2d'); const st = { W: 0, H: 0 }; const rs = () => { st.W = cv.width = innerWidth; st.H = cv.height = innerHeight; }; rs(); addEventListener('resize', rs); return { cv, g, st }; };

  /* 1 · DOTFIELD – a grid of dots inside the hero that pushes away from the cursor and lights up */
  const dotfield = () => {
    bind = root => $$(F.field, root).forEach(box => {
      const cv = document.createElement('canvas'); cv.className = 'fxp2-field'; box.prepend(cv); rel(box); const g = cv.getContext('2d');
      let W, H, mx = -999, my = -999, run = false; const GAP = 30, R = 130;
      const size = () => { const r = box.getBoundingClientRect(); W = cv.width = r.width; H = cv.height = r.height; draw(); };
      const draw = () => {
        g.clearRect(0, 0, W, H); let moving = false;
        for (let x = GAP / 2; x < W; x += GAP) for (let y = GAP / 2; y < H; y += GAP) {
          const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy); let ox = 0, oy = 0, k = 0;
          if (d < R) { k = 1 - d / R; ox = dx / (d || 1) * k * 20; oy = dy / (d || 1) * k * 20; moving = true; }
          g.fillStyle = `rgba(255,255,255,${.16 + k * .8})`; g.beginPath(); g.arc(x + ox, y + oy, 1.4 + k * 3.2, 0, 7); g.fill();
        }
        run = moving ? (requestAnimationFrame(draw), true) : false;
      };
      size(); addEventListener('resize', size);
      box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; if (!run) { run = true; requestAnimationFrame(draw); } });
      box.addEventListener('pointerleave', () => { mx = my = -999; if (!run) requestAnimationFrame(draw); });
    });
  };

  /* 2 · INK – the cursor draws a tapering ink line that fades away */
  const ink = () => {
    const { g, st } = fullCanvas(); const pts = [];
    addEventListener('pointermove', e => { pts.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (pts.length > 60) pts.shift(); });
    (function loop() {
      g.clearRect(0, 0, st.W, st.H); const now = performance.now(); g.lineCap = 'round'; g.lineJoin = 'round';
      while (pts.length && now - pts[0].t > 650) pts.shift();
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], age = (now - b.t) / 650; g.strokeStyle = `rgba(245,163,18,${(1 - age) * .9})`; g.lineWidth = 1 + (i / pts.length) * 7 * (1 - age); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
      requestAnimationFrame(loop);
    })();
  };

  /* 3 · CONFETTI – every click bursts into party confetti */
  const confetti = () => {
    const { g, st } = fullCanvas(); const P = []; const COL = ['#f7941d', '#ffc84a', '#ffffff', '#6d6e71', '#ff6b6b', '#4fc3f7'];
    addEventListener('pointerdown', e => { for (let i = 0; i < 46; i++) { const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 7; P.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, w: 5 + Math.random() * 6, h: 3 + Math.random() * 5, c: COL[Math.random() * COL.length | 0], l: 1 }); } });
    (function loop() {
      g.clearRect(0, 0, st.W, st.H);
      for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.x += p.vx; p.y += p.vy; p.vy += .22; p.vx *= .985; p.r += p.vr; p.l -= .011; if (p.l <= 0 || p.y > st.H + 30) { P.splice(i, 1); continue; } g.save(); g.globalAlpha = Math.min(1, p.l * 1.6); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore(); }
      requestAnimationFrame(loop);
    })();
  };

  /* 4 · PETALS – soft blossom petals drift down from the cursor */
  const petals = () => {
    let t = 0, lx = 0, ly = 0;
    addEventListener('pointermove', e => {
      const n = performance.now(); if (n - t < 85 || Math.hypot(e.clientX - lx, e.clientY - ly) < 18) return; t = n; lx = e.clientX; ly = e.clientY;
      const p = document.createElement('i'); p.className = 'fxp2-petal'; p.style.left = lx + 'px'; p.style.top = ly + 'px';
      p.style.setProperty('--dx', (Math.random() * 120 - 40).toFixed(0) + 'px'); p.style.setProperty('--r', (Math.random() * 540 - 270).toFixed(0) + 'deg'); p.style.setProperty('--s', (.6 + Math.random() * .8).toFixed(2)); p.style.setProperty('--d', (2.4 + Math.random() * 1.6).toFixed(1) + 's');
      p.style.background = ['#f8d7e0', '#fbe9ee', '#f3bfcf', '#ffffff'][Math.random() * 4 | 0]; document.body.append(p); setTimeout(() => p.remove(), 4200);
    });
  };

  /* 5 · CARD3D – the hero cards turn in 3D to face wherever the cursor is on the page */
  const card3d = () => {
    const els = () => $$(F.card3d);
    addEventListener('pointermove', e => { const rx = ((e.clientY / innerHeight) - .5) * -16, ry = ((e.clientX / innerWidth) - .5) * 22; els().forEach((el, i) => { el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${i * 12}px)`; }); });
    bind = root => $$(F.card3d, root).forEach(el => el.classList.add('fxp2-c3d'));
  };

  /* 6 · LETTERROLL – button and link text rolls letter by letter on hover */
  const letterroll = () => {
    bind = root => $$(F.roll, root).forEach(el => {
      if (el.dataset.rolled) return; el.dataset.rolled = '1';
      [...el.childNodes].forEach(n => {
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        const txt = n.textContent.replace(/\s+/g, ' '), w = document.createElement('span'); w.className = 'fxr';
        const mkLayer = cls => { const l = document.createElement('span'); l.className = cls; l.setAttribute('aria-hidden', cls === 'b'); [...txt].forEach((c, i) => { const b = document.createElement('b'); b.textContent = c === ' ' ? ' ' : c; b.style.setProperty('--i', i); l.append(b); }); return l; };
        const a = mkLayer('a'); const bl = mkLayer('b'); w.append(a, bl); w.setAttribute('aria-label', txt.trim()); n.replaceWith(w);
      });
    });
  };

  /* 7 · MAGNIFIER – a round magnifying glass follows the cursor over photos */
  const magnifier = () => {
    bind = root => $$(F.mag, root).forEach(box => {
      const lens = document.createElement('i'); lens.className = 'fxp2-mag'; const inn = document.createElement('b'); lens.append(inn); box.append(lens); rel(box); const Z = 2.3;
      box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; lens.style.left = x - 85 + 'px'; lens.style.top = y - 85 + 'px'; inn.style.cssText = `width:${r.width * Z}px;height:${r.height * Z}px;left:${85 - x * Z}px;top:${85 - y * Z}px;background-image:${getComputedStyle(box).getPropertyValue('--img')};background-position:${getComputedStyle(box).getPropertyValue('--pos') || 'center'}`; lens.classList.add('on'); });
      box.addEventListener('pointerleave', () => lens.classList.remove('on'));
    });
  };

  /* 8 · BUBBLE – a frosted-glass bubble floats after the cursor and swells over photos */
  const bubble = () => {
    const b = mk('fxp2-bubble'); let x = -200, y = -200, rx = x, ry = y;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; b.classList.add('on'); });
    document.addEventListener('pointerleave', () => b.classList.remove('on'));
    document.addEventListener('pointerover', e => { b.classList.toggle('big', !!e.target.closest('.ph,[data-media],img')); b.classList.toggle('tiny', !!e.target.closest('a,button,input,select,textarea,label')); });
    (function loop() { rx = lerp(rx, x, .13); ry = lerp(ry, y, .13); b.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  };

  /* 9 · LEAVES – little green leaves spin off the cursor and float down */
  const leaves = () => {
    let t = 0, lx = 0, ly = 0; const SVG = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z" fill="currentColor"/><path d="M4 20 15 9" stroke="rgba(255,255,255,.55)" stroke-width="1.2" fill="none"/></svg>';
    addEventListener('pointermove', e => {
      const n = performance.now(); if (n - t < 100 || Math.hypot(e.clientX - lx, e.clientY - ly) < 22) return; t = n; lx = e.clientX; ly = e.clientY;
      const p = document.createElement('i'); p.className = 'fxp2-leaf'; p.innerHTML = SVG; p.style.left = lx + 'px'; p.style.top = ly + 'px';
      p.style.setProperty('--dx', (Math.random() * 140 - 30).toFixed(0) + 'px'); p.style.setProperty('--r', (Math.random() * 600 - 300).toFixed(0) + 'deg'); p.style.setProperty('--s', (.6 + Math.random() * .7).toFixed(2));
      p.style.color = ['#2e8b3a', '#4cae4f', '#7cc576', '#1f6b2c', '#a4d65e'][Math.random() * 5 | 0]; document.body.append(p); setTimeout(() => p.remove(), 3000);
    });
  };

  /* 10 · GPS – survey crosshair lines with live coordinates follow the cursor */
  const gps = () => {
    const h = mk('fxp2-gh'), v = mk('fxp2-gv'), tag = mk('fxp2-gtag');
    addEventListener('pointermove', e => {
      h.style.transform = `translateY(${e.clientY}px)`; v.style.transform = `translateX(${e.clientX}px)`; tag.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 14}px)`;
      const lat = (12.9716 + (.5 - e.clientY / innerHeight) * 1.2).toFixed(4), lon = (77.5946 + (e.clientX / innerWidth - .5) * 1.6).toFixed(4);
      tag.textContent = `${lat}°N  ${lon}°E`; [h, v, tag].forEach(x => x.classList.add('on'));
    });
    document.addEventListener('pointerleave', () => [h, v, tag].forEach(x => x.classList.remove('on')));
    document.addEventListener('pointerover', e => tag.classList.toggle('lock', !!e.target.closest('a,button')));
  };

  ({ dotfield, ink, confetti, petals, card3d, letterroll, magnifier, bubble, leaves, gps }[sig])();
  window.PackInit = root => { prev(root); bind(root || document); };
  bind(document);
})();
