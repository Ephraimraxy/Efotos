# Web 8 – Consult (Business)

Business consulting website (blue/orange Consult template). `about.html` replicates the About page mockup; also home, services, projects (filter + lightbox), contact, quote modal.

Pages: `index.html`, `about.html`, `services.html`, `projects.html`, `contact.html` · `admin.html` (form inbox)

## Run
```bash
cd "web 8"
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
