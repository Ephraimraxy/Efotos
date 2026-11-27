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
    $TEXT = []; foreach (($s['text'] ?? []) as $k => $t) if (isset($t['value']) && $t['value'] !== null && $t['value'] !== '') $TEXT[$k] = $t['value'];
    $flags = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP;
    $out = "/* AUTO-GENERATED by the CSS Group admin panel (" . date('Y-m-d H:i') . "). Do not edit by hand: changes are overwritten. */\n";
    $out .= 'window.SITE = ' . json_encode($SITE, $flags) . ";\n";
    $out .= 'window.FX = ' . json_encode($s['fx'] ?? new stdClass, $flags) . ";\n";
    $out .= 'window.MEDIA = ' . json_encode($MEDIA ?: new stdClass, $flags) . ";\n";
    $out .= 'window.VIDEOS = ' . json_encode($VIDEOS ?: new stdClass, $flags) . ";\n";
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
    return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex\"><title>" . h($company) . " – $title</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:linear-gradient(135deg,#0a3d1b,#10a24a);font:16px/1.6 system-ui,Segoe UI,Roboto,sans-serif;color:#fff;text-align:center;padding:24px}.c{max-width:560px}.l{width:96px;height:96px;background:#fff;border-radius:50%;padding:8px;margin:0 auto 22px}h1{font-size:clamp(28px,5vw,44px);margin:0 0 12px;line-height:1.15}p{margin:0 0 10px;opacity:.92}.u{font-size:14px}a{color:#ffd24a}</style></head><body><div class=\"c\"><img class=\"l\" src=\"/images/css-mark.png\" alt=\"\"><h1>$title</h1><p>$msg</p>$extra</div></body></html>";
}
function apply_maintenance(array $m, string $company): bool {
    if (!empty($m['on'])) { return write_site_file('maintenance.html', maintenance_html($m, $company)) && write_site_file('maintenance.flag', date('c') . "\n"); }
    $f = site_root() . '/maintenance.flag'; return !is_file($f) || @unlink($f);
}
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
function used_paths(array $s): array { $u = []; foreach (($s['media'] ?? []) as $m) $u[$m['src']] = 1; foreach (($s['videos'] ?? []) as $v) $u[$v['src']] = 1; return $u; }

/* ---------- form submissions ---------- */
function submissions_file(): string { return site_root() . '/submissions/forms.jsonl'; }
function read_submissions(): array {
    $f = submissions_file(); if (!is_file($f)) return []; $rows = [];
    foreach (file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) { $r = json_decode($l, true); if (is_array($r)) $rows[] = $r; }
    return array_reverse($rows);
}
