(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // sticky header
  const header = $('#header');
  const onScroll = () => header.classList.toggle('stuck', scrollY > 80);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // mobile menu + submenus
  const burger = $('#burger'), nav = $('#mainNav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  const mobile = matchMedia('(max-width:900px)');
  $$('.has-sub > a').forEach(a => a.addEventListener('click', e => {
    if (mobile.matches && e.target.closest('.caret')) { e.preventDefault(); a.parentElement.classList.toggle('open'); }
  }));
  $$('.main-nav a').forEach(a => a.addEventListener('click', e => {
    if (e.defaultPrevented) return;
    nav.classList.remove('open'); burger.setAttribute('aria-expanded', false);
  }));

  // modals
  let lastFocus;
  const open = m => { lastFocus = document.activeElement; m.hidden = false; document.body.style.overflow = 'hidden'; $('[data-close]', m).focus(); };
  const close = m => {
    m.hidden = true; document.body.style.overflow = '';
    if (m.id === 'videoModal') $('#videoFrame').src = '';
    lastFocus && lastFocus.focus();
  };
  $$('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m || e.target.hasAttribute('data-close')) close(m); });
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal').forEach(m => !m.hidden && close(m)); });

  // video cards (replace data-video with your YouTube video ID)
  $$('[data-video]').forEach(el => el.addEventListener('click', () => {
    const m = $('#videoModal');
    $('#videoFrame').src = `https://www.youtube-nocookie.com/embed/${el.dataset.video}?autoplay=1&rel=0`;
    $('#videoFrame').title = el.dataset.title || 'Video';
    open(m);
  }));

  // quote form
  $('#openQuote').addEventListener('click', () => open($('#quoteModal')));
  const form = $('#quoteForm'), msg = $('#formMsg');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad); if (bad) ok = false;
    });
    msg.className = 'form-msg';
    if (!ok) { msg.textContent = 'Please fill in your name, a valid email and a message.'; msg.classList.add('err'); return; }
    const data = Object.fromEntries(new FormData(form));
    try {
      // Set FORM_ENDPOINT to a Formspree/Netlify/your-API URL to receive submissions by email.
      const FORM_ENDPOINT = '';
      if (FORM_ENDPOINT) {
        const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error();
      } else {
        const list = JSON.parse(localStorage.getItem('talento_quotes') || '[]');
        list.push({ ...data, at: new Date().toISOString() });
        localStorage.setItem('talento_quotes', JSON.stringify(list));
      }
      msg.textContent = 'Thank you! We will contact you shortly.'; msg.classList.add('ok'); form.reset();
      setTimeout(() => close($('#quoteModal')), 1800);
    } catch { msg.textContent = 'Something went wrong. Please try again.'; msg.classList.add('err'); }
  });
})();
