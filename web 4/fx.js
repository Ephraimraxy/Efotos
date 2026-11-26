/* Optional motion layer. Each site turns effects on/off in config.js -> window.FX
   reveal:'up|blur|zoom|left|clip|flip'  tilt:'sel' spot:'sel' magnet:'sel' ripple:'sel' split:'sel' scramble:'sel'
   parallax:'sel' heroFade:'sel' cursor:'ring|blob|dot|none'  tiltMax:8  */
(() => {
  const F = window.FX || {};
  const $$ = (s, r = document) => (s ? [...r.querySelectorAll(s)] : []);
  document.body.classList.add('rv-' + (F.reveal || 'up'));
  const fine = matchMedia('(pointer:fine)').matches, calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (calm) return;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* spotlight that follows the cursor inside cards */
  if (fine) $$(F.spot).forEach(el => {
    const g = document.createElement('i'); g.className = 'fx-glow'; g.setAttribute('aria-hidden', 'true'); el.append(g);
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px'); });
  });

  /* 3D tilt */
  if (fine) $$(F.tilt).forEach(el => {
    const max = +F.tiltMax || 8; el.classList.add('fx-tilt');
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-4px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* magnetic buttons */
  if (fine) $$(F.magnet).forEach(el => {
    el.classList.add('fx-mag');
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * .28).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * .38).toFixed(1)}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* click ripple */
  $$(F.ripple).forEach(el => { el.classList.add('fx-rip'); el.addEventListener('pointerdown', e => { const r = el.getBoundingClientRect(), s = document.createElement('span'), d = Math.max(r.width, r.height) * 2; s.className = 'fx-ripple'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`; el.append(s); setTimeout(() => s.remove(), 700); }); });

  /* word-by-word text reveal */
  const split = el => {
    let i = 0;
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        if (!c.textContent.trim()) return;
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { f.append(' '); return; } const o = document.createElement('span'), inn = document.createElement('span'); o.className = 'w'; inn.textContent = w; inn.style.setProperty('--i', i++); o.append(inn); f.append(o); });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && c.tagName !== 'BR' && !c.classList.contains('w')) walk(c);
    });
    walk(el); el.classList.add('fx-split');
  };
  const sio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); sio.unobserve(en.target); } }), { threshold: .2 }) : null;
  $$(F.split).forEach(el => { split(el); sio ? sio.observe(el) : el.classList.add('in'); });

  /* text scramble (on view + hover) */
  const CH = '!<>-_\\/[]{}—=+*^?#ABCDEFGHJKLMNPRSTUVWXYZ';
  const scramble = el => {
    if (el.__sc) return; el.__sc = true; const txt = el.dataset.text || el.textContent; el.dataset.text = txt; let f = 0; const tot = 22;
    const t = setInterval(() => { f++; el.textContent = txt.split('').map((c, i) => c === ' ' || c === '\n' ? c : (i < txt.length * f / tot ? c : CH[Math.random() * CH.length | 0])).join(''); if (f >= tot) { clearInterval(t); el.textContent = txt; el.__sc = false; } }, 32);
  };
  $$(F.scramble).forEach(el => { if (el.children.length) return; el.addEventListener('pointerenter', () => scramble(el)); if ('IntersectionObserver' in window) { const o = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { scramble(el); o.disconnect(); } })); o.observe(el); } });

  /* parallax + hero fade */
  const par = $$(F.parallax), hero = $$(F.heroFade);
  if (par.length || hero.length) {
    let tick = false;
    const run = () => { tick = false; const vh = innerHeight;
      par.forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return; const sp = +el.dataset.speed || .12; el.style.transform = `translate3d(0,${(((r.top + r.height / 2) - vh / 2) * -sp).toFixed(1)}px,0)`; });
      hero.forEach(el => { const y = Math.min(scrollY, 700); el.style.transform = `translate3d(0,${(y * .22).toFixed(1)}px,0)`; el.style.opacity = Math.max(0, 1 - y / 650).toFixed(2); });
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true }); run();
  }

  /* custom cursor followers */
  if (fine && F.cursor && F.cursor !== 'none') {
    const dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'fx-cur-dot'; ring.className = 'fx-cur-ring fx-' + F.cursor; document.body.append(ring);
    if (F.cursor !== 'blob') document.body.append(dot);
    let x = -100, y = -100, rx = -100, ry = -100;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; document.body.classList.add('fx-cur-on'); dot.style.transform = `translate(${x}px,${y}px)`; });
    document.addEventListener('pointerleave', () => document.body.classList.remove('fx-cur-on'));
    const loop = () => { rx = lerp(rx, x, F.cursor === 'blob' ? .08 : .17); ry = lerp(ry, y, F.cursor === 'blob' ? .08 : .17); ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); }; loop();
    document.addEventListener('pointerover', e => { ring.classList.toggle('hov', !!e.target.closest('a,button,[data-modal],[data-video],[data-zoom],summary,input,select,textarea,label')); });
    document.addEventListener('pointerdown', () => ring.classList.add('down')); document.addEventListener('pointerup', () => ring.classList.remove('down'));
  }
})();
