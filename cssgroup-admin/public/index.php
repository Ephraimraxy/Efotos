<?php
declare(strict_types=1);
// The admin code (app/, data/) lives OUTSIDE the web folders: next to public/ (docroot cssgroup-admin/public) or in ~/cssgroup-admin when this folder is the domain's own folder under public_html.
$__app = is_file(dirname(__DIR__) . '/app/lib.php') ? dirname(__DIR__) . '/app' : dirname(__DIR__, 2) . '/cssgroup-admin/app';
require $__app . '/lib.php';

if (cfg('force_https', true) && !is_https() && php_sapi_name() !== 'cli-server') { header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], true, 301); exit; }
header('X-Frame-Options: DENY'); header('X-Content-Type-Options: nosniff'); header('Referrer-Policy: same-origin');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; form-action 'self'");
header('Cache-Control: no-store');
start_session();

$page = preg_replace('/[^a-z_]/', '', (string)($_GET['page'] ?? 'dashboard'));
$post = $_SERVER['REQUEST_METHOD'] === 'POST';

/* ================= first-run setup ================= */
if (!is_file(DATA_DIR . '/users.json')) {
    $keyFile = DATA_DIR . '/setup.key'; $err = null;
    if ($post) {
        csrf_check();
        $key = is_file($keyFile) ? trim((string)file_get_contents($keyFile)) : '';
        $u = trim((string)($_POST['username'] ?? '')); $p = (string)($_POST['password'] ?? '');
        if ($key === '' || !hash_equals($key, trim((string)($_POST['key'] ?? '')))) $err = 'The setup key is wrong. Open data/setup.key in cPanel File Manager and copy it exactly.';
        elseif (!preg_match('/^[A-Za-z0-9_.-]{3,30}$/', $u)) $err = 'Username: 3–30 letters, numbers, dot, dash or underscore.';
        elseif (!password_ok($p) || $p !== (string)($_POST['password2'] ?? '')) $err = 'Password must be at least 12 characters and both boxes must match.';
        else {
            save_users([['id' => bin2hex(random_bytes(6)), 'username' => $u, 'hash' => password_hash($p, PASSWORD_DEFAULT), 'role' => 'owner', 'totp' => null, 'created' => date('c')]]);
            @unlink($keyFile); session_regenerate_id(true); $_SESSION['user'] = ['username' => $u, 'role' => 'owner']; audit('Owner account created');
            flash('Welcome! Your owner account is ready. Next: open Health check and fix anything marked red.'); redirect('?page=health');
        }
    }
    layout_public('First-time setup', '<h1>First-time setup</h1><p class="muted">Create the owner account. You need the setup key from <code>data/setup.key</code> on the server (File Manager). The key is deleted after setup.</p>' . ($err ? '<div class="flash err">' . h($err) . '</div>' : '') .
        '<form method="post" autocomplete="off">' . csrf_field() . '<label>Setup key<input name="key" required autocomplete="off"></label><label>Choose a username<input name="username" required autocomplete="username"></label><label>Password (12+ characters)<input type="password" name="password" required minlength="12" autocomplete="new-password"></label><label>Repeat password<input type="password" name="password2" required minlength="12" autocomplete="new-password"></label><button class="btn">Create owner account</button></form>');
    exit;
}

/* ================= login / logout ================= */
if ($page === 'login') {
    $err = null;
    if ($post) {
        csrf_check(); $name = trim((string)($_POST['username'] ?? '')); $rk = 'login:' . client_ip() . ':' . strtolower($name);
        if (rl_count($rk, 900) >= 5 || rl_count('ip:' . client_ip(), 900) >= 20) $err = 'Too many attempts. Wait 15 minutes and try again.';
        else {
            $u = find_user($name); $ok = $u && password_verify((string)($_POST['password'] ?? ''), $u['hash']);
            if ($ok && !empty($u['totp'])) $ok = totp_ok($u['totp'], (string)($_POST['code'] ?? ''));
            if ($ok) { rl_clear($rk); session_regenerate_id(true); $_SESSION['user'] = ['username' => $u['username'], 'role' => $u['role']]; audit('Signed in'); redirect('?page=dashboard'); }
            rl_hit($rk, 900); rl_hit('ip:' . client_ip(), 900); audit('Failed sign-in for "' . substr($name, 0, 40) . '"'); $err = 'Wrong username, password or code.';
        }
    }
    layout_public('Sign in', '<h1>Sign in</h1>' . ($err ? '<div class="flash err">' . h($err) . '</div>' : '') . '<form method="post">' . csrf_field() . '<label>Username<input name="username" required autocomplete="username" autofocus></label><label>Password<input type="password" name="password" required autocomplete="current-password"></label><label>6-digit code <span class="muted">(only if you turned on two-step sign-in)</span><input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="8"></label><button class="btn">Sign in</button></form>');
    exit;
}
if ($page === 'logout') { if ($post) { csrf_check(); audit('Signed out'); $_SESSION = []; session_destroy(); } redirect('?page=login'); }

$user = require_login();
$isOwner = ($user['role'] ?? '') === 'owner';
$S = site();

/* ================= actions (POST) ================= */
if ($post) {
    csrf_check(); $act = (string)($_POST['action'] ?? '');

    if ($act === 'settings') {
        $S['company']['name'] = clean_line($_POST['company'] ?? '', 120);
        $S['contact']['phone'] = clean_line($_POST['phone'] ?? '', 40);
        $em = clean_line($_POST['email'] ?? '', 120);
        if ($em !== '' && !filter_var($em, FILTER_VALIDATE_EMAIL)) { flash('That email address does not look right.', 'err'); redirect('?page=settings'); }
        $S['contact']['email'] = $em;
        $S['contact']['hours'] = clean_line($_POST['hours'] ?? '', 120); $S['contact']['closed'] = clean_line($_POST['closed'] ?? '', 80);
        $S['contact']['offices'] = [['label' => clean_line($_POST['o1l'] ?? '', 80), 'address' => clean_line($_POST['o1a'] ?? '', 220)], ['label' => clean_line($_POST['o2l'] ?? '', 80), 'address' => clean_line($_POST['o2a'] ?? '', 220)]];
        $S['banner'] = ['on' => !empty($_POST['banner_on']), 'text' => clean_line($_POST['banner_text'] ?? '', 200), 'link' => safe_url($_POST['banner_link'] ?? '')];
        flash(save_site($S, 'Updated contact details / banner') ? 'Saved. The live website now shows your changes (refresh the site to see them).' : 'Could not save. Open Health check to see what is wrong.', 'ok'); redirect('?page=settings');
    }

    if ($act === 'news_save') {
        $id = (string)($_POST['id'] ?? ''); $S['news'] = $S['news'] ?? []; $idx = null;
        foreach ($S['news'] as $i => $a) if ($a['id'] === $id) $idx = $i;
        $title = clean_line($_POST['title'] ?? '', 200); $date = (string)($_POST['date'] ?? '');
        if ($title === '') { flash('Please give the article a headline.', 'err'); redirect('?page=news' . ($id ? '&edit=' . urlencode($id) : '&new=1')); }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = date('Y-m-d');
        $art = $idx !== null ? $S['news'][$idx] : ['id' => bin2hex(random_bytes(5)), 'created' => date('c'), 'gallery' => []];
        $art['title'] = $title; $art['date'] = $date; $art['summary'] = clean_line($_POST['summary'] ?? '', 300);
        $art['body'] = mb_substr(str_replace("\r", '', trim((string)($_POST['body'] ?? ''))), 0, 20000);
        $art['status'] = ($_POST['status'] ?? '') === 'draft' ? 'draft' : 'published';
        if ($idx === null) $art['slug'] = news_slug($title, $S); elseif (empty($art['slug'])) $art['slug'] = news_slug($title, $S, $art['id']);
        $errs = [];
        // gallery: keep / remove / reorder existing photos
        $keep = []; $removed = [];
        foreach (($art['gallery'] ?? []) as $i => $src) { if (!empty($_POST['rm'][$i])) { $removed[] = $src; continue; } $keep[] = [(int)($_POST['pos'][$i] ?? $i), $i, $src]; }
        usort($keep, fn($a, $b) => [$a[0], $a[1]] <=> [$b[0], $b[1]]); $gal = array_map(fn($k) => $k[2], $keep);
        foreach (reorder_files($_FILES['photos'] ?? []) as $f) { if (($f['error'] ?? 4) === UPLOAD_ERR_NO_FILE) continue; [$p, $e] = store_image($f); if ($e) $errs[] = $f['name'] . ': ' . $e; else $gal[] = $p; }
        $art['gallery'] = $gal;
        if (!empty($_FILES['cover']['name'])) { [$p, $e] = store_image($_FILES['cover']); if ($e) $errs[] = 'Cover: ' . $e; else { $art['cover'] = $p; } }
        elseif (!empty($_POST['cover_pick']) && in_array($_POST['cover_pick'], $gal, true)) $art['cover'] = $_POST['cover_pick'];
        elseif (isset($_POST['cover_clear'])) unset($art['cover']);
        if (!empty($art['cover']) && in_array($art['cover'], $removed, true) && !in_array($art['cover'], $gal, true) && empty($_FILES['cover']['name'])) unset($art['cover']);
        // video
        if (!empty($_FILES['video']['name'])) { [$p, $e] = store_video($_FILES['video']); if ($e) $errs[] = 'Video: ' . $e; else $art['video'] = $p; }
        else { $u = safe_url($_POST['video_url'] ?? ''); if ($u !== '' && preg_match('#^https://(www\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)/#i', $u)) $art['video'] = $u; elseif (trim((string)($_POST['video_url'] ?? '')) !== '') $errs[] = 'Video link must be a YouTube or Vimeo address (https://…).'; elseif (isset($_POST['video_clear'])) unset($art['video']); }
        if ($idx === null) $S['news'][] = $art; else $S['news'][$idx] = $art;
        // delete files that were removed and are no longer used anywhere
        $used = used_paths(array_merge($S, ['news' => $S['news']]));
        foreach ($removed as $r) if (str_starts_with($r, 'images/uploads/') && !isset($used[$r]) && !str_contains($r, '..')) @unlink(site_root() . '/' . $r);
        $ok = save_site($S, ($idx === null ? 'Added news article "' : 'Updated news article "') . $title . '" (' . $art['status'] . ')');
        foreach ($errs as $e) flash($e, 'err');
        flash($ok ? ($art['status'] === 'published' ? 'Article saved and live on the website.' : 'Draft saved. It is not visible on the website yet.') : 'Could not save.', $ok ? 'ok' : 'err');
        redirect('?page=news&edit=' . urlencode($art['id']));
    }
    if ($act === 'news_delete') {
        $id = (string)($_POST['id'] ?? ''); $S['news'] = $S['news'] ?? []; $t = '';
        $S['news'] = array_values(array_filter($S['news'], function ($a) use ($id, &$t) { if ($a['id'] === $id) { $t = $a['title']; return false; } return true; }));
        $ok = save_site($S, 'Deleted news article "' . $t . '"'); flash($ok ? 'Article deleted.' : 'Could not delete.', $ok ? 'ok' : 'err'); redirect('?page=news');
    }
    if ($act === 'news_status') {
        $id = (string)($_POST['id'] ?? ''); foreach (($S['news'] ?? []) as $i => $a) if ($a['id'] === $id) $S['news'][$i]['status'] = ($_POST['to'] ?? '') === 'draft' ? 'draft' : 'published';
        $ok = save_site($S, 'Changed news status'); flash($ok ? 'Updated.' : 'Could not save.', $ok ? 'ok' : 'err'); redirect('?page=news');
    }

    if ($act === 'gallery_settings') {
        $S['gallery']['title'] = clean_line($_POST['title'] ?? '', 120); $S['gallery']['interval'] = max(2, min(20, (int)($_POST['interval'] ?? 5)));
        flash(save_site($S, 'Updated gallery settings') ? 'Saved and live.' : 'Could not save.', 'ok'); redirect('?page=gallery');
    }
    if ($act === 'gallery_addcard') {
        $S['gallery']['cards'] = $S['gallery']['cards'] ?? [];
        if (count($S['gallery']['cards']) >= 6) flash('A gallery can have up to 6 cards.', 'err'); else { $S['gallery']['cards'][] = ['id' => bin2hex(random_bytes(4)), 'slides' => []]; save_site($S, 'Added a gallery card'); flash('Card added. Upload its photos below.', 'ok'); }
        redirect('?page=gallery');
    }
    if ($act === 'gallery_delcard') {
        $id = (string)($_POST['id'] ?? ''); $removed = []; $S['gallery']['cards'] = array_values(array_filter($S['gallery']['cards'] ?? [], function ($c) use ($id, &$removed) { if ($c['id'] === $id) { foreach ($c['slides'] as $x) $removed[] = $x['src']; return false; } return true; }));
        $used = used_paths($S); foreach ($removed as $r) if (str_starts_with($r, 'images/uploads/') && !isset($used[$r]) && !str_contains($r, '..')) @unlink(site_root() . '/' . $r);
        save_site($S, 'Deleted a gallery card'); flash('Card deleted.', 'ok'); redirect('?page=gallery');
    }
    if ($act === 'gallery_card') {
        $id = (string)($_POST['id'] ?? ''); $ci = null; foreach (($S['gallery']['cards'] ?? []) as $i => $c) if ($c['id'] === $id) $ci = $i;
        if ($ci === null) { flash('Card not found.', 'err'); redirect('?page=gallery'); }
        $card = $S['gallery']['cards'][$ci]; $keep = []; $removed = [];
        foreach ($card['slides'] as $i => $sl) { if (!empty($_POST['rm'][$i])) { $removed[] = $sl['src']; continue; } $keep[] = [(int)($_POST['pos'][$i] ?? $i + 1), $i, ['src' => $sl['src'], 'title' => clean_line($_POST['st'][$i] ?? '', 80), 'sub' => clean_line($_POST['ss'][$i] ?? '', 120)]]; }
        usort($keep, fn($a, $b) => [$a[0], $a[1]] <=> [$b[0], $b[1]]); $slides = array_map(fn($k) => $k[2], $keep); $errs = []; $n = 0;
        $newTitle = clean_line($_POST['new_title'] ?? '', 80); $newSub = clean_line($_POST['new_sub'] ?? '', 120);
        foreach (reorder_files($_FILES['photos'] ?? []) as $f) { if (($f['error'] ?? 4) === UPLOAD_ERR_NO_FILE) continue; if (count($slides) >= 40) { $errs[] = 'A card can hold up to 40 photos.'; break; } [$p, $e] = store_image($f); if ($e) $errs[] = $f['name'] . ': ' . $e; else { $slides[] = ['src' => $p, 'title' => $newTitle, 'sub' => $newSub]; $n++; } }
        $S['gallery']['cards'][$ci]['slides'] = $slides; $used = used_paths($S);
        foreach ($removed as $r) if (str_starts_with($r, 'images/uploads/') && !isset($used[$r]) && !str_contains($r, '..')) @unlink(site_root() . '/' . $r);
        $ok = save_site($S, "Updated gallery card ($n photo(s) added, " . count($removed) . ' removed)'); foreach ($errs as $e) flash($e, 'err'); flash($ok ? 'Saved and live.' : 'Could not save.', $ok ? 'ok' : 'err'); redirect('?page=gallery#c' . $id);
    }

    if ($act === 'svc_settings') { $S['services']['interval'] = max(2, min(20, (int)($_POST['interval'] ?? 4))); flash(save_site($S, 'Updated service slider speed') ? 'Saved and live.' : 'Could not save.', 'ok'); redirect('?page=services'); }
    if ($act === 'svc_save') {
        $k = (string)($_POST['key'] ?? ''); if (!isset(service_defs()[$k])) { flash('Unknown service.', 'err'); redirect('?page=services'); }
        $cur = $S['services']['items'][$k] ?? []; $keep = []; $removed = [];
        foreach ($cur as $i => $x) { if (!empty($_POST['rm'][$i])) { $removed[] = $x['src']; continue; } $keep[] = [(int)($_POST['pos'][$i] ?? $i + 1), $i, ['src' => $x['src']]]; }
        usort($keep, fn($a, $b) => [$a[0], $a[1]] <=> [$b[0], $b[1]]); $list = array_map(fn($z) => $z[2], $keep); $errs = []; $n = 0;
        foreach (reorder_files($_FILES['photos'] ?? []) as $f) { if (($f['error'] ?? 4) === UPLOAD_ERR_NO_FILE) continue; if (count($list) >= 30) { $errs[] = 'A service can hold up to 30 photos.'; break; } [$p, $e] = store_image($f); if ($e) $errs[] = $f['name'] . ': ' . $e; else { $list[] = ['src' => $p]; $n++; } }
        if (!$list) { $errs[] = 'A service needs at least one photo, so the last one was kept.'; $list = $cur ? [$cur[0]] : []; $removed = array_filter($removed, fn($r) => !$cur || $r !== $cur[0]); }
        $S['services']['items'][$k] = $list; $used = used_paths($S);
        foreach ($removed as $r) if (str_starts_with($r, 'images/uploads/') && !isset($used[$r]) && !str_contains($r, '..')) @unlink(site_root() . '/' . $r);
        $ok = save_site($S, 'Updated photos of service ' . service_defs()[$k] . " ($n added)"); foreach ($errs as $e) flash($e, 'err'); flash($ok ? 'Saved and live.' : 'Could not save.', $ok ? 'ok' : 'err'); redirect('?page=services#s-' . $k);
    }

    if ($act === 'chairman_save') {
        if (!isset($S['media']['chair'])) { flash('Chairman photo slot missing.', 'err'); redirect('?page=chairman'); }
        if (!empty($_FILES['photo']['name'])) { [$pp, $e] = store_image($_FILES['photo']); if ($e) { flash($e, 'err'); redirect('?page=chairman'); } $S['media']['chair']['src'] = $pp; }
        elseif (isset($_POST['reset']) && !empty($S['media']['chair']['original'])) $S['media']['chair']['src'] = $S['media']['chair']['original'];
        $S['media']['chair']['pos'] = ['top' => 'center 5%', 'face' => 'center 18%', 'center' => 'center'][$_POST['focus'] ?? 'face'] ?? 'center 18%';
        foreach (['quote_text' => 600, 'quote_name' => 100, 'quote_role' => 120] as $k => $max) { if (!isset($S['text'][$k])) continue; $v = clean_line($_POST[$k] ?? '', $max); $S['text'][$k]['value'] = ($v === '' || $v === $S['text'][$k]['default']) ? null : $v; }
        flash(save_site($S, 'Updated Chairman section') ? 'Saved. The Chairman section on the website is updated.' : 'Could not save.', 'ok'); redirect('?page=chairman');
    }
    if ($act === 'texts') {
        foreach (($S['text'] ?? []) as $k => $t) { $v = trim((string)($_POST['t_' . $k] ?? '')); $v = mb_substr(str_replace("\r", '', $v), 0, 1500); $S['text'][$k]['value'] = ($v === '' || $v === $t['default']) ? null : $v; }
        flash(save_site($S, 'Updated page texts') ? 'Texts saved and live.' : 'Could not save.', 'ok'); redirect('?page=texts');
    }
    if ($act === 'media_replace') {
        $key = (string)($_POST['key'] ?? ''); if (!isset($S['media'][$key])) { flash('Unknown photo slot.', 'err'); redirect('?page=media'); }
        $alt = clean_line($_POST['alt'] ?? '', 160); if ($alt !== '') $S['media'][$key]['alt'] = $alt;
        if (!empty($_FILES['photo']['name'])) { [$p, $e] = store_image($_FILES['photo']); if ($e) { flash($e, 'err'); redirect('?page=media#' . $key); } $S['media'][$key]['src'] = $p; }
        elseif (!empty($_POST['library']) && is_string($_POST['library']) && preg_match('#^images/(uploads/[A-Za-z0-9/_.-]+|[A-Za-z0-9_.-]+)$#', $_POST['library']) && is_file(site_root() . '/' . $_POST['library']) && !str_contains($_POST['library'], '..')) $S['media'][$key]['src'] = $_POST['library'];
        elseif (isset($_POST['reset']) && !empty($S['media'][$key]['original'])) $S['media'][$key]['src'] = $S['media'][$key]['original'];
        elseif ($alt === '') { flash('Choose a photo first.', 'err'); redirect('?page=media#' . $key); }
        flash(save_site($S, 'Changed photo "' . $S['media'][$key]['label'] . '"') ? 'Photo updated and live.' : 'Could not save.', 'ok'); redirect('?page=media#' . $key);
    }
    if ($act === 'library_upload') {
        $n = 0; $errs = [];
        foreach (reorder_files($_FILES['photos'] ?? []) as $f) { if (($f['error'] ?? 4) === UPLOAD_ERR_NO_FILE) continue; [$p, $e] = store_image($f); if ($e) $errs[] = $f['name'] . ': ' . $e; else $n++; }
        if ($n) { audit("Uploaded $n photo(s) to the library"); flash("$n photo(s) added to the library. Choose them for any slot below.", 'ok'); }
        foreach ($errs as $e) flash($e, 'err'); redirect('?page=media#library');
    }
    if ($act === 'library_delete') {
        $p = (string)($_POST['path'] ?? ''); $used = used_paths($S);
        if (preg_match('#^images/uploads/[A-Za-z0-9/_.-]+$#', $p) && !str_contains($p, '..') && is_file(site_root() . '/' . $p)) { if (isset($used[$p])) flash('That file is in use on the website. Replace it first.', 'err'); else { @unlink(site_root() . '/' . $p); audit('Deleted ' . $p); flash('Deleted.', 'ok'); } }
        redirect('?page=media#library');
    }
    if ($act === 'video_save') {
        $key = (string)($_POST['key'] ?? ''); if (!isset($S['videos'][$key])) { flash('Unknown video slot.', 'err'); redirect('?page=videos'); }
        $S['videos'][$key]['title'] = clean_line($_POST['title'] ?? '', 120);
        if (!empty($_FILES['video']['name'])) { [$p, $e] = store_video($_FILES['video']); if ($e) { flash($e, 'err'); redirect('?page=videos'); } $S['videos'][$key]['src'] = $p; }
        elseif (($u = safe_url($_POST['url'] ?? '')) !== '' && preg_match('#^https://(www\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)/#i', $u)) $S['videos'][$key]['src'] = $u;
        elseif (trim((string)($_POST['url'] ?? '')) !== '') { flash('Paste a YouTube or Vimeo link (https://…), or upload an MP4/WebM file.', 'err'); redirect('?page=videos'); }
        flash(save_site($S, 'Changed video "' . $S['videos'][$key]['label'] . '"') ? 'Video updated and live.' : 'Could not save.', 'ok'); redirect('?page=videos');
    }
    if ($act === 'maintenance') {
        $owner = require_owner();
        $m = ['on' => ($_POST['mode'] ?? '') === 'on', 'title' => clean_line($_POST['title'] ?? '', 100), 'message' => mb_substr(trim((string)($_POST['message'] ?? '')), 0, 600), 'until' => clean_line($_POST['until'] ?? '', 80), 'email' => clean_line($_POST['memail'] ?? '', 120)];
        if ($m['title'] === '') $m['title'] = 'We will be back soon';
        $S['maintenance'] = $m; $ok = apply_maintenance($m, $S['company']['name'] ?? 'CSS Group') && save_site($S, $m['on'] ? 'Maintenance mode TURNED ON' : 'Website set LIVE (maintenance off)');
        flash($ok ? ($m['on'] ? 'Maintenance mode is ON. Visitors see the maintenance page. Use "Preview live site" to browse it yourself.' : 'The website is LIVE.') : 'Could not change the mode. Open Health check.', $ok ? 'ok' : 'err'); redirect('?page=maintenance');
    }
    if ($act === 'site_live') {
        require_owner(); $to = (string)($_POST['to'] ?? ''); $id = $to === '_old' ? null : $to;
        $ok = site_set_live($id); if ($ok) audit($id === null ? 'Website set to the OLD site' : 'Website set live: ' . $id);
        flash($ok ? ($id === null ? 'The OLD website is live again.' : '"' . site_label($id) . '" is now live for everyone. Refresh once to see it.') : 'Could not switch. The switch rules could not be written - open Health check.', $ok ? 'ok' : 'err'); redirect('?page=version');
    }
    if ($act === 'site_repair') { require_owner(); $ok = switch_install(); flash($ok ? 'Switch rules repaired.' : 'Could not write the main .htaccess. Check folder permissions.', $ok ? 'ok' : 'err'); redirect('?page=version'); }
    if ($act === 'site_add' || $act === 'site_replace') {
        require_owner(); $replace = $act === 'site_replace';
        $label = clean_line($_POST['label'] ?? '', 60); $id = $replace ? (string)($_POST['id'] ?? '') : strtolower(trim((string)preg_replace('/[^A-Za-z0-9]+/', '-', $label), '-')); $id = substr($id, 0, 40);
        $f = $_FILES['zip'] ?? null;
        if (!$replace && $label === '') { flash('Give the website a name.', 'err'); redirect('?page=version'); }
        if (!$f || ($f['error'] ?? 4) !== UPLOAD_ERR_OK) { flash('Choose a .zip file of the website (max ' . fmt_bytes(upload_limit()) . ' on this server).', 'err'); redirect('?page=version'); }
        $err = site_from_zip($id, $label, $f['tmp_name'], $replace);
        if ($err === '') audit(($replace ? 'Replaced files of website ' : 'Added website ') . $id);
        flash($err === '' ? ($replace ? 'Files replaced. (The previous files are kept in _sites/.backup-' . $id . '.)' : 'Website added. Use Preview to look at it, then Make live when ready.') : $err, $err === '' ? 'ok' : 'err'); redirect('?page=version');
    }
    if ($act === 'site_register') { require_owner(); $id = (string)($_POST['id'] ?? ''); $ok = site_register($id, clean_line($_POST['label'] ?? $id, 60)); if ($ok) audit('Registered website ' . $id); flash($ok ? 'Website registered.' : 'Could not register it.', $ok ? 'ok' : 'err'); redirect('?page=version'); }
    if ($act === 'site_rename') { require_owner(); $id = (string)($_POST['id'] ?? ''); $r = sites_reg(); if (valid_site_id($id) && is_dir(sites_dir() . '/' . $id)) { $r['sites'][$id]['label'] = clean_line($_POST['label'] ?? '', 60) ?: $id; $r['sites'][$id]['created'] = $r['sites'][$id]['created'] ?? date('c'); sites_save($r); audit('Renamed website ' . $id); flash('Saved.', 'ok'); } redirect('?page=version'); }
    if ($act === 'site_delete') { require_owner(); $id = (string)($_POST['id'] ?? ''); $ok = site_delete($id); if ($ok) audit('Deleted website ' . $id); flash($ok ? 'Website deleted.' : 'Cannot delete this one (it is live, or it is the website this admin edits).', $ok ? 'ok' : 'err'); redirect('?page=version'); }
    if ($act === 'preview_end') { foreach (['css_preview', 'css_site'] as $c) setcookie($c, '', ['expires' => 1, 'path' => '/', 'domain' => (string)cfg('cookie_domain', ''), 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']); audit('Ended preview'); flash('Preview ended. You now see what visitors see.', 'ok'); redirect('?page=version'); }
    if ($act === 'preview') {
        $tok = (string)cfg('preview_token'); $pid = (string)($_POST['site'] ?? ''); if ($pid === '') $pid = live_id() ?? managed_id();
        if ($pid !== '_old' && !(valid_site_id($pid) && is_dir(sites_dir() . '/' . $pid))) { flash('Website not found.', 'err'); redirect('?page=version'); }
        foreach (['css_preview' => $tok, 'css_site' => $pid] as $c => $v) setcookie($c, $v, ['expires' => time() + 7200, 'path' => '/', 'domain' => (string)cfg('cookie_domain', ''), 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
        audit('Started preview of ' . $pid); redirect((string)cfg('site_url', '/'));
    }
    if ($act === 'sub_delete') {
        $f = submissions_file(); $ts = (string)($_POST['time'] ?? '');
        if ($ts !== '' && is_file($f)) { $keep = []; foreach (file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $l) { $r = json_decode($l, true); if (!is_array($r) || ($r['time'] ?? '') !== $ts) $keep[] = $l; } file_put_contents($f, $keep ? implode("\n", $keep) . "\n" : '', LOCK_EX); audit('Deleted a form submission'); flash('Deleted.', 'ok'); }
        redirect('?page=submissions');
    }
    if ($act === 'password') {
        $u = find_user($user['username']); $new = (string)($_POST['new'] ?? '');
        if (!$u || !password_verify((string)($_POST['old'] ?? ''), $u['hash'])) flash('Your current password is wrong.', 'err');
        elseif (!password_ok($new) || $new !== (string)($_POST['new2'] ?? '')) flash('New password must be 12+ characters and match.', 'err');
        else { $all = users(); foreach ($all as &$x) if ($x['username'] === $u['username']) $x['hash'] = password_hash($new, PASSWORD_DEFAULT); unset($x); save_users($all); audit('Changed own password'); flash('Password changed.', 'ok'); }
        redirect('?page=account');
    }
    if ($act === 'totp_start') { $_SESSION['totp_pending'] = b32_encode(random_bytes(10)); redirect('?page=account'); }
    if ($act === 'totp_confirm') {
        $sec = $_SESSION['totp_pending'] ?? ''; if ($sec && totp_ok($sec, (string)($_POST['code'] ?? ''))) { $all = users(); foreach ($all as &$x) if ($x['username'] === $user['username']) $x['totp'] = $sec; unset($x); save_users($all); unset($_SESSION['totp_pending']); audit('Turned on two-step sign-in'); flash('Two-step sign-in is ON.', 'ok'); } else flash('That code is not right. Try the newest code in your app.', 'err');
        redirect('?page=account');
    }
    if ($act === 'totp_off') { $u = find_user($user['username']); if ($u && password_verify((string)($_POST['pw'] ?? ''), $u['hash'])) { $all = users(); foreach ($all as &$x) if ($x['username'] === $u['username']) $x['totp'] = null; unset($x); save_users($all); audit('Turned off two-step sign-in'); flash('Two-step sign-in is OFF.', 'ok'); } else flash('Password is wrong.', 'err'); redirect('?page=account'); }
    if ($act === 'user_add') {
        require_owner(); $n = trim((string)($_POST['username'] ?? '')); $p = (string)($_POST['password'] ?? ''); $role = ($_POST['role'] ?? '') === 'owner' ? 'owner' : 'editor';
        if (!preg_match('/^[A-Za-z0-9_.-]{3,30}$/', $n) || find_user($n)) flash('Pick a different username (3–30 letters/numbers).', 'err');
        elseif (!password_ok($p)) flash('Password must be at least 12 characters.', 'err');
        else { $all = users(); $all[] = ['id' => bin2hex(random_bytes(6)), 'username' => $n, 'hash' => password_hash($p, PASSWORD_DEFAULT), 'role' => $role, 'totp' => null, 'created' => date('c')]; save_users($all); audit("Added user $n ($role)"); flash('User added.', 'ok'); }
        redirect('?page=users');
    }
    if ($act === 'user_remove') {
        require_owner(); $n = (string)($_POST['username'] ?? ''); $all = users();
        if (strcasecmp($n, $user['username']) === 0) flash('You cannot remove yourself.', 'err');
        else { save_users(array_filter($all, fn($x) => strcasecmp($x['username'], $n) !== 0)); audit("Removed user $n"); flash('User removed.', 'ok'); }
        redirect('?page=users');
    }
    if ($act === 'user_reset') {
        require_owner(); $n = (string)($_POST['username'] ?? ''); $p = (string)($_POST['password'] ?? '');
        if (!password_ok($p)) flash('Password must be at least 12 characters.', 'err'); else { $all = users(); foreach ($all as &$x) if (strcasecmp($x['username'], $n) === 0) { $x['hash'] = password_hash($p, PASSWORD_DEFAULT); $x['totp'] = null; } unset($x); save_users($all); audit("Reset password for $n"); flash('Password reset (two-step sign-in cleared for that user).', 'ok'); }
        redirect('?page=users');
    }
    if ($act === 'restore') {
        require_owner(); $f = basename((string)($_POST['file'] ?? '')); $path = DATA_DIR . '/history/' . $f;
        if (preg_match('/^site-[0-9-]+-[a-f0-9]+\.json$/', $f) && is_file($path)) { $old = jread($path, null); if (is_array($old)) { $ok = save_site($old, 'Restored settings from ' . $f); flash($ok ? 'Restored. The live website now uses that version.' : 'Could not restore.', $ok ? 'ok' : 'err'); } }
        redirect('?page=history');
    }
    if ($act === 'fix_uploads') { ensure_uploads_dir(); flash('Uploads folder protected.', 'ok'); redirect('?page=health'); }
    redirect('?page=dashboard');
}

/* ================= pages (GET) ================= */
if ($page === 'submissions' && isset($_GET['csv'])) {
    $rows = read_submissions(); header('Content-Type: text/csv; charset=utf-8'); header('Content-Disposition: attachment; filename="submissions-' . date('Ymd') . '.csv"');
    $o = fopen('php://output', 'w'); fwrite($o, "\xEF\xBB\xBF"); fputcsv($o, ['Time', 'Form', 'Name', 'Email', 'Phone', 'Details']);
    foreach ($rows as $r) { $f = $r['fields'] ?? []; $rest = $f; unset($rest['name'], $rest['email'], $rest['phone'], $rest['page']); $d = []; foreach ($rest as $k => $v) $d[] = "$k: $v"; fputcsv($o, [csv_safe($r['time'] ?? ''), csv_safe($r['type'] ?? ''), csv_safe($f['name'] ?? ''), csv_safe($f['email'] ?? ''), csv_safe($f['phone'] ?? ''), csv_safe(implode(' | ', $d))]); }
    exit;
}

ob_start();
switch ($page) {
    case 'settings': $c = $S['contact'] ?? []; $o = $c['offices'] ?? [[], []]; $b = $S['banner'] ?? [];
        echo '<h1>Contact details &amp; announcement</h1><p class="muted">These appear in the header, footer, contact page and everywhere else on the website. Save once and the whole site updates.</p><form method="post" class="card">' . csrf_field() . '<input type="hidden" name="action" value="settings">';
        echo '<div class="grid2"><label>Company name<input name="company" value="' . h($S['company']['name'] ?? '') . '"></label><label>Phone<input name="phone" value="' . h($c['phone'] ?? '') . '"></label><label>Email<input name="email" type="email" value="' . h($c['email'] ?? '') . '"></label><label>Opening hours<input name="hours" value="' . h($c['hours'] ?? '') . '"></label><label>Closed days note<input name="closed" value="' . h($c['closed'] ?? '') . '"></label></div>';
        echo '<h3>Offices</h3><div class="grid2"><label>Office 1 name<input name="o1l" value="' . h($o[0]['label'] ?? '') . '"></label><label>Office 1 address<input name="o1a" value="' . h($o[0]['address'] ?? '') . '"></label><label>Office 2 name<input name="o2l" value="' . h($o[1]['label'] ?? '') . '"></label><label>Office 2 address<input name="o2a" value="' . h($o[1]['address'] ?? '') . '"></label></div>';
        echo '<h3>Announcement banner</h3><p class="muted">A coloured strip at the very top of every page (for notices, holidays, new offers).</p><label class="chk"><input type="checkbox" name="banner_on" value="1"' . (!empty($b['on']) ? ' checked' : '') . '> Show the banner</label><div class="grid2"><label>Banner text<input name="banner_text" maxlength="200" value="' . h($b['text'] ?? '') . '"></label><label>Link (optional, https://…)<input name="banner_link" value="' . h($b['link'] ?? '') . '"></label></div><button class="btn">Save and publish</button></form>';
        break;
    case 'texts':
        echo '<h1>Page texts</h1><p class="muted">Edit the main wording of the website. Leave a box unchanged to keep the original. Clear a box (or use "Restore original") to go back to the original wording.</p><form method="post">' . csrf_field() . '<input type="hidden" name="action" value="texts">';
        foreach (($S['text'] ?? []) as $k => $t) { $val = $t['value'] ?? $t['default']; echo '<div class="card"><label>' . h($t['label']) . '<textarea name="t_' . h($k) . '" rows="' . (strlen($val) > 140 ? 4 : 2) . '">' . h($val) . '</textarea></label>' . ($t['value'] !== null ? '<span class="muted small">Edited. Original: ' . h(mb_strimwidth($t['default'], 0, 120, '…')) . '</span>' : '') . '</div>'; }
        echo '<div class="sticky"><button class="btn">Save and publish all texts</button></div></form>';
        break;
    case 'news':
        $all = news_all($S); $editId = (string)($_GET['edit'] ?? ''); $isNew = isset($_GET['new']); $cur = null;
        foreach ($all as $a) if ($a['id'] === $editId) $cur = $a;
        if ($cur || $isNew) {
            $a = $cur ?? ['id' => '', 'title' => '', 'date' => date('Y-m-d'), 'summary' => '', 'body' => '', 'status' => 'published', 'gallery' => []];
            echo '<h1>' . ($cur ? 'Edit article' : 'New article') . '</h1><p><a href="?page=news">← All articles</a></p><form method="post" enctype="multipart/form-data" class="card">' . csrf_field() . '<input type="hidden" name="action" value="news_save"><input type="hidden" name="id" value="' . h($a['id']) . '">';
            echo '<div class="grid2"><label>Headline<input name="title" required maxlength="200" value="' . h($a['title']) . '"></label><label>Date<input type="date" name="date" value="' . h($a['date']) . '"></label></div>';
            echo '<label>Short summary (shown on the news cards, optional)<textarea name="summary" rows="2" maxlength="300">' . h($a['summary'] ?? '') . '</textarea></label>';
            echo '<label>Article text<textarea name="body" rows="14" placeholder="Write the article here. Leave a blank line between paragraphs. Start a line with ## to make a sub-heading.">' . h($a['body'] ?? '') . '</textarea></label><p class="muted small">Tip: blank line = new paragraph · a line starting with <code>## </code> = sub-heading.</p>';
            echo '<h3>Cover photo</h3><div class="row">'; $cv = $a['cover'] ?? ($a['gallery'][0] ?? ''); if ($cv) echo '<img src="' . h(site_url_path($cv)) . '" alt="" style="height:90px;border-radius:8px">'; echo '<label class="small">Upload a new cover<input type="file" name="cover" accept="image/jpeg,image/png,image/webp"></label></div><p class="muted small">If you do not choose a cover, the first gallery photo is used.' . ($cv ? '' : '') . '</p>';
            echo '<h3>Photo gallery</h3>'; if (!empty($a['gallery'])) { echo '<p class="muted small">Order: smaller number first. Tick "remove" to delete a photo from the article. "Use as cover" picks it as the cover.</p><div class="libgrid">'; foreach ($a['gallery'] as $i => $src) echo '<div class="libitem"><img src="' . h(site_url_path($src)) . '" alt="" loading="lazy"><label class="small">Order<input type="number" name="pos[' . $i . ']" value="' . ($i + 1) . '" style="width:70px"></label><label class="chk small"><input type="radio" name="cover_pick" value="' . h($src) . '"' . (($a['cover'] ?? '') === $src ? ' checked' : '') . '> Use as cover</label><label class="chk small"><input type="checkbox" name="rm[' . $i . ']" value="1"> Remove</label></div>'; echo '</div>'; }
            echo '<label>Add photos (you can choose many at once)<input type="file" name="photos[]" multiple accept="image/jpeg,image/png,image/webp"></label><p class="muted small">Server upload limit per request: <b>' . fmt_bytes(upload_limit()) . '</b>. If many large photos fail, upload fewer at a time.</p>';
            echo '<h3>Video (optional)</h3><p class="muted small">' . (!empty($a['video']) ? 'Current: <code>' . h($a['video']) . '</code> <label class="chk small"><input type="checkbox" name="video_clear" value="1"> remove</label>' : 'None yet.') . '</p><div class="grid2"><label>Upload a short MP4/WebM<input type="file" name="video" accept="video/mp4,video/webm"></label><label>…or YouTube / Vimeo link<input name="video_url" placeholder="https://www.youtube.com/watch?v=…"></label></div>';
            echo '<h3>Visibility</h3><label>Status<select name="status"><option value="published"' . (($a['status'] ?? '') !== 'draft' ? ' selected' : '') . '>Published – visible on the website</option><option value="draft"' . (($a['status'] ?? '') === 'draft' ? ' selected' : '') . '>Draft – hidden</option></select></label><div class="row"><button class="btn">Save</button>' . ($cur && ($a['status'] ?? '') !== 'draft' ? '<a class="btn ghost" target="_blank" rel="noopener" href="' . h(site_url_path('article.html?a=' . $a['slug'])) . '">View on website</a>' : '') . '</div></form>';
            if ($cur) echo '<form method="post" data-confirm="Delete this article permanently?" class="card">' . csrf_field() . '<input type="hidden" name="action" value="news_delete"><input type="hidden" name="id" value="' . h($a['id']) . '"><button class="link danger">Delete this article</button></form>';
            break;
        }
        echo '<h1>News</h1><p class="muted">Articles appear on the News page, and the <b>latest 3 published</b> articles appear in the news section of the home page.</p><p><a class="btn" href="?page=news&new=1">+ Write a new article</a></p>';
        if (!$all) echo '<div class="card muted">No articles yet.</div>';
        foreach ($all as $a) { $thumb = $a['cover'] ?? ($a['gallery'][0] ?? ''); echo '<div class="card row" style="align-items:center">' . ($thumb ? '<img src="' . h(site_url_path($thumb)) . '" alt="" style="width:110px;height:70px;object-fit:cover;border-radius:8px">' : '') . '<div style="flex:1;min-width:200px"><b>' . h($a['title']) . '</b><br><span class="muted small">' . h(date('d M Y', strtotime($a['date'] ?? 'now'))) . ' · ' . count($a['gallery'] ?? []) . ' photos · <span class="tag">' . (($a['status'] ?? '') === 'draft' ? 'draft' : 'published') . '</span></span></div><a class="btn sm ghost" href="?page=news&edit=' . h($a['id']) . '">Edit</a><form method="post" class="inl">' . csrf_field() . '<input type="hidden" name="action" value="news_status"><input type="hidden" name="id" value="' . h($a['id']) . '"><button class="btn sm ghost" name="to" value="' . (($a['status'] ?? '') === 'draft' ? 'published' : 'draft') . '">' . (($a['status'] ?? '') === 'draft' ? 'Publish' : 'Unpublish') . '</button></form></div>'; }
        break;
    case 'gallery':
        $G = $S['gallery'] ?? ['title' => '', 'interval' => 5, 'cards' => []];
        echo '<h1>Gallery sliders</h1><p class="muted">The photo cards on the home page ("' . h($G['title'] ?? '') . '"). Each card is a slider: it shows its photos one after another by itself, and visitors can also use the arrows, dots or swipe. Add as many photos as you like to each card.</p>';
        echo '<form method="post" class="card">' . csrf_field() . '<input type="hidden" name="action" value="gallery_settings"><div class="grid2"><label>Section heading on the website<input name="title" value="' . h($G['title'] ?? '') . '" maxlength="120"></label><label>Seconds between photos (2–20)<input type="number" name="interval" min="2" max="20" value="' . (int)($G['interval'] ?? 5) . '"></label></div><button class="btn sm">Save</button></form>';
        foreach (($G['cards'] ?? []) as $ci => $c) {
            echo '<form method="post" enctype="multipart/form-data" class="card" id="c' . h($c['id']) . '">' . csrf_field() . '<input type="hidden" name="action" value="gallery_card"><input type="hidden" name="id" value="' . h($c['id']) . '"><h3>Card ' . ($ci + 1) . ' <span class="muted small">(' . count($c['slides']) . ' photos)</span></h3>';
            if ($c['slides']) { echo '<div class="libgrid">'; foreach ($c['slides'] as $i => $sl) echo '<div class="libitem"><img src="' . h(site_url_path($sl['src'])) . '" alt="" loading="lazy"><label class="small">Title<input name="st[' . $i . ']" maxlength="80" value="' . h($sl['title'] ?? '') . '"></label><label class="small">Small text<input name="ss[' . $i . ']" maxlength="120" value="' . h($sl['sub'] ?? '') . '"></label><label class="small">Order<input type="number" name="pos[' . $i . ']" value="' . ($i + 1) . '" style="width:70px"></label><label class="chk small"><input type="checkbox" name="rm[' . $i . ']" value="1"> Remove</label></div>'; echo '</div>'; } else echo '<p class="muted">No photos yet.</p>';
            echo '<h3 style="margin-top:14px">Add photos</h3><label>Choose many photos at once<input type="file" name="photos[]" multiple accept="image/jpeg,image/png,image/webp"></label><div class="grid2"><label class="small">Title for the new photos (optional)<input name="new_title" maxlength="80"></label><label class="small">Small text for the new photos (optional)<input name="new_sub" maxlength="120"></label></div><p class="muted small">Upload limit per save: <b>' . fmt_bytes(upload_limit()) . '</b>. If many big photos fail, add fewer at a time.</p><button class="btn sm">Save this card</button></form>';
            echo '<form method="post" data-confirm="Delete this whole card and its photos?" style="margin:-6px 0 10px">' . csrf_field() . '<input type="hidden" name="action" value="gallery_delcard"><input type="hidden" name="id" value="' . h($c['id']) . '"><button class="link danger small">Delete card ' . ($ci + 1) . '</button></form>';
        }
        if (count($G['cards'] ?? []) < 6) echo '<form method="post">' . csrf_field() . '<input type="hidden" name="action" value="gallery_addcard"><button class="btn sm ghost">+ Add another card</button></form>';
        break;
    case 'services':
        $V = $S['services'] ?? ['interval' => 4, 'items' => []];
        echo '<h1>Service photos</h1><p class="muted">Each of the six services shows a photo slideshow on its card (home page and Services page) and on its own page. Add as many photos as you like; they change by themselves. To change the wording of a service, use <a href="?page=texts">Page texts</a>.</p>';
        echo '<form method="post" class="card">' . csrf_field() . '<input type="hidden" name="action" value="svc_settings"><label>Seconds between photos (2–20)<input type="number" name="interval" min="2" max="20" value="' . (int)($V['interval'] ?? 4) . '" style="max-width:140px"></label><button class="btn sm">Save</button></form>';
        foreach (service_defs() as $k => $n) {
            $list = $V['items'][$k] ?? [];
            echo '<form method="post" enctype="multipart/form-data" class="card" id="s-' . h($k) . '">' . csrf_field() . '<input type="hidden" name="action" value="svc_save"><input type="hidden" name="key" value="' . h($k) . '"><h3>' . h($n) . ' <span class="muted small">(' . count($list) . ' photos)</span></h3><div class="libgrid">';
            foreach ($list as $i => $x) echo '<div class="libitem"><img src="' . h(site_url_path($x['src'])) . '" alt="" loading="lazy"><label class="small">Order<input type="number" name="pos[' . $i . ']" value="' . ($i + 1) . '" style="width:70px"></label><label class="chk small"><input type="checkbox" name="rm[' . $i . ']" value="1"> Remove</label></div>';
            echo '</div><label>Add photos (choose many at once)<input type="file" name="photos[]" multiple accept="image/jpeg,image/png,image/webp"></label><p class="muted small">Upload limit per save: <b>' . fmt_bytes(upload_limit()) . '</b>.</p><button class="btn sm">Save ' . h($n) . '</button></form>';
        }
        break;
    case 'chairman':
        $m = $S['media']['chair'] ?? ['src' => '', 'pos' => 'center 18%']; $T = $S['text'] ?? []; $val = fn($k) => $T[$k]['value'] ?? ($T[$k]['default'] ?? '');
        echo '<h1>Chairman section</h1><p class="muted">The portrait, quote, name and title shown on the home and About pages. Use a clear, recent head-and-shoulders photo (portrait or square, at least 800 px tall) with a plain background for the best result.</p><form method="post" enctype="multipart/form-data" class="card">' . csrf_field() . '<input type="hidden" name="action" value="chairman_save">';
        echo '<div class="row" style="align-items:flex-start;gap:24px"><div><b class="small">Current photo</b><br><img id="chairPrev" src="' . h(site_url_path($m['src'])) . '" alt="" style="width:200px;height:240px;object-fit:cover;object-position:' . h($m['pos'] ?? 'center 18%') . ';border-radius:12px;margin-top:6px"></div><div style="flex:1;min-width:240px"><label>Upload a new portrait (JPG, PNG or WebP)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp"></label><label>Which part of the photo to keep when it is cropped<select name="focus"><option value="face"' . (($m['pos'] ?? '') === 'center 18%' ? ' selected' : '') . '>Face and shoulders (recommended)</option><option value="top"' . (($m['pos'] ?? '') === 'center 5%' ? ' selected' : '') . '>Top of the photo</option><option value="center"' . (($m['pos'] ?? '') === 'center' ? ' selected' : '') . '>Centre</option></select></label>' . (!empty($m['original']) && $m['original'] !== $m['src'] ? '<button class="btn sm ghost" name="reset" value="1">Restore the original photo</button>' : '') . '</div></div>';
        echo '<label>Quote<textarea name="quote_text" rows="2" maxlength="600">' . h($val('quote_text')) . '</textarea></label><div class="grid2"><label>Name<input name="quote_name" maxlength="100" value="' . h($val('quote_name')) . '"></label><label>Title<input name="quote_role" maxlength="120" value="' . h($val('quote_role')) . '"></label></div><button class="btn">Save and publish</button></form>';
        break;
    case 'media':
        $lib = uploaded_files(); $groups = [];
        foreach (($S['media'] ?? []) as $k => $m) $groups[$m['group'] ?? 'Other'][$k] = $m;
        echo '<h1>Photos</h1><p class="muted">Replace any photo on the website. Choose a new picture (JPG, PNG or WebP). It is resized and optimised automatically. Use landscape photos for best results. Server upload limit: <b>' . fmt_bytes(upload_limit()) . '</b>.</p>';
        echo '<nav class="jump">' . implode('', array_map(fn($g) => '<a href="#g-' . h(slug($g)) . '">' . h($g) . '</a>', array_keys($groups))) . '<a href="#library">Photo library</a></nav>';
        foreach ($groups as $g => $items) { echo '<h2 id="g-' . h(slug($g)) . '">' . h($g) . '</h2><div class="slots">'; foreach ($items as $k => $m) { echo '<form class="slot card" method="post" enctype="multipart/form-data" id="' . h($k) . '">' . csrf_field() . '<input type="hidden" name="action" value="media_replace"><input type="hidden" name="key" value="' . h($k) . '"><img src="' . h(site_url_path($m['src'])) . '" alt="" loading="lazy"><b>' . h($m['label']) . '</b><label class="small">Choose a new photo<input type="file" name="photo" accept="image/jpeg,image/png,image/webp"></label>'; if ($lib) { echo '<label class="small">…or pick from library<select name="library"><option value="">—</option>'; foreach (array_slice($lib, 0, 60) as $f) echo '<option value="' . h($f['path']) . '">' . h(basename($f['path'])) . ' (' . h(date('d M', $f['time'])) . ')</option>'; echo '</select></label>'; } echo '<label class="small">Description (for accessibility &amp; Google)<input name="alt" value="' . h($m['alt'] ?? '') . '"></label><div class="row"><button class="btn sm">Save</button>' . (!empty($m['original']) && $m['original'] !== $m['src'] ? '<button class="btn sm ghost" name="reset" value="1">Restore original</button>' : '') . '</div></form>'; } echo '</div>'; }
        echo '<h2 id="library">Photo library</h2><form method="post" enctype="multipart/form-data" class="card">' . csrf_field() . '<input type="hidden" name="action" value="library_upload"><label>Add several photos at once<input type="file" name="photos[]" multiple accept="image/jpeg,image/png,image/webp"></label><button class="btn sm">Upload to library</button></form><div class="libgrid">';
        $used = used_paths($S); foreach ($lib as $f) { if (str_contains($f['path'], '/videos/')) continue; echo '<div class="libitem"><img src="' . h(site_url_path($f['path'])) . '" alt="" loading="lazy"><small>' . h(basename($f['path'])) . '<br>' . fmt_bytes($f['size']) . (isset($used[$f['path']]) ? ' · <b>in use</b>' : '') . '</small>' . (isset($used[$f['path']]) ? '' : '<form method="post" data-confirm="Delete this photo?">' . csrf_field() . '<input type="hidden" name="action" value="library_delete"><input type="hidden" name="path" value="' . h($f['path']) . '"><button class="link danger">Delete</button></form>') . '</div>'; }
        echo '</div>';
        break;
    case 'videos':
        echo '<h1>Videos</h1><p class="muted">Upload a short MP4/WebM video, or paste a YouTube/Vimeo link. Keep videos short (under 1–2 minutes) so pages stay fast. Upload limit on this server: <b>' . fmt_bytes(min(upload_limit(), (int)cfg('max_video_mb', 100) * 1048576)) . '</b>.</p>';
        foreach (($S['videos'] ?? []) as $k => $v) { echo '<form class="card" method="post" enctype="multipart/form-data">' . csrf_field() . '<input type="hidden" name="action" value="video_save"><input type="hidden" name="key" value="' . h($k) . '"><h3>' . h($v['label']) . '</h3><p class="muted small">Current: <code>' . h($v['src']) . '</code></p>'; if (!str_starts_with($v['src'], 'http')) echo '<video src="' . h(site_url_path($v['src'])) . '" controls preload="none" style="max-width:360px;border-radius:8px"></video>'; echo '<div class="grid2"><label>Title shown in the player<input name="title" value="' . h($v['title'] ?? '') . '"></label><label>Upload new video (MP4/WebM)<input type="file" name="video" accept="video/mp4,video/webm"></label><label>…or YouTube / Vimeo link<input name="url" placeholder="https://www.youtube.com/watch?v=…"></label></div><button class="btn sm">Save video</button></form>'; }
        break;
    case 'version':
        $ro = !$isOwner; $rules = switch_rules_present(); $all = sites_all(); $liveId = live_id(); $dis = $ro ? ' disabled' : '';
        $btn = function (string $act, array $f, string $label, string $cls = 'btn sm', string $confirm = '', bool $off = false) use ($dis): string { $h2 = ''; foreach ($f as $k => $v) $h2 .= '<input type="hidden" name="' . h($k) . '" value="' . h($v) . '">'; return '<form method="post" class="inl"' . ($confirm ? ' data-confirm="' . h($confirm) . '"' : '') . '>' . csrf_field() . '<input type="hidden" name="action" value="' . $act . '">' . $h2 . '<button class="' . $cls . '"' . ($off || $dis ? ' disabled' : '') . '>' . h($label) . '</button></form>'; };
        echo '<h1>Websites</h1><div class="status ' . ($liveId ? 'good' : 'warn') . '"><b>' . ($liveId ? 'LIVE NOW: ' . h(site_label($liveId)) : 'LIVE NOW: the OLD website') . '</b><span>This is what everyone sees at ' . h(preg_replace('#^https?://#', '', (string)cfg('site_url', ''))) . '. You can switch at any time; nothing is copied or deleted.</span></div>';
        if ($ro) echo '<p class="muted">Only the owner can change this.</p>';
        if (!$rules) echo '<div class="flash err">The switch rules are missing from the main .htaccess. ' . $btn('site_repair', [], 'Install / repair them') . '</div>';
        echo '<div class="card"><table><tr><th>Website</th><th>Status</th><th>Actions</th></tr>';
        echo '<tr><td><b>Old website</b><br><span class="muted small">The original WordPress site</span></td><td>' . (!$liveId ? '<span class="okc">● LIVE</span>' : '<span class="muted">not live</span>') . '</td><td class="acts">' . $btn('site_live', ['to' => '_old'], 'Make live', 'btn sm', 'Show the OLD website to all visitors now?', !$liveId) . $btn('preview', ['site' => '_old'], 'Preview', 'btn sm ghost') . '</td></tr>';
        foreach ($all as $s2) {
            $id = $s2['id'];
            echo '<tr><td><b>' . h($s2['label']) . '</b><br><span class="muted small">/_sites/' . h($id) . ($s2['editable'] ? ' · edited in this admin' : '') . ($s2['index'] ? '' : ' · <span class="errc">no index file</span>') . '</span></td><td>' . ($s2['live'] ? '<span class="okc">● LIVE</span>' : '<span class="muted">not live</span>') . ($s2['registered'] ? '' : '<br><span class="small errc">not registered</span>') . '</td><td class="acts">';
            if (!$s2['registered']) echo $btn('site_register', ['id' => $id, 'label' => $id], 'Register');
            else echo $btn('site_live', ['to' => $id], 'Make live', 'btn sm', 'Show "' . $s2['label'] . '" to all visitors now?', $s2['live'] || !$s2['index']) . $btn('preview', ['site' => $id], 'Preview', 'btn sm ghost');
            echo '<details class="more"><summary>More</summary>';
            echo '<form method="post" class="inl">' . csrf_field() . '<input type="hidden" name="action" value="site_rename"><input type="hidden" name="id" value="' . h($id) . '"><input name="label" value="' . h($s2['label']) . '" maxlength="60"><button class="btn sm ghost"' . $dis . '>Rename</button></form>';
            if (!$s2['editable']) echo '<form method="post" enctype="multipart/form-data" class="inl" data-confirm="Replace all files of this website with the zip? The previous files are kept as a backup.">' . csrf_field() . '<input type="hidden" name="action" value="site_replace"><input type="hidden" name="id" value="' . h($id) . '"><input type="hidden" name="label" value="' . h($s2['label']) . '"><input type="file" name="zip" accept=".zip"><button class="btn sm ghost"' . $dis . '>Replace files</button></form>' . $btn('site_delete', ['id' => $id], 'Delete', 'btn sm danger', 'Delete this website and all its files? This cannot be undone.', $s2['live']);
            echo '</details></td></tr>';
        }
        echo '</table>';
        if (!empty($liveId) || true) echo '<form method="post" class="inl">' . csrf_field() . '<input type="hidden" name="action" value="preview_end"><button class="btn sm ghost">End my preview</button></form>';
        echo '</div>';
        echo '<form method="post" enctype="multipart/form-data" class="card">' . csrf_field() . '<input type="hidden" name="action" value="site_add"><h3>Add another website</h3><p class="muted">Upload a .zip of any website (it needs an index.html or index.php at the top). It is added next to the others and is <b>not live</b> until you press Make live. Maximum upload on this server: ' . h(fmt_bytes(upload_limit())) . '.' . (class_exists('ZipArchive') ? '' : ' <span class="errc">Zip support is missing on this server: upload the files with File Manager into the _sites folder, then press Register.</span>') . '</p><div class="grid2"><label>Name<input name="label" maxlength="60" placeholder="e.g. CSS Group 2027 design"></label><label>Zip file<input type="file" name="zip" accept=".zip"></label></div><button class="btn"' . $dis . '>Add website</button></form>';
        echo '<div class="card"><h3>Good to know</h3><ul class="small"><li><b>Make live</b> switches instantly. Press <b>Make live</b> on the Old website to go back.</li><li><b>Preview</b> shows you only (2 hours) one website while visitors keep seeing the live one.</li><li>Photos, texts, news and the maintenance page in this admin change the website marked "edited in this admin" only.</li><li>You can also copy a website folder into <b>public_html/_sites/</b> with File Manager. It appears here, press Register.</li><li>The old WordPress still has its own login at /wp-admin.</li></ul></div>';
        break;
    case 'maintenance':
        $m = $S['maintenance'] ?? []; $on = maintenance_is_on(); $ro = !$isOwner;
        echo '<h1>Website mode</h1><div class="status ' . ($on ? 'warn' : 'good') . '"><b>' . ($on ? 'MAINTENANCE MODE IS ON' : 'THE WEBSITE IS LIVE') . '</b><span>' . ($on ? 'Visitors see the maintenance page. Search engines are told to come back later.' : 'Everyone can see the website.') . '</span></div>';
        if ($ro) echo '<p class="muted">Only the owner can change this.</p>';
        echo '<form method="post" class="card">' . csrf_field() . '<input type="hidden" name="action" value="maintenance"><div class="grid2"><label>Page headline<input name="title" value="' . h($m['title'] ?? 'We will be back soon') . '"></label><label>Expected back (optional)<input name="until" placeholder="e.g. Saturday 10 AM" value="' . h($m['until'] ?? '') . '"></label></div><label>Message to visitors<textarea name="message" rows="3">' . h($m['message'] ?? 'Our website is being updated. Thank you for your patience.') . '</textarea></label><label>Contact email shown (optional)<input name="memail" value="' . h($m['email'] ?? ($S['contact']['email'] ?? '')) . '"></label><div class="row">' . ($on ? '<button class="btn" name="mode" value="off"' . ($ro ? ' disabled' : '') . '>Go LIVE (turn maintenance off)</button><button class="btn ghost" name="mode" value="on"' . ($ro ? ' disabled' : '') . '>Save message (stay in maintenance)</button>' : '<button class="btn warnb" name="mode" value="on"' . ($ro ? ' disabled' : '') . '>Turn maintenance ON</button>') . '</div></form>';
        echo '<form method="post" class="card">' . csrf_field() . '<input type="hidden" name="action" value="preview"><h3>Preview the live site while in maintenance</h3><p class="muted">Opens the real website for you only (for 2 hours) while visitors still see the maintenance page.</p><button class="btn sm">Preview live site</button></form>';
        break;
    case 'submissions':
        $rows = read_submissions(); $n = count($rows); $rows = array_slice($rows, 0, 200);
        echo '<h1>Form messages</h1><p class="muted">Everything sent through the website forms (also emailed to the company inbox). ' . $n . ' in total' . ($n > 200 ? ' (showing the latest 200)' : '') . '. <a href="?page=submissions&csv=1">Download as spreadsheet (CSV)</a></p>';
        if (!$rows) echo '<div class="card muted">No messages yet.</div>';
        foreach ($rows as $r) { $f = $r['fields'] ?? []; echo '<div class="card sub"><div class="subhead"><b>' . h($f['name'] ?? '—') . '</b> <span class="tag">' . h($r['type'] ?? '') . '</span><span class="muted small">' . h(date('d M Y H:i', strtotime($r['time'] ?? 'now'))) . '</span></div><p class="small">' . h($f['email'] ?? '') . ' ' . (!empty($f['phone']) ? '· ' . h($f['phone']) : '') . '</p>'; foreach ($f as $k => $v) { if (in_array($k, ['name', 'email', 'phone', 'page'], true) || $v === '') continue; echo '<p><span class="muted small">' . h($k) . ':</span> ' . nl2br(h($v)) . '</p>'; } echo '<form method="post" data-confirm="Delete this message?">' . csrf_field() . '<input type="hidden" name="action" value="sub_delete"><input type="hidden" name="time" value="' . h($r['time'] ?? '') . '"><button class="link danger">Delete</button></form></div>'; }
        break;
    case 'account':
        $u = find_user($user['username']);
        echo '<h1>My account</h1><div class="card"><h3>Change password</h3><form method="post">' . csrf_field() . '<input type="hidden" name="action" value="password"><div class="grid2"><label>Current password<input type="password" name="old" required autocomplete="current-password"></label><label>New password (12+ characters)<input type="password" name="new" required minlength="12" autocomplete="new-password"></label><label>Repeat new password<input type="password" name="new2" required minlength="12" autocomplete="new-password"></label></div><button class="btn sm">Change password</button></form></div>';
        echo '<div class="card"><h3>Two-step sign-in (recommended)</h3>';
        if (!empty($u['totp'])) echo '<p>Status: <b class="okc">ON</b>. You need a code from your phone app at every sign-in.</p><form method="post">' . csrf_field() . '<input type="hidden" name="action" value="totp_off"><label>Enter your password to turn it off<input type="password" name="pw" required></label><button class="btn sm ghost">Turn off</button></form>';
        elseif (!empty($_SESSION['totp_pending'])) { $sec = $_SESSION['totp_pending']; echo '<p>1. Open Google Authenticator / Microsoft Authenticator → add account → <b>enter a setup key</b>.</p><p>Key: <code class="big">' . h(chunk_split($sec, 4, ' ')) . '</code> (time-based)</p><p>2. Type the 6-digit code it shows:</p><form method="post">' . csrf_field() . '<input type="hidden" name="action" value="totp_confirm"><label>Code<input name="code" inputmode="numeric" maxlength="8" required></label><button class="btn sm">Confirm and turn on</button></form>'; }
        else echo '<p>Adds a 6-digit code from your phone to every sign-in, so a stolen password alone cannot open the admin.</p><form method="post">' . csrf_field() . '<input type="hidden" name="action" value="totp_start"><button class="btn sm">Set up two-step sign-in</button></form>';
        echo '</div>';
        break;
    case 'users':
        require_owner(); echo '<h1>Users</h1><p class="muted"><b>Owner</b>: everything, including maintenance mode, users and restore. <b>Editor</b>: photos, videos, texts, contact details and messages.</p><div class="card"><table><tr><th>User</th><th>Role</th><th>2-step</th><th></th></tr>';
        foreach (users() as $x) echo '<tr><td>' . h($x['username']) . '</td><td>' . h($x['role']) . '</td><td>' . (!empty($x['totp']) ? 'on' : 'off') . '</td><td class="right"><form method="post" class="inl">' . csrf_field() . '<input type="hidden" name="action" value="user_reset"><input type="hidden" name="username" value="' . h($x['username']) . '"><input type="password" name="password" placeholder="new password (12+)" minlength="12" required><button class="link">Reset password</button></form> <form method="post" class="inl" data-confirm="Remove this user?">' . csrf_field() . '<input type="hidden" name="action" value="user_remove"><input type="hidden" name="username" value="' . h($x['username']) . '"><button class="link danger">Remove</button></form></td></tr>';
        echo '</table></div><div class="card"><h3>Add a user</h3><form method="post">' . csrf_field() . '<input type="hidden" name="action" value="user_add"><div class="grid2"><label>Username<input name="username" required></label><label>Password (12+ characters)<input type="password" name="password" required minlength="12" autocomplete="new-password"></label><label>Role<select name="role"><option value="editor">Editor</option><option value="owner">Owner</option></select></label></div><button class="btn sm">Add user</button></form></div>';
        break;
    case 'history':
        require_owner(); $files = glob(DATA_DIR . '/history/site-*.json') ?: []; rsort($files);
        echo '<h1>History &amp; activity</h1><div class="card"><h3>Earlier versions of your settings</h3><p class="muted small">A copy is saved automatically before every change (last 40). Restoring puts those texts, photos, contact details and settings back on the live website.</p>';
        if (!$files) echo '<p class="muted">No earlier versions yet.</p>'; foreach (array_slice($files, 0, 25) as $f) { $b = basename($f); echo '<form method="post" class="inl row" data-confirm="Restore this version on the live website?">' . csrf_field() . '<input type="hidden" name="action" value="restore"><input type="hidden" name="file" value="' . h($b) . '"><span>' . h(preg_replace('/^site-(\d{4})(\d\d)(\d\d)-(\d\d)(\d\d)(\d\d).*$/', '$3/$2/$1 $4:$5', $b)) . '</span><button class="link">Restore</button></form>'; }
        echo '</div><div class="card"><h3>Activity log</h3><table><tr><th>When</th><th>Who</th><th>What</th><th>IP</th></tr>'; $lines = is_file(DATA_DIR . '/audit.log') ? array_slice(file(DATA_DIR . '/audit.log', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES), -80) : []; foreach (array_reverse($lines) as $l) { $r = json_decode($l, true); if ($r) echo '<tr><td>' . h(date('d M H:i', strtotime($r['t']))) . '</td><td>' . h($r['u']) . '</td><td>' . h($r['a']) . '</td><td class="muted small">' . h($r['ip']) . '</td></tr>'; } echo '</table></div>';
        break;
    case 'health':
        $root = site_root(); $checks = [
            ['Website folder found', is_dir($root) && is_file($root . '/index.html'), $root, 'Set site_root in app/config.php to the folder of the NEW website (usually /home/USERNAME/public_html/_sites/css-new).'],
            ['Can update config.js', is_writable($root) && (!is_file($root . '/config.js') || is_writable($root . '/config.js')), '', 'Make the website folder writable (permissions 755, owned by your cPanel user).'],
            ['Photos folder is safe', is_file($root . '/images/uploads/.htaccess'), '', 'Press the button below to create it.'],
            ['Image library (GD) available', function_exists('imagecreatefromstring'), '', 'cPanel → Select PHP Version → tick "gd".'],
            ['Admin data folder is private', !is_file(DATA_DIR . '/../public/data/users.json'), '', ''],
            ['HTTPS', is_https() || php_sapi_name() === 'cli-server', '', 'Install the SSL certificate for this address (cPanel → SSL/TLS Status → Run AutoSSL).'],
            ['PHP version ≥ 8.0', PHP_VERSION_ID >= 80000, PHP_VERSION, 'cPanel → Select PHP Version → choose 8.1 or newer.'],
            ['Maintenance rules present in the new site .htaccess', is_file($root . '/.htaccess') && str_contains((string)file_get_contents($root . '/.htaccess'), 'maintenance.flag'), '', 'Upload the new website package into the _sites/css-new folder (it contains that .htaccess).'],
            ['Old/new switch rules installed in the main .htaccess', switch_rules_present(), root_dir() . '/.htaccess', 'Open Websites and press "Install / repair them" (or run: php ~/cssgroup-admin/app/install_switch.php).'],
            ['Main web folder writable (for the switch)', is_writable(root_dir() . '/.htaccess') || (!is_file(root_dir() . '/.htaccess') && is_writable(root_dir())), '', 'Make public_html/.htaccess writable by your cPanel user (permissions 644, owner = you).'],
            ['Admin and website secrets match', is_file($root . '/.htaccess') && str_contains((string)file_get_contents($root . '/.htaccess'), (string)cfg('preview_token')), '', 'The preview token in app/config.php must equal the one in the new site .htaccess.'],
            ['Form messages file readable', !is_file(submissions_file()) || is_readable(submissions_file()), '', ''],
        ];
        echo '<h1>Health check</h1><p class="muted">Everything here should be green. If something is red, follow the hint.</p><div class="card"><table>'; foreach ($checks as [$n, $ok, $d, $hint]) echo '<tr><td class="' . ($ok ? 'okc' : 'errc') . '">' . ($ok ? '✔' : '✖') . '</td><td>' . h($n) . ($d ? ' <span class="muted small">' . h($d) . '</span>' : '') . ($ok ? '' : '<br><span class="small errc">' . h($hint) . '</span>') . '</td></tr>'; echo '</table><form method="post">' . csrf_field() . '<input type="hidden" name="action" value="fix_uploads"><button class="btn sm">Create / repair photos folder protection</button></form></div>';
        echo '<div class="card"><h3>Server limits</h3><p class="small">Upload limit: <b>' . fmt_bytes(upload_limit()) . '</b> · PHP ' . h(PHP_VERSION) . ' · Time zone ' . h(date_default_timezone_get()) . '</p></div>';
        break;
    default: $page = 'dashboard';
        $subs = read_submissions(); $week = count(array_filter($subs, fn($r) => strtotime($r['time'] ?? '0') > time() - 7 * 86400)); $on = maintenance_is_on();
        echo '<h1>Hello, ' . h($user['username']) . '</h1><div class="status ' . ($on ? 'warn' : 'good') . '"><b>' . ($on ? 'Website is in MAINTENANCE MODE' : 'Website is LIVE') . '</b><a class="btn sm" href="?page=maintenance">' . ($on ? 'Go live' : 'Maintenance mode') . '</a></div><div class="status ' . (switch_is_live() ? 'good' : 'warn') . '"><b>' . (switch_is_live() ? 'Live: ' . h(site_label((string)live_id())) : 'Live: the OLD website') . '</b><a class="btn sm" href="?page=version">Websites</a></div><div class="tiles">';
        $tiles = [['?page=media', 'Photos', 'Replace pictures on any page'], ['?page=videos', 'Videos', 'Upload or link a video'], ['?page=news', 'News', 'Write, edit and publish articles'], ['?page=services', 'Service photos', 'Slideshow for each service'], ['?page=gallery', 'Gallery sliders', 'Photo cards that change by themselves'], ['?page=chairman', 'Chairman', 'Portrait, quote, name and title'], ['?page=texts', 'Page texts', 'Edit headings and paragraphs'], ['?page=settings', 'Contact details', 'Phone, email, offices, banner'], ['?page=submissions', 'Form messages', $week . ' new in the last 7 days (' . count($subs) . ' total)'], ['?page=maintenance', 'Website mode', $on ? 'Maintenance is ON' : 'Live']];
        foreach ($tiles as [$u2, $t, $d]) echo '<a class="tile" href="' . h($u2) . '"><b>' . h($t) . '</b><span>' . h($d) . '</span></a>'; echo '</div>';
        echo '<div class="card"><p class="small muted">Last change: ' . h(isset($S['updated']) ? date('d M Y H:i', strtotime($S['updated'])) . ' by ' . ($S['updated_by'] ?? '') : '—') . ' · <a href="' . h(cfg('site_url', '#')) . '" target="_blank" rel="noopener">View website</a></p></div>';
}
$body = ob_get_clean();
layout_app($page, $body, $user, $isOwner);

/* ================= helpers & layout ================= */
function clean_line($v, int $max): string { $v = is_string($v) ? $v : ''; $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v); return mb_substr(trim($v), 0, $max); }
function safe_url($v): string { $v = trim(is_string($v) ? $v : ''); if ($v === '') return ''; if (preg_match('#^(https?://|/)[^\s"<>]*$#i', $v)) return mb_substr($v, 0, 300); return ''; }
function slug(string $s): string { return strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $s), '-')); }
function csv_safe(string $s): string { return preg_match('/^[=+\-@\t\r]/', $s) ? "'" . $s : $s; }
function site_url_path(string $rel): string { return rtrim((string)cfg('site_url', ''), '/') . '/' . ltrim($rel, '/'); }
function reorder_files(array $f): array { if (!isset($f['name']) || !is_array($f['name'])) return isset($f['name']) ? [$f] : []; $o = []; foreach ($f['name'] as $i => $n) $o[] = ['name' => $n, 'type' => $f['type'][$i], 'tmp_name' => $f['tmp_name'][$i], 'error' => $f['error'][$i], 'size' => $f['size'][$i]]; return $o; }
function layout_public(string $title, string $inner): void { echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' . h($title) . ' – CSS Group admin</title><link rel="stylesheet" href="admin.css"></head><body class="pub"><main class="authbox"><img class="mark" src="logo.png" alt="CSS Group" height="64">' . $inner . '</main></body></html>'; }
function layout_app(string $page, string $body, array $user, bool $isOwner): void {
    $nav = ['dashboard' => 'Dashboard', 'media' => 'Photos', 'videos' => 'Videos', 'news' => 'News', 'services' => 'Service photos', 'gallery' => 'Gallery sliders', 'chairman' => 'Chairman', 'texts' => 'Page texts', 'settings' => 'Contact details', 'submissions' => 'Form messages', 'version' => 'Websites', 'maintenance' => 'Website mode']; if ($isOwner) { $nav['users'] = 'Users'; $nav['history'] = 'History'; } $nav['health'] = 'Health check'; $nav['account'] = 'My account';
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Admin – CSS Group</title><link rel="stylesheet" href="admin.css"></head><body><aside><div class="brand"><img src="logo.png" alt="CSS Group" height="34"> <small>admin</small></div><nav>';
    foreach ($nav as $k => $v) echo '<a href="?page=' . $k . '"' . ($page === $k ? ' class="on"' : '') . '>' . h($v) . '</a>';
    echo '</nav><div class="me">' . h($user['username']) . ' (' . h($user['role']) . ')<form method="post" action="?page=logout">' . csrf_field() . '<button class="link">Sign out</button></form></div></aside><main>';
    foreach (take_flash() as [$t, $m]) echo '<div class="flash ' . h($t) . '">' . h($m) . '</div>';
    echo $body . '</main><script src="admin.js"></script></body></html>';
}
