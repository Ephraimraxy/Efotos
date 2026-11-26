/* Shared layout + behaviour for every page. Content lives in config.js */
(() => {
  const S = window.SITE, M = window.MEDIA, V = window.VIDEOS || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- icons ---------- */
  const ICONS = {
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    trend: '<path d="m23 6-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    award: '<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/>',
    mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="m22 6-10 7L2 6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };
  const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const LOGO = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="16" cy="7" r="4"/><circle cx="7" cy="22" r="4"/><circle cx="25" cy="22" r="4"/><path d="M14 10.5 9 18.5M18 10.5l5 8M11.5 24h9"/></svg>';

  /* ---------- header / footer ---------- */
  const SERVICES = [
    ['acquisition', 'Acquisition and Recruitment'], ['executive', 'Executive Search'],
    ['performance', 'Performance Management'], ['learning', 'Learning and Development'],
    ['consulting', 'HR Consulting'], ['planning', 'Workforce Planning']
  ];
  const NAV = [
    ['Home', 'index.html', [['Homepage', 'index.html'], ['Our Gallery', 'gallery.html']]],
    ['About', 'about.html', [['Our Story', 'about.html#story'], ['Our Team', 'about.html#team']]],
    ['Services', 'services.html', SERVICES.map(([id, t]) => [t, `services.html#${id}`])],
    ['Contact', 'contact.html', [['Get In Touch', 'contact.html'], ['Head Office', 'contact.html#office']]],
    ['Pages', 'gallery.html', [['Our Gallery', 'gallery.html'], ['Pricing', 'pricing.html'], ['FAQ', 'services.html#faq']]]
  ];
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const OWNS = { 'index.html': ['index.html', ''], 'about.html': ['about.html'], 'services.html': ['services.html'], 'contact.html': ['contact.html'], 'gallery.html': ['gallery.html', 'pricing.html'] };
  const isActive = href => (OWNS[href] || []).includes(page);
  const tel = S.phone.replace(/\s+/g, '');

  const header = $('#site-header');
  if (header) header.outerHTML = `
  <header class="site-header" id="header">
    <div class="container nav-wrap">
      <a href="index.html" class="logo" aria-label="${esc(S.name)} home">${LOGO}<span>${esc(S.name)}</span></a>
      <nav class="main-nav" id="mainNav" aria-label="Main"><ul>
        ${NAV.map(([label, href, sub]) => `<li class="has-sub${isActive(href) ? ' active' : ''}"><a href="${href}">${label} <i class="caret"></i></a>
          <ul class="sub">${sub.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></li>`).join('')}
      </ul></nav>
      <div class="nav-actions">
        <a href="tel:${tel}" class="btn btn-orange btn-sm phone">${icon('phone')}${esc(S.phone)}</a>
        <button class="burger" id="burger" aria-label="Toggle menu" aria-expanded="false" aria-controls="mainNav"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  const social = {
    facebook: '<path d="M14 8V6.5c0-.7.2-1 1.2-1H17V2h-2.700C11.500 2 10 3.700 10 6v2H7.500v3.500H10V22h4V11.500h2.800L17.300 8z" fill="currentColor" stroke="none"/>',
    twitter: '<path d="M22 5.900a8 8 0 0 1-2.300.6 4 4 0 0 0 1.800-2.200 8 8 0 0 1-2.600 1 4 4 0 0 0-6.900 3.700A11.400 11.400 0 0 1 3.800 4.800a4 4 0 0 0 1.200 5.400 4 4 0 0 1-1.800-.5 4 4 0 0 0 3.200 4 4 4 0 0 1-1.800.1 4 4 0 0 0 3.800 2.800A8 8 0 0 1 2 18.300 11.400 11.400 0 0 0 8.200 20c7.500 0 11.700-6.300 11.400-12A8 8 0 0 0 22 5.900z" fill="currentColor" stroke="none"/>',
    youtube: '<path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" fill="currentColor" stroke="none"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.500" cy="6.500" r=".6" fill="currentColor"/>'
  };
  const footer = $('#site-footer');
  if (footer) footer.outerHTML = `
  <footer class="footer" id="footer"><div class="container">
    <div class="foot-grid">
      <div><a href="index.html" class="logo">${LOGO}<span>${esc(S.name)}</span></a>
        <p class="foot-about">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p></div>
      <div><h4>Quick Links</h4><ul class="flist">
        <li><a href="index.html">Homepage</a></li><li><a href="about.html">About Us</a></li><li><a href="services.html">Our Services</a></li><li><a href="pricing.html">Our Pricing</a></li><li><a href="contact.html">Contact Us</a></li></ul></div>
      <div><h4>Our Services</h4><ul class="flist">${SERVICES.slice(0, 5).map(([id, t]) => `<li><a href="services.html#${id}">${t}</a></li>`).join('')}</ul></div>
      <div><h4>Head Office Address</h4><p class="addr">${S.address.map(esc).join('<br>')}</p>
        <h4 class="days">Days Open</h4><p class="addr">${esc(S.hours)}</p></div>
    </div>
    <div class="foot-bottom"><p>${esc(S.copyright)}</p>
      <div class="social">${Object.entries(S.social).map(([k, h]) => `<a href="${esc(h)}" aria-label="${k}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${social[k] || ''}</svg></a>`).join('')}</div>
    </div></div></footer>`;

  /* ---------- shared modals ---------- */
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal" id="videoModal" hidden><div class="modal-box video-box" role="dialog" aria-modal="true" aria-label="Video">
    <button class="modal-x" data-close aria-label="Close">×</button><div class="ratio" id="videoSlot"></div></div></div>
  <div class="modal" id="quoteModal" hidden><div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">
    <button class="modal-x" data-close aria-label="Close">×</button>
    <p class="eyebrow">Schedule A Consultation</p><h3 id="quoteTitle">Get A Quote</h3>
    ${formHTML('quote')}
  </div></div>`);

  function formHTML(type, withSubject) {
    return `<form data-form="${type}" novalidate>
      <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label>Full name<input name="name" type="text" required autocomplete="name"></label>
      <label>Email<input name="email" type="email" required autocomplete="email"></label>
      <label>Phone<input name="phone" type="tel" autocomplete="tel"></label>
      <label>Service<select name="service">${SERVICES.map(s => `<option>${s[1]}</option>`).join('')}</select></label>
      <label>Message<textarea name="message" rows="4" required></textarea></label>
      <p class="form-msg" role="status"></p>
      <button class="btn btn-orange" type="submit">Send Request <span aria-hidden="true">→</span></button></form>`;
  }
  $$('[data-form-slot]').forEach(el => el.innerHTML = formHTML(el.dataset.formSlot));
  $$('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
  $$('[data-site]').forEach(el => { const v = el.dataset.site; el.textContent = Array.isArray(S[v]) ? S[v].join(', ') : S[v]; });
  $$('[data-site-href]').forEach(el => { const d = el.dataset.siteHref, i = d.indexOf(':'), k = d.slice(0, i), p = d.slice(i + 1); el.href = p + (k === 'phone' ? tel : S[k]); });

  /* ---------- media (images from config.js) ---------- */
  const applyImg = (el, m) => {
    const probe = new Image();
    const use = src => { probe.onerror = null; probe.src = src; };
    probe.onload = () => {
      if (el.tagName === 'IMG') { el.src = probe.src; el.alt = m.alt || ''; }
      else { el.style.setProperty('--img', `url("${probe.src}")`); if (m.alt) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', m.alt); } }
      el.classList.add('has-img');
    };
    probe.onerror = () => { if (m.fallback && probe.src.indexOf(m.fallback) < 0) use(m.fallback); };
    use(m.src);
  };
  $$('[data-media]').forEach(el => {
    const m = M[el.dataset.media];
    if (!m) return console.warn('No media entry for', el.dataset.media);
    applyImg(el, m);
  });

  /* ---------- header behaviour ---------- */
  const hdr = $('#header');
  const onScroll = () => hdr.classList.toggle('stuck', scrollY > 80);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger'), nav = $('#mainNav');
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
  const mobile = matchMedia('(max-width:599px)');
  $$('.has-sub > a').forEach(a => a.addEventListener('click', e => {
    if (mobile.matches && e.target.closest('.caret')) { e.preventDefault(); a.parentElement.classList.toggle('open'); }
  }));
  $$('.main-nav a').forEach(a => a.addEventListener('click', e => {
    if (!e.defaultPrevented) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  }));

  /* ---------- modals / video player ---------- */
  let lastFocus;
  const openModal = m => { lastFocus = document.activeElement; m.hidden = false; document.body.style.overflow = 'hidden'; $('[data-close]', m).focus(); };
  const closeModal = m => { m.hidden = true; document.body.style.overflow = ''; if (m.id === 'videoModal') $('#videoSlot').innerHTML = ''; lastFocus && lastFocus.focus && lastFocus.focus(); };
  $$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m || e.target.hasAttribute('data-close')) closeModal(m); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal').forEach(m => !m.hidden && closeModal(m)); });

  function playerHTML(src, title) {
    let m;
    if ((m = src.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)))
      return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    if ((m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
      return `<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=1" title="${esc(title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(src))
      return `<video src="${esc(src)}" controls autoplay playsinline></video>`;
    return `<iframe src="${esc(src)}" title="${esc(title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }
  $$('[data-video]').forEach(el => el.addEventListener('click', () => {
    const v = V[el.dataset.video];
    if (!v) return console.warn('No video entry for', el.dataset.video);
    $('#videoSlot').innerHTML = playerHTML(v.src, v.title || 'Video');
    openModal($('#videoModal'));
  }));
  $$('[data-open-quote]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openModal($('#quoteModal')); }));
  if (location.hash === '#quote') openModal($('#quoteModal'));

  /* ---------- forms ---------- */
  const ENDPOINT = S.formEndpoint || '/api/forms';
  $$('form[data-form]').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = $('.form-msg', form), btn = $('button[type=submit]', form);
    let ok = true;
    $$('[required]', form).forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad); if (bad) ok = false;
    });
    msg.className = 'form-msg';
    if (!ok) { msg.textContent = 'Please fill in your name, a valid email and a message.'; msg.classList.add('err'); return; }
    const data = { type: form.dataset.form, page, ...Object.fromEntries(new FormData(form)) };
    btn.disabled = true;
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(r.status);
      msg.textContent = 'Thank you! Your request was sent – we will contact you shortly.'; msg.classList.add('ok'); form.reset();
      const modal = form.closest('.modal'); if (modal) setTimeout(() => closeModal(modal), 2000);
    } catch {
      // No server reachable (e.g. static hosting without an endpoint): keep a local copy and be honest about it.
      try { const l = JSON.parse(localStorage.getItem('talento_pending') || '[]'); l.push({ ...data, at: new Date().toISOString() }); localStorage.setItem('talento_pending', JSON.stringify(l)); } catch {}
      msg.textContent = 'We could not reach the server. Please call ' + S.phone + ' or email ' + S.email + '.'; msg.classList.add('err');
    } finally { btn.disabled = false; }
  }));

  /* ---------- tabs (with deep links such as services.html#executive) ---------- */
  const tabsOf = r => $$(':scope > [role=tablist] > button', r);
  const panelsOf = r => $$(':scope > [data-panel]', r);
  const activate = (root, id) => {
    tabsOf(root).forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    panelsOf(root).forEach(p => p.classList.toggle('on', p.id === id));
  };
  $$('[data-tabs]').forEach(root => {
    const first = tabsOf(root)[0]; if (first) activate(root, first.dataset.tab);
    root.addEventListener('click', e => { const b = e.target.closest('button[data-tab]'); if (b && b.parentElement.parentElement === root) activate(root, b.dataset.tab); });
    root.addEventListener('keydown', e => {
      const b = e.target.closest('button[data-tab]'); if (!b || b.parentElement.parentElement !== root) return;
      const list = tabsOf(root), i = list.indexOf(b), n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (n) { e.preventDefault(); const t = list[(i + n + list.length) % list.length]; t.focus(); activate(root, t.dataset.tab); }
    });
  });
  const openHash = () => {
    const el = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!el) return;
    const chain = []; let p = el.closest('[data-panel]');
    while (p) { chain.unshift(p); p = p.parentElement.closest('[data-panel]'); }
    chain.forEach(pp => activate(pp.parentElement, pp.id));
    if (chain.length) { const top = chain[0].parentElement.getBoundingClientRect().top + scrollY - 90; scrollTo({ top: Math.max(top, 0), behavior: 'smooth' }); }
  };
  addEventListener('hashchange', openHash); openHash();

  /* ---------- testimonial carousel ---------- */
  $$('[data-carousel]').forEach(c => {
    const slides = $$('.slide', c), dots = $('.dots', c); let i = 0, timer;
    const show = n => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle('on', k === i)); $$('button', dots).forEach((d, k) => d.classList.toggle('on', k === i)); };
    const start = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion:reduce)').matches) timer = setInterval(() => show(i + 1), 5500); };
    slides.forEach((_, k) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Show testimonial ' + (k + 1)); b.onclick = () => { show(k); start(); }; dots.append(b); });
    c.addEventListener('mouseenter', () => clearInterval(timer)); c.addEventListener('mouseleave', start);
    show(0); start();
  });

  /* ---------- scroll progress bar + page transitions ---------- */
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.append(bar);
  const prog = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
  addEventListener('scroll', prog, { passive: true }); prog();
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('data-open-quote')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname || /^(mailto|tel):/.test(a.getAttribute('href'))) return;
    e.preventDefault(); document.body.classList.add('leaving'); setTimeout(() => { location.href = u.href; }, 220);
  });
  addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leaving'); });

  /* ---------- staggered reveal delays ---------- */
  $$('.reveal').forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 5) * 90 + 'ms');
  });

  /* ---------- counters, reveal, pricing toggle ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target;
    if (el.dataset.count) {
      const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
      const tick = t => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); else el.classList.add('pop'); };
      requestAnimationFrame(tick);
    } else el.classList.add('in');
  }), { threshold: .15 }) : null;
  $$('[data-count],.reveal').forEach(el => io ? io.observe(el) : (el.classList.add('in'), el.dataset.count && (el.textContent = el.dataset.count + (el.dataset.suffix || ''))));

  const toggle = $('[data-billing]');
  if (toggle) toggle.addEventListener('click', e => {
    const b = e.target.closest('button[data-mode]'); if (!b) return;
    $$('button', toggle).forEach(x => x.classList.toggle('on', x === b));
    $$('[data-month]').forEach(el => el.textContent = '$' + el.dataset[b.dataset.mode === 'year' ? 'year' : 'month']);
    $$('[data-per]').forEach(el => el.textContent = b.dataset.mode === 'year' ? '/ month, billed yearly' : '/ month');
  });
})();
