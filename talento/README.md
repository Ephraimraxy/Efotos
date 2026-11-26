# Talento – Our Gallery page

Static site (HTML/CSS/JS, no build step). Open `index.html` or run `npx serve .`.

## Add your photos
Drop these into `images/` (they show a green gradient until present):
`hero.jpg` (1600x600), `event-1..4.jpg` (1000x600), `team-1.jpg`, `team-2.jpg`, `cta.jpg` (1600x500).

## Customize
- Videos: change `data-video="…"` (YouTube ID) on the cards in `index.html`.
- Quote form: set `FORM_ENDPOINT` in `script.js` (Formspree, Netlify, your API). Until set, submissions are saved to localStorage.
- Colors/fonts: CSS variables at top of `styles.css`.
