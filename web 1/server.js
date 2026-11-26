// Zero-dependency server for Web 1: serves the site and stores form submissions.
//   npm start                      -> http://localhost:3000
//   ADMIN_TOKEN=secret npm start   -> enables /admin.html to read submissions
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, DATA = path.join(ROOT, 'data'), FILE = path.join(DATA, 'submissions.json');
const PORT = process.env.PORT || 3000, TOKEN = process.env.ADMIN_TOKEN || '';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const PRIVATE = /^\/(data|server\.js|package\.json|node_modules|\.)/;
const hits = new Map(); // naive per-IP rate limit: 8 submissions / 10 min

const load = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return []; } };
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); };
const clean = (v, n) => String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);

function readBody(req) {
  return new Promise((ok, no) => { let b = ''; req.on('data', c => { b += c; if (b.length > 20000) { no(new Error('too large')); req.destroy(); } }); req.on('end', () => ok(b)); req.on('error', no); });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x'); let p = decodeURIComponent(url.pathname);

  if (p === '/api/forms' && req.method === 'POST') {
    const ip = req.socket.remoteAddress, now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < 600000);
    if (recent.length >= 8) return send(res, 429, { error: 'Too many requests' });
    try {
      const d = JSON.parse(await readBody(req));
      if (d.website) return send(res, 200, { ok: true });            // honeypot: pretend success to bots
      const rec = { id: now.toString(36) + Math.random().toString(36).slice(2, 6), at: new Date().toISOString(), type: clean(d.type, 20) || 'contact', page: clean(d.page, 40),
        name: clean(d.name, 100), email: clean(d.email, 150), phone: clean(d.phone, 40), service: clean(d.service, 80), message: clean(d.message, 3000) };
      if (!rec.name || !/^\S+@\S+\.\S+$/.test(rec.email) || !rec.message) return send(res, 400, { error: 'Invalid form' });
      fs.mkdirSync(DATA, { recursive: true });
      const all = load(); all.push(rec); fs.writeFileSync(FILE, JSON.stringify(all, null, 2));
      recent.push(now); hits.set(ip, recent);
      console.log('New', rec.type, 'submission from', rec.email);
      return send(res, 200, { ok: true });
    } catch { return send(res, 400, { error: 'Bad request' }); }
  }

  if (p === '/api/submissions' && req.method === 'GET') {
    if (!TOKEN) return send(res, 403, { error: 'Set ADMIN_TOKEN to enable' });
    if (req.headers['x-admin-token'] !== TOKEN) return send(res, 401, { error: 'Unauthorized' });
    return send(res, 200, load().reverse());
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed' });
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT + path.sep) || PRIVATE.test(p)) return send(res, 404, 'Not found', 'text/plain');
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, '<h1>404</h1><p><a href="/">Back home</a></p>', 'text/html; charset=utf-8');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`Web 1 running at http://localhost:${PORT}`));
