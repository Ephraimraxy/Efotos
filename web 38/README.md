# Web 38 – Penny

Playful neo-brutalist teen money app site, confetti clicks, savings calculator. Fictional brand.

Pages: `index.html`, `teens.html`, `parents.html`, `help.html` · `admin.html` (form inbox)

## Run
```bash
cd "web 38"
npm start                              # http://localhost:3000 (Node 16+, nothing to install)
ADMIN_TOKEN=choose-a-secret npm start  # also enables /admin.html
```

## Replace photos, videos, text – ONE file: `config.js`
- Photos: change a key's `src` to `images/your-file.jpg` (drop the file in `images/`) or any URL.
- Videos: edit `window.VIDEOS` (YouTube/Vimeo link or .mp4).
- Contact details, social links: `window.SITE`.
- Colours / fonts: variables at the top of `theme.css`.

## Forms
All forms POST to `/api/forms` (saved in `data/submissions.json`, readable at `/admin.html` with your token).
On static hosting set `SITE.formEndpoint` in `config.js` (e.g. Formspree).
