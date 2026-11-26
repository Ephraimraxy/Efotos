# Web 1 – Talento (multi-page recruitment website)

Pages: `index.html` (Home) · `about.html` · `services.html` · `pricing.html` · `contact.html` · `gallery.html` (the "Our Gallery" mockup) · `admin.html` (form inbox)

## Run it
```bash
cd "web 1"
npm start                         # http://localhost:3000  (needs Node 16+, no installs)
ADMIN_TOKEN=choose-a-secret npm start   # also enables /admin.html
```
Opening the HTML files directly also works for browsing, but forms need the server (or an endpoint, below).

## Replace photos, videos & text – ONE file: `config.js`
- **Photos:** every image has a key (`hero-home`, `event-1`, `person-1` …). Change its `src`:
  - your own file: put it in `images/` and set `src: 'images/my-photo.jpg'`
  - or any URL. Add `fallback:` for a backup image.
- **Videos:** edit `window.VIDEOS`. `src` can be a YouTube/Vimeo link or an `.mp4` file/URL.
  (Current videos are a placeholder clip.)
- **Company info:** phone, email, address, opening hours, social links, copyright – `window.SITE`.
- Stock photos are from Unsplash (free licence, https://unsplash.com/license).

## Forms (real, working)
- Contact page + "Get A Quote" pop-up POST to `/api/forms`; `server.js` validates, rate-limits, ignores bots
  (honeypot) and saves to `data/submissions.json`.
- Read them at `/admin.html` with your `ADMIN_TOKEN`.
- On static hosting (Netlify, GitHub Pages…) paste a Formspree/other endpoint into `SITE.formEndpoint`.

## Files
`styles.css` design (1rem = 1px of the reference mockup at 736px; scales up to 1440px) · `site.js` header/footer/modals/forms · `server.js` backend
