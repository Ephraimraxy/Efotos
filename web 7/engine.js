/* Shared behaviour engine (v2). Content/media live in each site's config.js.
   Everything page-specific lives in init(root) so it can run again on swapped content (see pjax.js). */
(() => {
  const S = window.SITE || {}, M = window.MEDIA || {}, V = window.VIDEOS || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const curPage = () => (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const timers = [];

  /* =============== ONCE: header, modals, delegated handlers =============== */
  const hd = $('.hd');
  if (hd) { const f = () => hd.classList.toggle('stuck', scrollY > 60); addEventListener('scroll', f, { passive: true }); f(); }
  const burger = $('.burger'), nav = $('#nav');
  if (burger && nav) burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
  const closeMenu = () => { if (nav) { nav.classList.remove('open'); burger && burger.setAttribute('aria-expanded', false); $$('.has-sub.open').forEach(l => l.classList.remove('open')); } };
  window.SiteCloseMenu = closeMenu;

  document.body.insertAdjacentHTML('beforeend', '<div class="modal" id="mediaModal" hidden><div class="modal-box wide" role="dialog" aria-modal="true" aria-label="Media"><button class="modal-x" data-close aria-label="Close">×</button><div class="ratio" id="mediaSlot"></div></div></div>');
  let last;
  const openM = m => { last = document.activeElement; m.hidden = false; document.body.style.overflow = 'hidden'; const c = $('[data-close]', m); c && c.focus(); };
  const closeM = m => { m.hidden = true; document.body.style.overflow = ''; if (m.id === 'mediaModal') $('#mediaSlot').innerHTML = ''; last && last.focus && last.focus(); };
  addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal').forEach(m => !m.hidden && closeM(m)); });
  const player = (src, title) => {
    let m;
    if ((m = src.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/))) return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    if ((m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return `<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=1" title="${esc(title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(src)) return `<video src="${esc(src)}" controls autoplay playsinline></video>`;
    return `<iframe src="${esc(src)}" title="${esc(title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  };

  /* tabs helpers */
  const tabsOf = r => $$(':scope > [role=tablist] > button', r), panelsOf = r => $$(':scope > [data-panel]', r);
  const act = (root, id) => { tabsOf(root).forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; }); panelsOf(root).forEach(p => p.classList.toggle('on', p.id === id)); };
  const goHash = instant => {
    const id = location.hash.length > 1 && decodeURIComponent(location.hash.slice(1)); const el = id && document.getElementById(id); if (!el) return;
    const ch = []; let p = el.closest('[data-panel]'); while (p) { ch.unshift(p); p = p.parentElement.closest('[data-panel]'); }
    ch.forEach(pp => act(pp.parentElement, pp.id));
    const target = ch.length ? ch[0].parentElement : el;
    scrollTo({ top: Math.max(target.getBoundingClientRect().top + scrollY - 100, 0), behavior: instant ? 'instant' : 'smooth' });
  };
  window.SiteGoHash = goHash;
  addEventListener('hashchange', () => goHash(false));

  /* calc (ticket / booking totals) */
  const calc = f => {
    const sel = $('select[name=ticket] option:checked,select[name=plan] option:checked', f), q = $('[name=qty]', f), out = $('[data-total]', f);
    if (!sel || !out || sel.dataset.price == null) return;
    const total = (+sel.dataset.price) * Math.max(1, +(q && q.value) || 1);
    out.textContent = (S.currency || '$') + total.toLocaleString(); let h = $('[name=total]', f); if (!h) { h = document.createElement('input'); h.type = 'hidden'; h.name = 'total'; f.append(h); } h.value = total;
  };
  const onCalc = e => { const f = e.target.closest && e.target.closest('form[data-calc]'); if (f) calc(f); };
  document.addEventListener('input', onCalc); document.addEventListener('change', onCalc);

  /* delegated clicks: modals, video, zoom, tabs, filters, billing, mobile menu */
  document.addEventListener('click', e => {
    const t = e.target;
    const sa = t.closest('.has-sub > a');
    if (sa && innerWidth <= 960 && !sa.parentElement.classList.contains('open')) { e.preventDefault(); sa.parentElement.classList.add('open'); return; }
    const na = t.closest('.nav a'); if (na && innerWidth <= 960 && !na.parentElement.classList.contains('has-sub')) closeMenu();

    const opener = t.closest('[data-modal]');
    if (opener) { e.preventDefault(); const m = document.getElementById(opener.dataset.modal); if (m) { const sel = $('[name=ticket],[name=service],[name=plan]', m); if (sel && opener.dataset.pick) { sel.value = opener.dataset.pick; calc(sel.closest('form')); } openM(m); } return; }
    const vid = t.closest('[data-video]'); if (vid) { e.preventDefault(); const v = V[vid.dataset.video]; if (v) { $('#mediaSlot').innerHTML = player(v.src, v.title || 'Video'); openM($('#mediaModal')); } return; }
    const zm = t.closest('[data-zoom]'); if (zm) { e.preventDefault(); const m = M[zm.dataset.zoom]; if (m) { $('#mediaSlot').innerHTML = `<img src="${esc(m.src.replace(/w=\d+/, 'w=1600'))}" alt="${esc(m.alt || '')}">`; openM($('#mediaModal')); } return; }
    const modal = t.closest('.modal'); if (modal && (t === modal || t.closest('[data-close]'))) { closeM(modal); return; }

    const tab = t.closest('button[data-tab]');
    if (tab) { const root = tab.parentElement.parentElement; if (root && root.hasAttribute('data-tabs')) act(root, tab.dataset.tab); return; }
    const flt = t.closest('[data-filters] [data-filter]');
    if (flt) { const root = flt.closest('[data-filters]'); $$('[data-filter]', root).forEach(x => x.classList.toggle('on', x === flt)); const f = flt.dataset.filter; $$('[data-cat]', root).forEach(i => i.classList.toggle('off', f !== 'all' && !i.dataset.cat.split(' ').includes(f))); return; }
    const bill = t.closest('[data-billing] button[data-mode]');
    if (bill) { const wrap = bill.closest('[data-billing]'); $$('button', wrap).forEach(x => x.classList.toggle('on', x === bill)); $$('[data-month]').forEach(el => el.textContent = (el.dataset.cur || '$') + el.dataset[bill.dataset.mode === 'year' ? 'year' : 'month']); $$('[data-per]').forEach(el => el.textContent = bill.dataset.mode === 'year' ? el.dataset.yearLabel || '/yr' : el.dataset.monthLabel || '/mo'); }
  });
  document.addEventListener('keydown', e => {
    const b = e.target.closest && e.target.closest('button[data-tab]'); if (!b) return; const root = b.parentElement.parentElement; if (!root || !root.hasAttribute('data-tabs')) return;
    const l = tabsOf(root), n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (n) { e.preventDefault(); const x = l[(l.indexOf(b) + n + l.length) % l.length]; x.focus(); act(root, x.dataset.tab); }
  });
  document.addEventListener('toggle', e => { const d = e.target; if (d.tagName === 'DETAILS' && d.open) { const acc = d.closest('.acc[data-one]'); if (acc) $$('details', acc).forEach(o => o !== d && (o.open = false)); } }, true);

  /* forms (POST to the Node server, or S.formEndpoint) */
  const ENDPOINT = S.formEndpoint || '/api/forms';
  document.addEventListener('submit', async e => {
    const form = e.target.closest && e.target.closest('form[data-form]'); if (!form) return; e.preventDefault();
    let msg = $('.form-msg', form); if (!msg) { msg = document.createElement('p'); msg.className = 'form-msg'; msg.setAttribute('role', 'status'); (form.querySelector('[type=submit]') || form.lastElementChild).before(msg); }
    let ok = true;
    $$('[required]', form).forEach(f => { const bad = !String(f.value).trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)) || (f.type === 'checkbox' && !f.checked); f.classList.toggle('invalid', bad); if (bad) ok = false; });
    msg.className = 'form-msg';
    if (!ok) { msg.textContent = 'Please complete the highlighted fields (and use a valid email).'; msg.classList.add('err'); return; }
    const data = { type: form.dataset.form, page: curPage() }; new FormData(form).forEach((v, k) => { data[k] = v; });
    const btn = $('[type=submit]', form); btn && (btn.disabled = true);
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw 0;
      msg.textContent = form.dataset.success || 'Thank you! We received your request and will be in touch shortly.'; msg.classList.add('ok'); form.reset(); calc(form);
      const modal = form.closest('.modal'); if (modal) setTimeout(() => closeM(modal), 2200);
    } catch { msg.textContent = 'We could not reach the server. Please call ' + (S.phone || 'us') + ' or email ' + (S.email || 'us') + '.'; msg.classList.add('err'); }
    finally { btn && (btn.disabled = false); }
  });

  if (document.body.hasAttribute('data-progress')) { const bar = document.createElement('div'); bar.className = 'progress'; document.body.append(bar); const p = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }; addEventListener('scroll', p, { passive: true }); p(); }

  /* reveal + counters observer (shared) */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target); const el = en.target;
    if (el.dataset.count) { const end = +el.dataset.count, suf = el.dataset.suffix || '', pre = el.dataset.prefix || '', t0 = performance.now(); const tick = t => { const p = Math.min((t - t0) / 1500, 1); el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf; if (p < 1) requestAnimationFrame(tick); else el.classList.add('pop'); }; requestAnimationFrame(tick); }
    else el.classList.add('in');
  }), { threshold: .12 }) : null;

  /* highlight the current page in the menu */
  const setActive = () => {
    $$('.nav>ul>li.active').forEach(l => l.classList.remove('active'));
    const cur = $$('.nav a').find(a => (a.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase() === curPage());
    if (cur) { const li = cur.closest('.nav>ul>li'); li && li.classList.add('active'); }
  };

  /* =============== PER PAGE CONTENT: runs on load and after every in-place navigation =============== */
  function init(root = document) {
    timers.splice(0).forEach(clearInterval);
    $$('[data-site]', root).forEach(el => { const v = S[el.dataset.site]; if (v != null) el.textContent = Array.isArray(v) ? v.join(', ') : v; });
    $$('[data-site-href]', root).forEach(el => { const d = el.dataset.siteHref, i = d.indexOf(':'), k = d.slice(0, i), p = d.slice(i + 1); const v = String(S[k] || ''); el.href = p + (k === 'phone' ? v.replace(/[^\d+]/g, '') : v); });
    $$('[data-year]', root).forEach(el => el.textContent = new Date().getFullYear());
    setActive();

    $$('[data-media]', root).forEach(el => {
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

    $$('form[data-calc]', root).forEach(calc);
    $$('[data-tabs]', root).forEach(r => { const f = tabsOf(r)[0]; if (f) act(r, f.dataset.tab); });

    $$('[data-carousel]', root).forEach(c => {
      const sl = $$('.slide', c), dots = $('.dots', c); let i = 0, t;
      const show = n => { i = (n + sl.length) % sl.length; sl.forEach((s, k) => s.classList.toggle('on', k === i)); dots && $$('button', dots).forEach((d, k) => d.classList.toggle('on', k === i)); };
      const go = () => { clearInterval(t); if (c.dataset.auto !== 'off' && !matchMedia('(prefers-reduced-motion:reduce)').matches) { t = setInterval(() => show(i + 1), +c.dataset.auto || 5500); timers.push(t); } };
      if (dots) sl.forEach((_, k) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Slide ' + (k + 1)); b.onclick = () => { show(k); go(); }; dots.append(b); });
      $$('[data-prev]', c.parentElement).forEach(b => b.onclick = () => { show(i - 1); go(); }); $$('[data-next]', c.parentElement).forEach(b => b.onclick = () => { show(i + 1); go(); });
      c.addEventListener('mouseenter', () => clearInterval(t)); c.addEventListener('mouseleave', go); show(0); go();
    });

    $$('[data-countdown]', root).forEach(el => {
      const end = new Date(el.dataset.countdown).getTime(), set = (u, v) => { const n = $(`[data-u=${u}]`, el); if (!n) return; const t = String(v).padStart(2, '0'); if (n.textContent !== t) { n.textContent = t; n.classList.remove('flip'); void n.offsetWidth; n.classList.add('flip'); } };
      const tick = () => { const d = Math.max(0, end - Date.now()); set('d', Math.floor(d / 864e5)); set('h', Math.floor(d % 864e5 / 36e5)); set('m', Math.floor(d % 36e5 / 6e4)); set('s', Math.floor(d % 6e4 / 1e3)); };
      tick(); timers.push(setInterval(tick, 1000));
    });

    $$('.reveal', root).forEach(el => { const s = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.setProperty('--d', Math.min(s.indexOf(el), 6) * 90 + 'ms'); });
    $$('[data-count],.reveal', root).forEach(el => io ? io.observe(el) : (el.classList.add('in'), el.dataset.count && (el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || ''))));
  }

  window.SiteReinit = root => { init(root); window.FXInit && window.FXInit(root); window.PackInit && window.PackInit(root); };
  init(document);
  goHash(true);
})();
