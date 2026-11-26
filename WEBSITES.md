# Website templates (web 1 – web 9)

Each folder is a complete, standalone multi-page website with a zero-dependency Node server
(`cd "web N" && npm start`, then open http://localhost:3000). They do not touch the Efotos app.

| Folder | Site | Based on | Real features |
|---|---|---|---|
| `web 1` | Talento – recruitment | mockup 1 (Our Gallery page) | quote form, tabs, video player, pricing toggle |
| `web 2` | Eventen – startup conference | purple/pink event mockup | live countdown, ticket orders with total, schedule tabs, speaker filter |
| `web 3` | TravelPerk – travel booking | blue travel mockup | search form that filters tours, bookings with total, destinations, blog |
| `web 4` | Creatix – creative agency | black/lime agency mockup | services tabs, project filter + lightbox, reviews carousel, project brief form |
| `web 5` | Eventics – business conference | blue conference mockup | countdown, day-by-day schedule, tickets with total, gallery lightbox |
| `web 6` | Wexico – accounting firm | orange/navy accounting mockup | free-call booking modal, services tabs, pricing, blog |
| `web 7` | Consult – tax consulting | teal tax mockup | free-consult form in the hero, practice-area tabs, testimonials |
| `web 8` | Consult – business consulting | blue About-page mockup | quote modal, services tabs, project filter + lightbox (`about.html` = the mockup) |
| `web 9` | Balanza – work-life balance | green wellness mockup | consultation booking modal, programmes tabs, pricing, FAQ |

## Replacing photos and videos
Open `config.js` in the site's folder. Every photo has a key; change its `src` to `images/your-file.jpg`
(drop the file in that folder's `images/`) or to any URL. Videos (`window.VIDEOS`) accept YouTube/Vimeo
links or `.mp4` files. Company details live in `window.SITE`; colours and fonts at the top of `theme.css`.
Stock photos are from Unsplash (free licence).

## Forms
Every form posts to `/api/forms`; submissions are saved to `data/submissions.json` and can be read at
`/admin.html` after starting with `ADMIN_TOKEN=your-secret npm start`. On static hosting, set
`SITE.formEndpoint` in `config.js` (for example a Formspree URL).
