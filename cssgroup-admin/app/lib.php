<?php
declare(strict_types=1);
/* Core helpers for the CSS Group admin panel. No database: everything is stored as JSON files in /data. */

define('APP_DIR', __DIR__);
define('DATA_DIR', dirname(__DIR__) . '/data');
$GLOBALS['CFG'] = require __DIR__ . '/config.php';
date_default_timezone_set((string)cfg('timezone', 'Africa/Lagos'));

function cfg(string $k, $d = null) { return $GLOBALS['CFG'][$k] ?? $d; }
function h($s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function site_root(): string { return rtrim((string)cfg('site_root'), '/'); }
function is_https(): bool { return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'); }
function client_ip(): string { return $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'; }

/* ---------- JSON storage (atomic writes) ---------- */
function jread(string $f, $d = []) { if (!is_file($f)) return $d; $x = json_decode((string)file_get_contents($f), true); return $x === null ? $d : $x; }
function jwrite(string $f, $data): bool {
    $dir = dirname($f); if (!is_dir($dir)) @mkdir($dir, 0750, true);
    $tmp = $f . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX) === false) return false;
    return rename($tmp, $f);
}
function write_site_file(string $rel, string $content): bool { /* atomic write into the public website folder */
    $path = site_root() . '/' . ltrim($rel, '/'); $dir = dirname($path);
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) return false;
    $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $content, LOCK_EX) === false) return false;
    @chmod($tmp, 0644);
    return rename($tmp, $path);
}

/* ---------- session, CSRF, flash ---------- */
function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('cssadm');
    ini_set('session.use_strict_mode', '1'); ini_set('session.use_only_cookies', '1');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => is_https(), 'httponly' => true, 'samesite' => 'Strict']);
    $dir = DATA_DIR . '/sessions'; if (!is_dir($dir)) @mkdir($dir, 0750, true); if (is_dir($dir) && is_writable($dir)) session_save_path($dir);
    session_start();
    if (isset($_SESSION['last']) && time() - $_SESSION['last'] > (int)cfg('idle_minutes', 60) * 60) { $_SESSION = []; }
    $_SESSION['last'] = time();
}
function csrf(): string { if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(24)); return $_SESSION['csrf']; }
function csrf_field(): string { return '<input type="hidden" name="_t" value="' . h(csrf()) . '">'; }
function csrf_check(): void { $t = $_POST['_t'] ?? ''; if (!is_string($t) || !hash_equals(csrf(), $t)) { http_response_code(400); exit('Security check failed. Go back, refresh the page and try again.'); } }
function flash(string $msg, string $type = 'ok'): void { $_SESSION['flash'][] = [$type, $msg]; }
function take_flash(): array { $f = $_SESSION['flash'] ?? []; unset($_SESSION['flash']); return $f; }
function redirect(string $to): void { header('Location: ' . $to); exit; }

/* ---------- rate limiting ---------- */
function rl_count(string $key, int $window): int { $d = jread(DATA_DIR . '/ratelimit.json', []); $now = time(); $a = array_values(array_filter($d[$key] ?? [], fn($t) => $now - $t < $window)); return count($a); }
function rl_hit(string $key, int $window): void { $f = DATA_DIR . '/ratelimit.json'; $d = jread($f, []); $now = time(); foreach ($d as $k => $v) { $d[$k] = array_values(array_filter($v, fn($t) => $now - $t < 3600)); if (!$d[$k]) unset($d[$k]); } $d[$key][] = $now; jwrite($f, $d); }
function rl_clear(string $key): void { $f = DATA_DIR . '/ratelimit.json'; $d = jread($f, []); unset($d[$key]); jwrite($f, $d); }

/* ---------- audit log ---------- */
function audit(string $what): void {
    $u = $_SESSION['user']['username'] ?? '-';
    $line = json_encode(['t' => date('c'), 'u' => $u, 'ip' => client_ip(), 'a' => $what], JSON_UNESCAPED_UNICODE) . "\n";
    @file_put_contents(DATA_DIR . '/audit.log', $line, FILE_APPEND | LOCK_EX);
}

/* ---------- users & authentication ---------- */
function users(): array { return jread(DATA_DIR . '/users.json', []); }
function save_users(array $u): void { jwrite(DATA_DIR . '/users.json', array_values($u)); }
function find_user(string $name): ?array { foreach (users() as $u) if (strcasecmp($u['username'], $name) === 0) return $u; return null; }
function current_user(): ?array { return $_SESSION['user'] ?? null; }
function require_login(): array { $u = current_user(); if (!$u) redirect('?page=login'); return $u; }
function require_owner(): array { $u = require_login(); if (($u['role'] ?? '') !== 'owner') { http_response_code(403); exit('Only the owner can do this.'); } return $u; }
function password_ok(string $p): bool { return strlen($p) >= 12; }

/* ---------- TOTP (Google Authenticator compatible) ---------- */
function b32_encode(string $bin): string { $a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; $bits = ''; foreach (str_split($bin) as $c) $bits .= str_pad(decbin(ord($c)), 8, '0', STR_PAD_LEFT); $out = ''; foreach (str_split($bits, 5) as $ch) $out .= $a[bindec(str_pad($ch, 5, '0'))]; return $out; }
function b32_decode(string $s): string { $a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; $bits = ''; foreach (str_split(strtoupper(preg_replace('/[^A-Z2-7]/i', '', $s))) as $c) $bits .= str_pad(decbin(strpos($a, $c)), 5, '0', STR_PAD_LEFT); $out = ''; foreach (str_split($bits, 8) as $b) if (strlen($b) === 8) $out .= chr(bindec($b)); return $out; }
function totp_code(string $secret, int $t): string { $c = pack('N*', 0, intdiv($t, 30)); $h = hash_hmac('sha1', $c, b32_decode($secret), true); $o = ord($h[19]) & 15; $n = ((ord($h[$o]) & 0x7f) << 24) | (ord($h[$o + 1]) << 16) | (ord($h[$o + 2]) << 8) | ord($h[$o + 3]); return str_pad((string)($n % 1000000), 6, '0', STR_PAD_LEFT); }
function totp_ok(string $secret, string $code): bool { $code = preg_replace('/\D/', '', $code); $now = time(); foreach ([-30, 0, 30] as $d) if (hash_equals(totp_code($secret, $now + $d), $code)) return true; return false; }

/* ---------- website data model ---------- */
function site_file(): string { return DATA_DIR . '/site.json'; }
function site(): array { return jread(site_file(), []); }
function js(string $s): string { return json_encode($s, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP); }

function build_config_js(array $s): string {
    $c = $s['contact'] ?? []; $o = $c['offices'] ?? [];
    $SITE = [
        'name' => $s['company']['name'] ?? '', 'phone' => $c['phone'] ?? '', 'email' => $c['email'] ?? '',
        'address' => $o[0]['address'] ?? '', 'office1' => $o[0]['label'] ?? '', 'address1' => $o[0]['address'] ?? '',
        'office2' => $o[1]['label'] ?? '', 'address2' => $o[1]['address'] ?? '',
        'hours' => $c['hours'] ?? '', 'closed' => $c['closed'] ?? '', 'formEndpoint' => 'forms.php',
        'banner' => ['on' => !empty($s['banner']['on']), 'text' => $s['banner']['text'] ?? '', 'link' => $s['banner']['link'] ?? ''],
    ];
    $MEDIA = []; foreach (($s['media'] ?? []) as $k => $m) $MEDIA[$k] = ['src' => $m['src'], 'alt' => $m['alt'] ?? '', 'pos' => $m['pos'] ?? 'center'];
    $VIDEOS = []; foreach (($s['videos'] ?? []) as $k => $v) $VIDEOS[$k] = ['src' => $v['src'], 'title' => $v['title'] ?? ''];
    $NEWS = news_public($s, $MEDIA, $VIDEOS);
    $TEXT = []; foreach (($s['text'] ?? []) as $k => $t) if (isset($t['value']) && $t['value'] !== null && $t['value'] !== '') $TEXT[$k] = $t['value'];
    $flags = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP;
    $out = "/* AUTO-GENERATED by the CSS Group admin panel (" . date('Y-m-d H:i') . "). Do not edit by hand: changes are overwritten. */\n";
    $out .= 'window.SITE = ' . json_encode($SITE, $flags) . ";\n";
    $out .= 'window.FX = ' . json_encode($s['fx'] ?? new stdClass, $flags) . ";\n";
    $out .= 'window.MEDIA = ' . json_encode($MEDIA ?: new stdClass, $flags) . ";\n";
    $out .= 'window.VIDEOS = ' . json_encode($VIDEOS ?: new stdClass, $flags) . ";\n";
    $out .= 'window.SERVICES = ' . json_encode(services_public($s), $flags) . ";\n";
    $out .= 'window.GALLERY = ' . json_encode(gallery_public($s), $flags) . ";\n";
    $out .= 'window.NEWS = ' . json_encode($NEWS, $flags) . ";\n";
    $out .= 'window.SITE_TEXT = ' . json_encode($TEXT ?: new stdClass, $flags) . ";\n";
    $out .= <<<'JS'
/* applies admin-edited texts and the announcement banner (runs on every page, also after in-page navigation) */
(function () {
  var busy = false;
  function apply() {
    busy = false;
    var T = window.SITE_TEXT || {};
    document.querySelectorAll('[data-edit]').forEach(function (el) { var v = T[el.getAttribute('data-edit')]; if (typeof v === 'string' && el.textContent !== v) el.textContent = v; });
    var b = (window.SITE || {}).banner, ex = document.getElementById('site-banner');
    if (b && b.on && b.text) {
      if (!ex) { ex = document.createElement('div'); ex.id = 'site-banner'; ex.setAttribute('role', 'status'); ex.style.cssText = 'background:#f5c518;color:#10301c;text-align:center;padding:9px 14px;font:600 14px/1.4 system-ui,sans-serif;position:relative;z-index:100'; document.body.insertBefore(ex, document.body.firstChild); }
      var key = b.text + '|' + (b.link || '');
      if (ex.getAttribute('data-k') !== key) { ex.setAttribute('data-k', key); ex.textContent = ''; var n = document.createElement(b.link ? 'a' : 'span'); if (b.link) { n.href = b.link; n.style.cssText = 'color:inherit;text-decoration:underline'; } n.textContent = b.text; ex.appendChild(n); }
    } else if (ex) { ex.remove(); }
  }
  function sched() { if (!busy) { busy = true; requestAnimationFrame(apply); } }
  document.addEventListener('DOMContentLoaded', sched);
  new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
})();

/* services: each service card / page photo can hold several photos that change by themselves */
(function () {
  var busy = false;
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function build(box, list, secs, idx) {
    box.textContent = ''; var items = [], cur = 0, dots = el('div', 'gd gd-s');
    list.forEach(function (src, i) { var p = el('div', 'gs-i' + (i === 0 ? ' on' : '')); p.style.setProperty('--img', 'url("' + String(src).replace(/"/g, '%22') + '")'); box.appendChild(p); items.push(p); var d = el('span', 'gdot' + (i === 0 ? ' on' : '')); dots.appendChild(d); });
    box.classList.add('has-s'); if (items.length < 2) return; box.appendChild(dots);
    function go(i) { items[cur].classList.remove('on'); dots.children[cur].classList.remove('on'); cur = (i + items.length) % items.length; items[cur].classList.add('on'); dots.children[cur].classList.add('on'); }
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    setTimeout(function () { var t = setInterval(function () { if (!box.isConnected) { clearInterval(t); return; } go(cur + 1); }, secs * 1000); }, 400 + idx * 700);
  }
  function render() {
    busy = false; var S = window.SERVICES || { items: {} };
    document.querySelectorAll('[data-svc]').forEach(function (b, i) {
      var list = (S.items || {})[b.getAttribute('data-svc')] || [], key = JSON.stringify(list) + '|' + S.interval; if (!list.length || b.getAttribute('data-k') === key) return; b.setAttribute('data-k', key); build(b, list, Math.max(2, +S.interval || 4), i);
    });
  }
  function sched() { if (!busy) { busy = true; requestAnimationFrame(render); } }
  document.addEventListener('DOMContentLoaded', sched); new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
})();

/* gallery: auto-rotating photo cards (edited in the admin panel > Gallery sliders) */
(function () {
  var busy = false, timers = [];
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function build(card, secs, idx) {
    var wrap = el('div', 'pjc gcard'), stack = el('div', 'gs'), cap = el('div', 'cap'), t = el('span'), sub = el('small'), dots = el('div', 'gd'), cur = 0, slides = card.slides || [], items = [];
    slides.forEach(function (s, i) { var p = el('div', 'ph gs-i' + (i === 0 ? ' on' : '')); p.style.setProperty('--img', 'url("' + String(s.src).replace(/"/g, '%22') + '")'); stack.appendChild(p); items.push(p); var d = el('button', 'gdot' + (i === 0 ? ' on' : '')); d.type = 'button'; d.setAttribute('aria-label', 'Photo ' + (i + 1)); d.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(i); reset(); }); dots.appendChild(d); });
    cap.appendChild(t); cap.appendChild(sub); wrap.appendChild(stack); wrap.appendChild(cap);
    function caption(i) { var s = slides[i] || {}; t.textContent = s.title || ''; sub.textContent = s.sub || ''; cap.style.visibility = (s.title || s.sub) ? 'visible' : 'hidden'; }
    function go(i) { items[cur].classList.remove('on'); dots.children[cur].classList.remove('on'); cur = (i + items.length) % items.length; items[cur].classList.add('on'); dots.children[cur].classList.add('on'); caption(cur); }
    var tm = null; function reset() { if (tm) clearInterval(tm); tm = null; if (items.length > 1 && !matchMedia('(prefers-reduced-motion:reduce)').matches) { tm = setInterval(function () { if (!wrap.isConnected) { clearInterval(tm); return; } if (!wrap.matches(':hover')) go(cur + 1); }, secs * 1000); timers.push(tm); } }
    if (items.length > 1) {
      var prev = el('button', 'gnav gprev', '‹'), next = el('button', 'gnav gnext', '›'); prev.type = next.type = 'button'; prev.setAttribute('aria-label', 'Previous photo'); next.setAttribute('aria-label', 'Next photo');
      prev.addEventListener('click', function (e) { e.preventDefault(); go(cur - 1); reset(); }); next.addEventListener('click', function (e) { e.preventDefault(); go(cur + 1); reset(); });
      wrap.appendChild(prev); wrap.appendChild(next); wrap.appendChild(dots);
      var x0 = null; wrap.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true }); wrap.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); reset(); } x0 = null; });
    }
    caption(0); setTimeout(reset, idx * 900); return wrap;
  }
  function render() {
    busy = false; var G = window.GALLERY || { cards: [] };
    document.querySelectorAll('[data-gallery-title]').forEach(function (h) { if (G.title && h.textContent !== G.title) h.textContent = G.title; });
    document.querySelectorAll('[data-gallery]').forEach(function (c) {
      var key = JSON.stringify(G).length + '|' + G.interval; if (c.getAttribute('data-k') === key && c.childNodes.length) return; c.setAttribute('data-k', key); c.textContent = '';
      (G.cards || []).forEach(function (card, i) { if (card.slides && card.slides.length) c.appendChild(build(card, Math.max(2, +G.interval || 5), i)); });
    });
  }
  function sched() { if (!busy) { busy = true; requestAnimationFrame(render); } }
  document.addEventListener('DOMContentLoaded', sched); new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
})();

/* news: renders the latest-news cards, the news list and a single article from window.NEWS (edited in the admin panel) */
(function () {
  var busy = false;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function ph(src, cls) { var d = el('div', 'ph' + (cls ? ' ' + cls : '')); if (src) d.style.setProperty('--img', 'url("' + String(src).replace(/"/g, '%22') + '")'); return d; }
  function fmt(d) { var t = new Date(d + 'T00:00:00'); return isNaN(t) ? d : t.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }); }
  function card(n) {
    var a = el('a', 'nw'); a.href = 'article.html?a=' + encodeURIComponent(n.slug); a.appendChild(ph(n.cover));
    var b = el('div'); b.appendChild(el('small', null, fmt(n.date))); b.appendChild(el('h3', null, n.title)); if (n.summary) { var p = el('p', null, n.summary); p.style.cssText = 'font-size:13px;color:var(--muted);margin-top:6px;line-height:1.6'; b.appendChild(p); } a.appendChild(b); return a;
  }
  function body(box, text) {
    String(text || '').replace(/\r/g, '').split(/\n{2,}/).forEach(function (blk) {
      blk = blk.trim(); if (!blk) return;
      if (blk.indexOf('## ') === 0) { var h = el('h3', null, blk.slice(3).trim()); h.style.cssText = 'font-size:20px;margin:26px 0 8px'; box.appendChild(h); return; }
      var p = el('p'); p.style.cssText = 'font-size:15px;line-height:1.85;color:var(--ink);margin:0 0 16px;max-width:760px';
      blk.split('\n').forEach(function (line, i) { if (i) p.appendChild(document.createElement('br')); p.appendChild(document.createTextNode(line)); }); box.appendChild(p);
    });
  }
  function render() {
    busy = false; var N = window.NEWS || [];
    document.querySelectorAll('[data-news]').forEach(function (c) {
      var mode = c.getAttribute('data-news'), key = mode + '|' + (mode === 'article' ? location.search : '') + '|' + JSON.stringify(N).length + '|' + (c.getAttribute('data-n') || '');
      if (c.getAttribute('data-k') === key && c.childNodes.length) return; c.setAttribute('data-k', key); c.textContent = '';
      if (mode === 'latest' || mode === 'list') {
        var list = mode === 'latest' ? N.slice(0, parseInt(c.getAttribute('data-n') || '3', 10)) : N;
        if (!list.length) { c.appendChild(el('p', null, 'No news yet. Please check back soon.')); return; }
        list.forEach(function (n) { c.appendChild(card(n)); });
      } else if (mode === 'article') {
        var slug = new URLSearchParams(location.search).get('a'), n = null; N.forEach(function (x) { if (x.slug === slug) n = x; });
        var h1 = document.querySelector('[data-news-title]'), meta = document.querySelector('[data-news-meta]');
        if (!n) { if (h1) h1.textContent = 'News'; if (meta) meta.textContent = ''; c.appendChild(el('p', null, 'This article was not found. ')); var back = el('a', 'btn', 'All news'); back.href = 'news.html'; c.appendChild(back); return; }
        if (h1) h1.textContent = n.title; if (meta) meta.textContent = fmt(n.date) + ' · CSS Group News'; document.title = n.title + ' – ' + ((window.SITE || {}).name || 'CSS Group');
        if (n.cover) { var cv = ph(n.cover); cv.style.cssText = 'height:min(420px,52vw);border-radius:14px;margin-bottom:24px'; if (n.coverKey) { cv.setAttribute('data-zoom', n.coverKey); } c.appendChild(cv); }
        body(c, n.body);
        if (n.videoKey) { var vb = el('button', 'btn', '▶ Watch video'); vb.type = 'button'; vb.setAttribute('data-video', n.videoKey); vb.style.marginBottom = '20px'; c.appendChild(vb); }
        if (n.gallery && n.gallery.length) { var g = el('div', 'gal'); g.style.cssText = 'grid-template-columns:repeat(3,minmax(0,1fr));margin-top:20px'; n.gallery.forEach(function (it) { var t = ph(it.src, 'zoom'); t.setAttribute('data-zoom', it.key); g.appendChild(t); }); c.appendChild(g); }
        var all = el('a', 'btn', '← All news'); all.href = 'news.html'; all.style.marginTop = '20px'; c.appendChild(all);
      }
    });
  }
  function sched() { if (!busy) { busy = true; requestAnimationFrame(render); } }
  document.addEventListener('DOMContentLoaded', sched);
  new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', sched);
})();
JS;
    return $out . "\n";
}

function save_site(array $s, string $note): bool {
    $old = site_file();
    if (is_file($old)) { $dir = DATA_DIR . '/history'; if (!is_dir($dir)) @mkdir($dir, 0750, true); @copy($old, $dir . '/site-' . date('Ymd-His') . '-' . bin2hex(random_bytes(2)) . '.json'); $all = glob($dir . '/site-*.json') ?: []; sort($all); while (count($all) > 40) @unlink(array_shift($all)); }
    $s['updated'] = date('c'); $s['updated_by'] = $_SESSION['user']['username'] ?? '-';
    if (!jwrite(site_file(), $s)) return false;
    if (!write_site_file('config.js', build_config_js($s))) return false;
    audit($note);
    return true;
}

/* ---------- maintenance mode ---------- */
function maintenance_html(array $m, string $company): string {
    $title = h($m['title'] ?? 'We will be back soon'); $msg = nl2br(h($m['message'] ?? '')); $until = h($m['until'] ?? ''); $mail = h($m['email'] ?? '');
    $extra = ($until ? "<p class=\"u\">Expected back: <b>$until</b></p>" : '') . ($mail ? "<p class=\"u\">Need us now? <a href=\"mailto:$mail\">$mail</a></p>" : '');
    return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex\"><title>" . h($company) . " – $title</title><link rel=\"icon\" href=\"/favicon.ico\" sizes=\"any\"><link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicon-32x32.png\"><link rel=\"apple-touch-icon\" href=\"/apple-touch-icon.png\"><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:linear-gradient(135deg,#0a3d1b,#10a24a);font:16px/1.6 system-ui,Segoe UI,Roboto,sans-serif;color:#fff;text-align:center;padding:24px}.c{max-width:560px}.l{height:84px;width:auto;background:#fff;border-radius:16px;padding:10px 16px;margin:0 auto 22px;display:block}h1{font-size:clamp(28px,5vw,44px);margin:0 0 12px;line-height:1.15}p{margin:0 0 10px;opacity:.92}.u{font-size:14px}a{color:#ffd24a}</style></head><body><div class=\"c\"><img class=\"l\" src=\"/images/css-logo.png\" alt=\"\"><h1>$title</h1><p>$msg</p>$extra</div></body></html>";
}
function apply_maintenance(array $m, string $company): bool {
    if (!empty($m['on'])) { return write_site_file('maintenance.html', maintenance_html($m, $company)) && write_site_file('maintenance.flag', date('c') . "\n"); }
    $f = site_root() . '/maintenance.flag'; return !is_file($f) || @unlink($f);
}
// ===== Websites: several versions side by side, one of them live =====
// Every website lives in <root_dir>/_sites/<id>/. The OLD site (WordPress) stays in <root_dir> and is shown when no site is chosen.
// The choice is written into a managed block at the top of <root_dir>/.htaccess (the visitor-facing rules).
function root_dir(): string { $r = (string)cfg('root_dir', ''); return rtrim($r !== '' ? $r : dirname(dirname(site_root())), '/'); }
function sites_dir(): string { return root_dir() . '/_sites'; }
function managed_id(): string { return basename(site_root()); }          // the site this admin edits (photos, texts, news...)
function valid_site_id(string $id): bool { return (bool)preg_match('/^[a-z0-9][a-z0-9_-]{1,40}$/', $id); }
function sites_reg(): array { $r = jread(DATA_DIR . '/sites.json', []); $r['sites'] = is_array($r['sites'] ?? null) ? $r['sites'] : []; $r['live'] = isset($r['live']) && is_string($r['live']) ? $r['live'] : null; return $r; }
function sites_save(array $r): bool { return jwrite(DATA_DIR . '/sites.json', $r); }
function site_label(string $id): string { $r = sites_reg(); return (string)($r['sites'][$id]['label'] ?? ($id === managed_id() ? 'New CSS Group website' : $id)); }
function live_id(): ?string { $l = sites_reg()['live']; return ($l && valid_site_id($l) && is_dir(sites_dir() . '/' . $l)) ? $l : null; }
function switch_is_live(): bool { return live_id() !== null; }
function site_has_index(string $id): bool { $d = sites_dir() . '/' . $id; return is_file("$d/index.html") || is_file("$d/index.php") || is_file("$d/index.htm"); }
/** All folders under _sites with their state. */
function sites_all(): array {
    $reg = sites_reg(); $out = []; $live = live_id();
    foreach ((array)@scandir(sites_dir()) as $n) {
        if (!is_string($n) || $n === '' || $n[0] === '.' || !is_dir(sites_dir() . '/' . $n) || is_link(sites_dir() . '/' . $n)) continue;
        $out[] = ['id' => $n, 'label' => (string)($reg['sites'][$n]['label'] ?? ($n === managed_id() ? 'New CSS Group website' : $n)), 'registered' => isset($reg['sites'][$n]) || $n === managed_id(), 'live' => $n === $live, 'editable' => $n === managed_id(), 'index' => site_has_index($n), 'created' => (string)($reg['sites'][$n]['created'] ?? '')];
    }
    usort($out, fn($a, $b) => [!$a['editable'], $a['label']] <=> [!$b['editable'], $b['label']]); return $out;
}
function gate_block(): string {
    $t = (string)cfg('preview_token');
    return "# BEGIN CSSGROUP-GATE (managed by the admin panel)\n<IfModule mod_rewrite.c>\nRewriteEngine On\n# Opening /_sites/... directly is only for you (\"Preview\" in the admin)\nRewriteCond %{THE_REQUEST} \\s/+_sites/\nRewriteCond %{HTTP_COOKIE} !css_preview=$t\nRewriteRule ^ - [F]\n</IfModule>\n# END CSSGROUP-GATE\n";
}
function site_gate_install(string $id): bool {
    $f = sites_dir() . '/' . $id . '/.htaccess'; $cur = is_file($f) ? (string)file_get_contents($f) : '';
    $cur = preg_replace('/# BEGIN CSSGROUP-GATE.*?# END CSSGROUP-GATE\R?\n?/s', '', $cur);
    if ($id === managed_id()) return true; // the managed site ships its own gate in its .htaccess
    return @file_put_contents($f, gate_block() . "\n" . ltrim($cur), LOCK_EX) !== false;
}
function switch_block(?string $live): string {
    $t = (string)cfg('preview_token'); $h = '^(www\.)?cssgroup\.com\.ng$'; $wp = '!^/(wp-admin|wp-login\.php|wp-includes|wp-content|wp-json|xmlrpc\.php)';
    $b = "# BEGIN CSSGROUP-SWITCH (managed by the admin panel - do not edit this block)\n<IfModule mod_rewrite.c>\nRewriteEngine On\n"
       . "# HTTPS for the main domain\nRewriteCond %{HTTP_HOST} $h [NC]\nRewriteCond %{HTTPS} off\nRewriteCond %{HTTP:X-Forwarded-Proto} !https\nRewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n"
       . "# Preview: you only (cookie set by the admin) see the website you chose\nRewriteCond %{HTTP_HOST} $h [NC]\nRewriteCond %{HTTP_COOKIE} css_preview=$t\nRewriteCond %{HTTP_COOKIE} !css_site=_old\nRewriteCond %{HTTP_COOKIE} css_site=([a-z0-9_-]+)\nRewriteCond %{REQUEST_URI} $wp\nRewriteRule ^(?!_sites/)(.*)$ _sites/%1/$1 [L]\n";
    if ($live !== null && valid_site_id($live)) $b .= "# LIVE website for everyone: $live\nRewriteCond %{HTTP_HOST} $h [NC]\nRewriteCond %{HTTP_COOKIE} !css_site=_old\nRewriteCond %{REQUEST_URI} $wp\nRewriteRule ^(?!_sites/)(.*)$ _sites/$live/$1 [L]\n";
    else $b .= "# No website chosen: visitors see the OLD site\n";
    return $b . "</IfModule>\n# END CSSGROUP-SWITCH\n";
}
function switch_rules_present(): bool { $f = root_dir() . '/.htaccess'; $c = is_file($f) ? (string)file_get_contents($f) : ''; return str_contains($c, 'BEGIN CSSGROUP-SWITCH') && str_contains($c, (string)cfg('preview_token')); }
/** Writes the visitor rules for the given live site (null = old site). Keeps all other lines, one-time backup, atomic. */
function switch_install(?string $live = null): bool {
    $live = func_num_args() ? $live : sites_reg()['live'];
    $f = root_dir() . '/.htaccess'; $cur = is_file($f) ? (string)file_get_contents($f) : '';
    if ($cur !== '' && !is_file($f . '.before-css-switch')) @copy($f, $f . '.before-css-switch');
    $cur = preg_replace('/# BEGIN CSSGROUP-SWITCH.*?# END CSSGROUP-SWITCH\R?\n?/s', '', $cur);
    $tmp = $f . '.tmp' . getmypid();
    if (@file_put_contents($tmp, switch_block($live) . "\n" . ltrim($cur), LOCK_EX) === false) return false; @chmod($tmp, 0644); return @rename($tmp, $f);
}
function switch_remove(): bool { $f = root_dir() . '/.htaccess'; if (!is_file($f)) return true; return @file_put_contents($f, preg_replace('/# BEGIN CSSGROUP-SWITCH.*?# END CSSGROUP-SWITCH\R?\n?/s', '', (string)file_get_contents($f)), LOCK_EX) !== false; }
/** Make a site live for everyone (null = back to the old site). */
function site_set_live(?string $id): bool {
    if ($id !== null && (!valid_site_id($id) || !is_dir(sites_dir() . '/' . $id) || !site_has_index($id))) return false;
    if (!switch_install($id)) return false;
    $r = sites_reg(); $r['live'] = $id; return sites_save($r);
}
function site_register(string $id, string $label): bool {
    if (!valid_site_id($id) || !is_dir(sites_dir() . '/' . $id)) return false; if (!site_gate_install($id)) return false;
    $r = sites_reg(); $r['sites'][$id] = ['label' => $label !== '' ? mb_substr($label, 0, 60) : $id, 'created' => $r['sites'][$id]['created'] ?? date('c')]; return sites_save($r);
}
function rrmdir(string $d): void { if (!is_dir($d) || is_link($d)) { @unlink($d); return; } foreach ((array)scandir($d) as $n) { if ($n === '.' || $n === '..') continue; rrmdir($d . '/' . $n); } @rmdir($d); }
function site_delete(string $id): bool {
    if (!valid_site_id($id) || $id === managed_id() || $id === live_id() || !is_dir(sites_dir() . '/' . $id)) return false;
    rrmdir(sites_dir() . '/' . $id); rrmdir(sites_dir() . '/.backup-' . $id); $r = sites_reg(); unset($r['sites'][$id]); return sites_save($r);
}
/** Unpack a zip into _sites/<id> (new site, or replace an existing one - the previous files are kept in _sites/.backup-<id>). Returns an error text or '' on success. */
function site_from_zip(string $id, string $label, string $zipPath, bool $replace): string {
    if (!valid_site_id($id)) return 'Use a short name with letters, numbers, - or _ (2-40 characters).';
    if (!class_exists('ZipArchive')) return 'This server has no zip support (enable "zip" in cPanel > Select PHP Version > Extensions), or upload the files with File Manager into the _sites folder.';
    $dest = sites_dir() . '/' . $id; $exists = is_dir($dest);
    if ($exists && !$replace) return 'A website with this name already exists. Pick another name or use "Replace files" on it.';
    if (!$exists && $replace) return 'Website not found.'; if ($id === managed_id()) return 'This is the website you edit in this admin. Its files are managed here; update it by uploading the package with File Manager.';
    $z = new ZipArchive; if ($z->open($zipPath) !== true) return 'That file is not a valid zip.';
    $n = $z->numFiles; if ($n < 1 || $n > 30000) { $z->close(); return 'The zip is empty or has too many files.'; }
    $names = []; $total = 0; for ($i = 0; $i < $n; $i++) { $st = $z->statIndex($i); $nm = str_replace('\\', '/', (string)$st['name']); $total += (int)$st['size']; $names[$i] = $nm; if (str_contains($nm, '..') || str_starts_with($nm, '/') || preg_match('#^[A-Za-z]:#', $nm)) { $z->close(); return 'The zip contains unsafe paths.'; } }
    if ($total > 600 * 1048576) { $z->close(); return 'The zip is larger than 600 MB when unpacked.'; }
    $strip = ''; $tops = []; foreach ($names as $nm) { if (str_starts_with($nm, '__MACOSX/')) continue; $tops[explode('/', $nm)[0]] = true; }
    if (count($tops) === 1) { $only = (string)array_key_first($tops); if (isset($names) && !in_array('index.html', $names, true) && !in_array('index.php', $names, true)) $strip = $only . '/'; }
    $tmp = sites_dir() . '/.tmp-' . $id . '-' . getmypid(); rrmdir($tmp); @mkdir($tmp, 0755, true);
    for ($i = 0; $i < $n; $i++) { $nm = $names[$i]; if (str_starts_with($nm, '__MACOSX/') || str_ends_with($nm, '/')) continue; if ($strip !== '') { if (!str_starts_with($nm, $strip)) continue; $nm = substr($nm, strlen($strip)); } if ($nm === '' || basename($nm) === '.DS_Store') continue;
        $t = $tmp . '/' . $nm; @mkdir(dirname($t), 0755, true); $in = $z->getStream($z->getNameIndex($i)); if (!$in) continue; $out = fopen($t, 'wb'); stream_copy_to_stream($in, $out); fclose($out); fclose($in); @chmod($t, 0644); }
    $z->close();
    if (!is_file("$tmp/index.html") && !is_file("$tmp/index.php") && !is_file("$tmp/index.htm")) { rrmdir($tmp); return 'The zip needs an index.html (or index.php) at its top level.'; }
    $bak = sites_dir() . '/.backup-' . $id; if ($exists) { rrmdir($bak); @rename($dest, $bak); }
    if (!@rename($tmp, $dest)) { if ($exists) @rename($bak, $dest); rrmdir($tmp); return 'Could not move the files into place (permissions).'; }
    $keepGate = site_register($id, $label !== '' ? $label : site_label($id)); return $keepGate ? '' : 'The files were installed but the protection rules could not be written.';
}
// ===== Email accounts (cPanel UAPI, called from this server with an API token) =====
function cp_key(): string { return hash('sha256', 'css-cp-token|' . (string)cfg('preview_token'), true); }
function cp_conf(): ?array { $c = jread(DATA_DIR . '/cpanel.json', []); return (!empty($c['user']) && !empty($c['tok'])) ? $c : null; }
function cp_token(array $c): string {
    $raw = base64_decode((string)$c['tok'], true); if ($raw === false) return '';
    if (($c['enc'] ?? '') === 'sodium' && function_exists('sodium_crypto_secretbox_open')) { $n = substr($raw, 0, 24); $o = sodium_crypto_secretbox_open(substr($raw, 24), $n, cp_key()); return $o === false ? '' : $o; }
    return $raw;
}
function cp_save(string $user, string $token, string $host = ''): bool {
    $enc = ''; if (function_exists('sodium_crypto_secretbox')) { $n = random_bytes(24); $raw = $n . sodium_crypto_secretbox($token, $n, cp_key()); $enc = 'sodium'; } else $raw = $token;
    $ok = jwrite(DATA_DIR . '/cpanel.json', ['user' => $user, 'tok' => base64_encode($raw), 'enc' => $enc, 'host' => $host, 'saved' => date('c')]); @chmod(DATA_DIR . '/cpanel.json', 0600); return $ok;
}
/** Call a cPanel UAPI function. Returns ['ok'=>bool,'data'=>mixed,'err'=>string]. */
function cp_call(string $mod, string $fn, array $q = []): array {
    $c = cp_conf(); if (!$c) return ['ok' => false, 'data' => null, 'err' => 'Not connected to cPanel yet.'];
    if (!function_exists('curl_init')) return ['ok' => false, 'data' => null, 'err' => 'PHP curl is missing (cPanel > Select PHP Version > Extensions > curl).'];
    $host = $c['host'] !== '' && isset($c['host']) ? (string)$c['host'] : 'cpanel.cssgroup.com.ng';
    $base = (string)($c['base'] ?? ('https://' . $host . ':2083')); $path = '/execute/' . $mod . '/' . $fn; $tok = cp_token($c);
    if ($tok === '') return ['ok' => false, 'data' => null, 'err' => 'The saved API token could not be read. Connect again.'];
    $tries = [[$base . $path, true, []]]; if (str_starts_with($base, 'https://') && !isset($c['base'])) $tries[] = ['https://127.0.0.1:2083' . $path, false, ['Host: ' . $host . ':2083']];
    $body = false; $cerr = '';
    foreach ($tries as [$u, $verify, $xh]) {
        $ch = curl_init($u); curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_POSTFIELDS => http_build_query($q), CURLOPT_TIMEOUT => 25, CURLOPT_CONNECTTIMEOUT => 8, CURLOPT_SSL_VERIFYPEER => $verify, CURLOPT_SSL_VERIFYHOST => $verify ? 2 : 0, CURLOPT_HTTPHEADER => array_merge(['Authorization: cpanel ' . $c['user'] . ':' . $tok], $xh)]);
        $body = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); $cerr = curl_error($ch); curl_close($ch);
        if ($body !== false && $code > 0) break;
    }
    if ($body === false) return ['ok' => false, 'data' => null, 'err' => 'Could not reach cPanel (' . $cerr . ').'];
    if (isset($code) && ($code === 401 || $code === 403)) return ['ok' => false, 'data' => null, 'err' => 'cPanel refused the login. Check the cPanel username and the API token.'];
    $j = json_decode((string)$body, true); if (!is_array($j)) return ['ok' => false, 'data' => null, 'err' => 'cPanel gave an unexpected answer (HTTP ' . ($code ?? 0) . ').'];
    $res = $j['result'] ?? $j; if ((int)($res['status'] ?? 0) === 1) return ['ok' => true, 'data' => $res['data'] ?? null, 'err' => ''];
    return ['ok' => false, 'data' => null, 'err' => trim(implode(' ', array_map('strval', (array)($res['errors'] ?? ['cPanel reported an error.']))))];
}
function email_list(): array { // all mailboxes of the whole account (main domain + subdomains/add-on domains)
    $r = cp_call('Email', 'list_pops_with_disk', ['no_human_readable_keys' => 0]); if (!$r['ok']) $r = cp_call('Email', 'list_pops');
    if (!$r['ok']) return $r; $out = [];
    foreach ((array)$r['data'] as $a) { if (!is_array($a)) continue; $email = (string)($a['email'] ?? (($a['user'] ?? '') . '@' . ($a['domain'] ?? ''))); if (!str_contains($email, '@')) continue; [$u, $d] = explode('@', $email, 2);
        $out[] = ['email' => $email, 'user' => $u, 'domain' => $d, 'used' => (string)($a['humandiskused'] ?? ($a['diskused'] ?? '')), 'quota' => (string)($a['humandiskquota'] ?? ($a['diskquota'] ?? '')), 'login_off' => !empty($a['suspended_login']), 'in_off' => !empty($a['suspended_incoming'])]; }
    usort($out, fn($a, $b) => strcmp($a['domain'] . $a['user'], $b['domain'] . $b['user'])); return ['ok' => true, 'data' => $out, 'err' => ''];
}
function email_domains(): array { $r = cp_call('Email', 'list_mail_domains'); if (!$r['ok']) return []; $o = []; foreach ((array)$r['data'] as $d) $o[] = is_array($d) ? (string)($d['domain'] ?? '') : (string)$d; return array_values(array_filter($o)); }
function maintenance_is_on(): bool { return is_file(site_root() . '/maintenance.flag'); }

/* ---------- uploads ---------- */
function ini_bytes(string $v): int { $v = trim($v); $n = (int)$v; return match (strtolower(substr($v, -1))) { 'g' => $n * 1073741824, 'm' => $n * 1048576, 'k' => $n * 1024, default => $n }; }
function upload_limit(): int { return min(ini_bytes((string)ini_get('upload_max_filesize')), ini_bytes((string)ini_get('post_max_size')) ?: PHP_INT_MAX); }
function fmt_bytes(int $b): string { return $b >= 1048576 ? round($b / 1048576, 1) . ' MB' : round($b / 1024) . ' KB'; }
function uploads_dir(): string { return site_root() . '/images/uploads'; }
function ensure_uploads_dir(): void {
    $d = uploads_dir(); if (!is_dir($d)) @mkdir($d, 0755, true);
    $ht = $d . '/.htaccess';
    if (!is_file($ht)) @file_put_contents($ht, "# uploaded files must never be executed\n<IfModule mod_php.c>\n  php_flag engine off\n</IfModule>\nRemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8 .phar\nOptions -ExecCGI -Indexes\n<FilesMatch \"\\.(php[0-9]?|phtml|phar|pl|py|cgi|sh|htaccess)$\">\n  Require all denied\n</FilesMatch>\n");
    $ix = $d . '/index.html'; if (!is_file($ix)) @file_put_contents($ix, '');
}
/** Validate and store an uploaded photo. Returns [relative path, error]. Always re-encoded, so hidden code in the file is removed. */
function store_image(array $f): array {
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return [null, upload_error_text((int)($f['error'] ?? 4))];
    if (!is_uploaded_file($f['tmp_name'])) return [null, 'Invalid upload.'];
    if ($f['size'] > 25 * 1048576) return [null, 'Photo is larger than 25 MB.'];
    $info = @getimagesize($f['tmp_name']); if (!$info) return [null, 'That file is not an image.'];
    $mime = $info['mime'] ?? ''; if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) return [null, 'Use a JPG, PNG or WebP photo.'];
    if (!function_exists('imagecreatefromstring')) return [null, 'The server has no image library (GD). Enable it in cPanel → Select PHP Version.'];
    $img = @imagecreatefromstring((string)file_get_contents($f['tmp_name'])); if (!$img) return [null, 'The photo could not be read.'];
    $w = imagesx($img); $hh = imagesy($img); $max = (int)cfg('max_image_px', 2000);
    if (max($w, $hh) > $max) { $r = $max / max($w, $hh); $nw = (int)round($w * $r); $nh = (int)round($hh * $r); $n = imagecreatetruecolor($nw, $nh); imagefill($n, 0, 0, imagecolorallocate($n, 255, 255, 255)); imagecopyresampled($n, $img, 0, 0, 0, 0, $nw, $nh, $w, $hh); imagedestroy($img); $img = $n; $w = $nw; $hh = $nh; }
    else { $n = imagecreatetruecolor($w, $hh); imagefill($n, 0, 0, imagecolorallocate($n, 255, 255, 255)); imagecopy($n, $img, 0, 0, 0, 0, $w, $hh); imagedestroy($img); $img = $n; }
    ensure_uploads_dir(); $sub = date('Ym'); $dir = uploads_dir() . '/' . $sub; if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $name = bin2hex(random_bytes(8)) . '.jpg'; $ok = imagejpeg($img, $dir . '/' . $name, 82); imagedestroy($img);
    if (!$ok) return [null, 'Could not save the photo on the server (check folder permissions).'];
    @chmod($dir . '/' . $name, 0644);
    return ['images/uploads/' . $sub . '/' . $name, null];
}
function store_video(array $f): array {
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return [null, upload_error_text((int)($f['error'] ?? 4))];
    if (!is_uploaded_file($f['tmp_name'])) return [null, 'Invalid upload.'];
    $max = min((int)cfg('max_video_mb', 100) * 1048576, upload_limit() ?: PHP_INT_MAX);
    if ($f['size'] > $max) return [null, 'Video is larger than the allowed ' . fmt_bytes($max) . '. Compress it, or ask your host to raise upload_max_filesize.'];
    $fi = new finfo(FILEINFO_MIME_TYPE); $mime = $fi->file($f['tmp_name']);
    $ext = ['video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/quicktime' => 'mp4'][$mime] ?? null; if (!$ext) return [null, 'Use an MP4 or WebM video.'];
    ensure_uploads_dir(); $dir = uploads_dir() . '/videos'; if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $name = bin2hex(random_bytes(8)) . '.' . $ext; if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $name)) return [null, 'Could not save the video on the server.'];
    @chmod($dir . '/' . $name, 0644);
    return ['images/uploads/videos/' . $name, null];
}
function upload_error_text(int $e): string {
    return match ($e) { UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'The file is larger than the server allows (' . fmt_bytes(upload_limit()) . '). Raise upload_max_filesize and post_max_size in cPanel → MultiPHP INI Editor.', UPLOAD_ERR_PARTIAL => 'Upload was interrupted. Try again.', UPLOAD_ERR_NO_FILE => 'Choose a file first.', default => 'Upload failed (code ' . $e . ').' };
}
function uploaded_files(): array {
    $out = []; $base = uploads_dir(); if (!is_dir($base)) return $out;
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $f) { if (!$f->isFile()) continue; $n = $f->getFilename(); if ($n[0] === '.' || $n === 'index.html') continue; $rel = 'images/uploads/' . ltrim(substr($f->getPathname(), strlen($base)), '/'); $out[] = ['path' => $rel, 'size' => $f->getSize(), 'time' => $f->getMTime()]; }
    usort($out, fn($a, $b) => $b['time'] <=> $a['time']); return $out;
}
function used_paths(array $s): array { $u = []; foreach (($s['media'] ?? []) as $m) $u[$m['src']] = 1; foreach (($s['videos'] ?? []) as $v) $u[$v['src']] = 1; foreach (($s['services']['items'] ?? []) as $sl) foreach ($sl as $x) $u[$x['src']] = 1; foreach (($s['gallery']['cards'] ?? []) as $c) foreach (($c['slides'] ?? []) as $x) $u[$x['src']] = 1; foreach (($s['news'] ?? []) as $a) { if (!empty($a['cover'])) $u[$a['cover']] = 1; foreach (($a['gallery'] ?? []) as $g) $u[$g] = 1; if (!empty($a['video'])) $u[$a['video']] = 1; } return $u; }

/* ---------- form submissions ---------- */
function submissions_file(): string { return site_root() . '/submissions/forms.jsonl'; }
function read_submissions(): array {
    $f = submissions_file(); if (!is_file($f)) return []; $rows = [];
    foreach (file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) { $r = json_decode($l, true); if (is_array($r)) $rows[] = $r; }
    return array_reverse($rows);
}


/* ---------- news ---------- */
function news_all(array $s): array { $n = $s['news'] ?? []; usort($n, fn($a, $b) => strcmp((string)($b['date'] ?? ''), (string)($a['date'] ?? '')) ?: strcmp((string)($b['created'] ?? ''), (string)($a['created'] ?? ''))); return $n; }
/** Published articles in the shape the website needs; also registers their photos/videos so the lightbox and video pop-up work. */
function news_public(array $s, array &$MEDIA, array &$VIDEOS): array {
    $out = []; $today = date('Y-m-d');
    foreach (news_all($s) as $a) {
        if (($a['status'] ?? 'published') !== 'published' || (($a['date'] ?? '') > $today && !empty($a['future_hide']))) continue;
        $id = $a['id']; $title = (string)($a['title'] ?? ''); $gal = [];
        foreach (($a['gallery'] ?? []) as $i => $src) { $k = "nw_{$id}_$i"; $MEDIA[$k] = ['src' => $src, 'alt' => $title, 'pos' => 'center']; $gal[] = ['src' => $src, 'key' => $k]; }
        $cover = $a['cover'] ?? ($gal[0]['src'] ?? ''); $coverKey = null;
        if ($cover) { $coverKey = "nw_{$id}_c"; $MEDIA[$coverKey] = ['src' => $cover, 'alt' => $title, 'pos' => 'center']; }
        $vk = null; if (!empty($a['video'])) { $vk = "nw_{$id}_v"; $VIDEOS[$vk] = ['src' => $a['video'], 'title' => $title]; }
        $out[] = ['slug' => $a['slug'], 'title' => $title, 'date' => $a['date'] ?? '', 'summary' => $a['summary'] ?? '', 'body' => $a['body'] ?? '', 'cover' => $cover, 'coverKey' => $coverKey, 'gallery' => $gal, 'videoKey' => $vk];
    }
    return $out;
}
function news_slug(string $title, array $s, ?string $keepId = null): string {
    $t = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $title) ?: $title; $b = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $t), '-')); $b = substr($b ?: 'article', 0, 80); $slug = $b; $n = 2;
    $taken = fn($x) => (bool)array_filter($s['news'] ?? [], fn($a) => $a['slug'] === $x && $a['id'] !== $keepId);
    while ($taken($slug)) $slug = $b . '-' . $n++; return $slug;
}


/* ---------- gallery sliders ---------- */
function gallery_public(array $s): array {
    $g = $s['gallery'] ?? []; $cards = [];
    foreach (($g['cards'] ?? []) as $c) { $sl = []; foreach (($c['slides'] ?? []) as $x) $sl[] = ['src' => $x['src'], 'title' => $x['title'] ?? '', 'sub' => $x['sub'] ?? '']; if ($sl) $cards[] = ['slides' => $sl]; }
    return ['title' => $g['title'] ?? '', 'interval' => (int)($g['interval'] ?? 5), 'cards' => $cards];
}


/* ---------- service photo sliders ---------- */
function service_defs(): array { return ['agriculture' => 'Agriculture', 'construction' => 'Construction', 'energy' => 'Energy', 'aviation' => 'Aviation', 'real-estate' => 'Real Estate', 'ict' => 'ICT']; }
function services_public(array $s): array { $v = $s['services'] ?? []; $items = []; foreach (service_defs() as $k => $n) { $l = []; foreach (($v['items'][$k] ?? []) as $x) $l[] = $x['src']; if ($l) $items[$k] = $l; } return ['interval' => (int)($v['interval'] ?? 4), 'items' => (object)$items]; }
