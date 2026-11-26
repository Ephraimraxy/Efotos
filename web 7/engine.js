/* Shared behaviour engine. Content/media live in each site's config.js */
(() => {
  const S = window.SITE || {}, M = window.MEDIA || {}, V = window.VIDEOS || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* ---- text from config ---- */
  $$('[data-site]').forEach(el => { const v = S[el.dataset.site]; if (v != null) el.textContent = Array.isArray(v) ? v.join(', ') : v; });
  $$('[data-site-href]').forEach(el => { const d = el.dataset.siteHref, i = d.indexOf(':'), k = d.slice(0, i), p = d.slice(i + 1); const v = String(S[k] || ''); el.href = p + (k === 'phone' ? v.replace(/[^\d+]/g, '') : v); });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const cur = $$('.nav a').find(a => (a.getAttribute('href') || '').split('#')[0].toLowerCase() === page);
  if (cur) cur.closest('.nav>ul>li')?.classList.add('active');

  /* ---- media from config.js ---- */
  $$('[data-media]').forEach(el => {
    const m = M[el.dataset.media]; if (!m) return console.warn('No media entry:', el.dataset.media);
    const probe = new Image();
    probe.onload = () => {
      if (el.tagName === 'IMG') { el.src = probe.src; el.alt = m.alt || ''; }
      else { el.style.setProperty('--img', `url("${probe.src}")`); if (m.alt) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', m.alt); } if (m.pos) el.style.setProperty('--pos', m.pos); }
      el.classList.add('has-img');
    };
    probe.onerror = () => { if (m.fallback && !probe.src.endsWith(m.fallback)) probe.src = m.fallback; };
    probe.src = m.src;
  });

  /* ---- header ---- */
  const hd = $('.hd');
  if (hd) { const f = () => hd.classList.toggle('stuck', scrollY > 60); addEventListener('scroll', f, { passive: true }); f(); }
  const burger = $('.burger'), nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
    $$('.has-sub > a').forEach(a => a.addEventListener('click', e => { const li = a.parentElement; if (innerWidth <= 960 && !li.classList.contains('open')) { e.preventDefault(); li.classList.add('open'); } }));
    $$('.nav a').forEach(a => a.addEventListener('click', () => { if (innerWidth <= 960 && !a.parentElement.classList.contains('has-sub')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); } }));
  }

  /* ---- modals ---- */
  document.body.insertAdjacentHTML('beforeend', '<div class="modal" id="mediaModal" hidden><div class="modal-box wide" role="dialog" aria-modal="true" aria-label="Media"><button class="modal-x" data-close aria-label="Close">×</button><div class="ratio" id="mediaSlot"></div></div></div>');
  let last;
  const openM = m => { last = document.activeElement; m.hidden = false; document.body.style.overflow = 'hidden'; const c = $('[data-close]', m); c && c.focus(); };
  const closeM = m => { m.hidden = true; document.body.style.overflow = ''; if (m.id === 'mediaModal') $('#mediaSlot').innerHTML = ''; last && last.focus && last.focus(); };
  $$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) closeM(m); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal').forEach(m => !m.hidden && closeM(m)); });
  $$('[data-modal]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const m = document.getElementById(b.dataset.modal); if (m) { const sel = $('[name=ticket],[name=service],[name=plan]', m); if (sel && b.dataset.pick) sel.value = b.dataset.pick; openM(m); } }));
  const player = (src, title) => {
    let m;
    if ((m = src.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/))) return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    if ((m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return `<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=1" title="${esc(title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(src)) return `<video src="${esc(src)}" controls autoplay playsinline></video>`;
    return `<iframe src="${esc(src)}" title="${esc(title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  };
  $$('[data-video]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); const v = V[el.dataset.video]; if (!v) return; $('#mediaSlot').innerHTML = player(v.src, v.title || 'Video'); openM($('#mediaModal')); }));
  $$('[data-zoom]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); const m = M[el.dataset.zoom]; if (!m) return; $('#mediaSlot').innerHTML = `<img src="${esc(m.src.replace(/w=\d+/, 'w=1600'))}" alt="${esc(m.alt || '')}">`; openM($('#mediaModal')); }));

  /* ---- forms (POST to the Node server, or S.formEndpoint) ---- */
  const calc = f => {
    const sel = $('select[name=ticket] option:checked,select[name=plan] option:checked', f), q = $('[name=qty]', f), out = $('[data-total]', f);
    if (!sel || !out || sel.dataset.price == null) return;
    const total = (+sel.dataset.price) * Math.max(1, +(q && q.value) || 1);
    out.textContent = (S.currency || '$') + total.toLocaleString(); let h = $('[name=total]', f); if (!h) { h = document.createElement('input'); h.type = 'hidden'; h.name = 'total'; f.append(h); } h.value = total;
  };
  $$('form[data-calc]').forEach(f => { f.addEventListener('input', () => calc(f)); f.addEventListener('change', () => calc(f)); calc(f); });
  const ENDPOINT = S.formEndpoint || '/api/forms';
  $$('form[data-form]').forEach(form => {
    let msg = $('.form-msg', form); if (!msg) { msg = document.createElement('p'); msg.className = 'form-msg'; msg.setAttribute('role', 'status'); (form.querySelector('[type=submit]') || form.lastElementChild).before(msg); }
    form.addEventListener('submit', async e => {
      e.preventDefault(); let ok = true;
      $$('[required]', form).forEach(f => { const bad = !String(f.value).trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)) || (f.type === 'checkbox' && !f.checked); f.classList.toggle('invalid', bad); if (bad) ok = false; });
      msg.className = 'form-msg';
      if (!ok) { msg.textContent = 'Please complete the highlighted fields (and use a valid email).'; msg.classList.add('err'); return; }
      const data = { type: form.dataset.form, page }; new FormData(form).forEach((v, k) => { data[k] = v; });
      const btn = $('[type=submit]', form); btn && (btn.disabled = true);
      try {
        const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw 0;
        msg.textContent = form.dataset.success || 'Thank you! We received your request and will be in touch shortly.'; msg.classList.add('ok'); form.reset(); calc(form);
        const modal = form.closest('.modal'); if (modal) setTimeout(() => closeM(modal), 2200);
      } catch { msg.textContent = 'We could not reach the server. Please call ' + (S.phone || 'us') + ' or email ' + (S.email || 'us') + '.'; msg.classList.add('err'); }
      finally { btn && (btn.disabled = false); }
    });
  });

  /* ---- tabs (nested, deep-linkable) ---- */
  const tabsOf = r => $$(':scope > [role=tablist] > button', r), panelsOf = r => $$(':scope > [data-panel]', r);
  const act = (root, id) => { tabsOf(root).forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; }); panelsOf(root).forEach(p => p.classList.toggle('on', p.id === id)); };
  $$('[data-tabs]').forEach(root => {
    const f = tabsOf(root)[0]; if (f) act(root, f.dataset.tab);
    root.addEventListener('click', e => { const b = e.target.closest('button[data-tab]'); if (b && b.parentElement.parentElement === root) act(root, b.dataset.tab); });
    root.addEventListener('keydown', e => { const b = e.target.closest('button[data-tab]'); if (!b || b.parentElement.parentElement !== root) return; const l = tabsOf(root), n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (n) { e.preventDefault(); const t = l[(l.indexOf(b) + n + l.length) % l.length]; t.focus(); act(root, t.dataset.tab); } });
  });
  const openHash = () => {
    const el = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1))); if (!el) return;
    const ch = []; let p = el.closest('[data-panel]'); while (p) { ch.unshift(p); p = p.parentElement.closest('[data-panel]'); }
    ch.forEach(pp => act(pp.parentElement, pp.id));
    if (ch.length) scrollTo({ top: Math.max(ch[0].parentElement.getBoundingClientRect().top + scrollY - 110, 0), behavior: 'smooth' });
  };
  addEventListener('hashchange', openHash); openHash();

  /* ---- filters ---- */
  $$('[data-filters]').forEach(root => {
    const btns = $$('[data-filter]', root), items = $$('[data-cat]', root);
    btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x => x.classList.toggle('on', x === b)); const f = b.dataset.filter; items.forEach(i => i.classList.toggle('off', f !== 'all' && !i.dataset.cat.split(' ').includes(f))); }));
  });

  /* ---- accordion (one open at a time) ---- */
  $$('.acc[data-one]').forEach(a => $$('details', a).forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('details', a).forEach(o => o !== d && (o.open = false)); })));

  /* ---- carousel ---- */
  $$('[data-carousel]').forEach(c => {
    const sl = $$('.slide', c), dots = $('.dots', c); let i = 0, t;
    const show = n => { i = (n + sl.length) % sl.length; sl.forEach((s, k) => s.classList.toggle('on', k === i)); dots && $$('button', dots).forEach((d, k) => d.classList.toggle('on', k === i)); };
    const go = () => { clearInterval(t); if (c.dataset.auto !== 'off' && !matchMedia('(prefers-reduced-motion:reduce)').matches) t = setInterval(() => show(i + 1), +c.dataset.auto || 5500); };
    if (dots) sl.forEach((_, k) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Slide ' + (k + 1)); b.onclick = () => { show(k); go(); }; dots.append(b); });
    $$('[data-prev]', c.parentElement).forEach(b => b.onclick = () => { show(i - 1); go(); }); $$('[data-next]', c.parentElement).forEach(b => b.onclick = () => { show(i + 1); go(); });
    c.addEventListener('mouseenter', () => clearInterval(t)); c.addEventListener('mouseleave', go); show(0); go();
  });

  /* ---- countdown ---- */
  $$('[data-countdown]').forEach(el => {
    const end = new Date(el.dataset.countdown).getTime(), set = (u, v) => { const n = $(`[data-u=${u}]`, el); if (!n) return; const t = String(v).padStart(2, '0'); if (n.textContent !== t) { n.textContent = t; n.classList.remove('flip'); void n.offsetWidth; n.classList.add('flip'); } };
    const tick = () => { let d = Math.max(0, end - Date.now()); set('d', Math.floor(d / 864e5)); set('h', Math.floor(d % 864e5 / 36e5)); set('m', Math.floor(d % 36e5 / 6e4)); set('s', Math.floor(d % 6e4 / 1e3)); };
    tick(); setInterval(tick, 1000);
  });

  /* ---- billing toggle ---- */
  const bill = $('[data-billing]');
  if (bill) bill.addEventListener('click', e => { const b = e.target.closest('button[data-mode]'); if (!b) return; $$('button', bill).forEach(x => x.classList.toggle('on', x === b)); $$('[data-month]').forEach(el => el.textContent = (el.dataset.cur || '$') + el.dataset[b.dataset.mode === 'year' ? 'year' : 'month']); $$('[data-per]').forEach(el => el.textContent = b.dataset.mode === 'year' ? el.dataset.yearLabel || '/yr' : el.dataset.monthLabel || '/mo'); });

  /* ---- reveal + counters ---- */
  $$('.reveal').forEach(el => { const s = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.setProperty('--d', Math.min(s.indexOf(el), 6) * 90 + 'ms'); });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target); const el = en.target;
    if (el.dataset.count) { const end = +el.dataset.count, suf = el.dataset.suffix || '', pre = el.dataset.prefix || '', t0 = performance.now(); const tick = t => { const p = Math.min((t - t0) / 1500, 1); el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf; if (p < 1) requestAnimationFrame(tick); else el.classList.add('pop'); }; requestAnimationFrame(tick); }
    else el.classList.add('in');
  }), { threshold: .12 }) : null;
  $$('[data-count],.reveal').forEach(el => io ? io.observe(el) : (el.classList.add('in'), el.dataset.count && (el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || ''))));

  /* ---- progress bar + page transitions ---- */
  if (document.body.hasAttribute('data-progress')) { const bar = document.createElement('div'); bar.className = 'progress'; document.body.append(bar); const p = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }; addEventListener('scroll', p, { passive: true }); p(); }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const u = new URL(a.href, location.href); if (u.origin !== location.origin || u.pathname === location.pathname || /^(mailto|tel):/.test(a.getAttribute('href'))) return;
    e.preventDefault(); document.body.classList.add('leaving'); setTimeout(() => { location.href = u.href; }, 200);
  });
  addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leaving'); });
})();
