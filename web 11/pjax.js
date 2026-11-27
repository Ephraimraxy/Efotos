/* In-place navigation: clicking a menu item, sub-menu item or page link swaps only the page content
   (the <main> element). The header, footer, scripts and styles stay put – no full reload, no flash.
   Links that point to a section (page.html#section) go straight to it and open the right tab.
   window.FX.page = 'instant' | 'fade' | 'slide' | 'zoom' | 'blur'  picks the change animation.
   Falls back to a normal page load whenever anything is unusual (file://, errors, non-HTML, etc.). */
(() => {
  if (location.protocol === 'file:' || !window.fetch || !history.pushState || !window.DOMParser) return;
  const mode = (window.FX && window.FX.page) || 'fade';
  const cache = new Map();
  let currentKey = location.pathname + location.search;
  history.scrollRestoration = 'manual';

  const fetchPage = key => {
    if (!cache.has(key)) cache.set(key, fetch(key, { credentials: 'same-origin' }).then(r => { if (!r.ok || !/html/.test(r.headers.get('content-type') || '')) throw new Error('not html'); return r.text(); }).catch(e => { cache.delete(key); throw e; }));
    return cache.get(key);
  };

  async function go(href, push) {
    const u = new URL(href, location.href), key = u.pathname + u.search;
    let html;
    try { html = await fetchPage(key); } catch { location.href = href; return; }
    const doc = new DOMParser().parseFromString(html, 'text/html'), nm = doc.querySelector('main');
    if (!nm) { location.href = href; return; }
    const swap = () => {
      if (push) history.pushState({}, '', u.pathname + u.search + u.hash);
      currentKey = key;
      document.title = doc.title;
      const d1 = doc.querySelector('meta[name=description]'), d0 = document.querySelector('meta[name=description]'); if (d1 && d0) d0.content = d1.content;
      const m = document.querySelector('main'); m.innerHTML = nm.innerHTML;
      m.querySelectorAll('script').forEach(s => { const n = document.createElement('script'); [...s.attributes].forEach(a => n.setAttribute(a.name, a.value)); n.textContent = s.textContent; s.replaceWith(n); });
      window.SiteCloseMenu && window.SiteCloseMenu();
      scrollTo({ top: 0, behavior: 'instant' });
      window.SiteReinit && window.SiteReinit(m);
      if (u.hash) window.SiteGoHash && window.SiteGoHash(true);
    };
    if (document.startViewTransition && mode !== 'instant' && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
      document.documentElement.dataset.vt = mode;
      try { await document.startViewTransition(swap).updateCallbackDone; } catch { /* swap already ran or failed */ }
    } else swap();
  }

  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-nopjax')) return;
    const raw = a.getAttribute('href');
    if (/^(mailto:|tel:|#|javascript:)/.test(raw)) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !/(\.html?|\/)$/.test(u.pathname)) return;
    if (u.pathname + u.search === currentKey) return;           // same page: the browser / hash logic handles it
    e.preventDefault();
    go(u.href, true);
  });

  /* search-style GET forms (e.g. the header search) also change the page in place */
  document.addEventListener('submit', e => {
    const f = e.target;
    if (e.defaultPrevented || !f.matches || f.hasAttribute('data-form') || f.hasAttribute('data-nopjax')) return;
    if ((f.getAttribute('method') || 'get').toLowerCase() !== 'get') return;
    const act = new URL(f.getAttribute('action') || location.href, location.href);
    if (act.origin !== location.origin || !/(\.html?|\/)$/.test(act.pathname)) return;
    e.preventDefault();
    const qs = new URLSearchParams(new FormData(f)).toString(); act.search = qs ? '?' + qs : ''; act.hash = '';
    go(act.href, true);
  });

  addEventListener('popstate', () => {
    const key = location.pathname + location.search;
    if (key === currentKey) return;                             // only the #hash changed
    go(location.href, false);
  });

  /* warm the cache so the next click is instant */
  const warm = e => { const a = e.target.closest && e.target.closest('a[href]'); if (!a) return; const u = new URL(a.href, location.href); if (u.origin === location.origin && /(\.html?|\/)$/.test(u.pathname) && !/^(mailto:|tel:|#)/.test(a.getAttribute('href'))) fetchPage(u.pathname + u.search).catch(() => {}); };
  document.addEventListener('pointerover', warm); document.addEventListener('touchstart', warm, { passive: true });
})();
