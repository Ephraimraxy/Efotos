# Website templates (web 1 – web 9)

Each folder is a complete, standalone multi-page website with a zero-dependency Node server
(`cd "web N" && npm start`, then open http://localhost:3000). They do not touch the Efotos app.
Every site has its own layout, navigation depth, page count, page length, photo set and motion personality.

| Folder | Site | Pages | Navigation | Home length | Motion personality |
|---|---|---|---|---|---|
| `web 1` | Talento – recruitment (green) | 6 | 5 items, all with sub-menus | short | soft fades, spotlight cards, glass captions, pop numbers |
| `web 2` | Eventen – startup conference (pink/purple) | 11 | 8 items, 5 sub-menus | very long | zoom reveals, neon glass, flip-tile live countdown, ring cursor, 3D tilt |
| `web 3` | TravelPerk – travel (blue) | 19 (10 tour pages) | 7 items + sub-menus | very long | blur reveals, glass search bar, light-blob cursor, animated flight path |
| `web 4` | Creatix – agency (black/lime) | 4 | 4 links, no sub-menus | medium | clip reveals, magnetic buttons, text-scramble, blend cursor, wipe hovers |
| `web 5` | Eventics – conference (blue) | 8 | 7 items, 2 sub-menus | very long | slide-in reveals, glass countdown, flip digits, spotlight, parallax |
| `web 6` | Wexico – accounting (orange) | 6 | 5 items, 1 sub-menu | very long | pop-in reveals, peach spotlight, shine sweep, floating glass chip |
| `web 7` | Consult – tax (teal, serif) | 6 | 6 items, 3-level dropdown | medium | image wipe reveals, underline draw, frosted form |
| `web 8` | Consult – business (blue/orange) | 8 | 6 items, 3-level dropdowns | short | slide reveals, orange line-grow hovers, glass mission cards |
| `web 9` | Balanza – wellbeing (green) | 5 | 5 links, no sub-menus | medium | blur-in, breathing glass tags, soft-dot cursor, floating glow |

## Replacing photos and videos
Open `config.js` in the site's folder. Every photo has a key; change its `src` to `images/your-file.jpg`
(drop the file in that folder's `images/`) or to any URL. Videos (`window.VIDEOS`) accept YouTube/Vimeo
links or `.mp4` files. Company details live in `window.SITE`; colours and fonts at the top of `theme.css`.
Stock photos are from Unsplash (free licence).

## Turning motion effects on/off
`config.js` also has `window.FX`: reveal style (`up/blur/zoom/left/clip/flip/slide/pop/fade`), 3D tilt,
spotlight, magnetic buttons, click ripple, word-by-word text reveal, text scramble, parallax and the
custom cursor (`ring/blob/dot/none`). Set any value to `''` to switch it off. Effects respect the
"reduce motion" setting and are disabled on touch screens where they don't make sense.

## Forms
Every form posts to `/api/forms`; submissions are saved to `data/submissions.json` and can be read at
`/admin.html` after starting with `ADMIN_TOKEN=your-secret npm start`. On static hosting, set
`SITE.formEndpoint` in `config.js` (for example a Formspree URL).

## Sites 10–25
Brand names and contact details in these sites are placeholders (several mock-ups were based on real companies).

| Folder | Brand | Type | Pages | Signature effect |
|---|---|---|---|---|
| web 10 | Paylane | Fintech app / global accounts | 5 | dot-field hero |
| web 11 | Atlas Properties | Residential real estate | 5 | plain (none) |
| web 12 | Rent H&U | Home rentals | 6 | glass bubble cursor |
| web 13 | RentXHome | Apartment rentals | 5 | magnifier lens |
| web 14 | Agriture | Agriculture | 5 | falling leaves |
| web 15 | Verdant Landscaping | Landscaping | 4 | plain (none) |
| web 16 | NavikX | Agritech platform | 6 | GPS crosshair |
| web 17 | Platinum Bank | Digital bank | 5 | plain (none) |
| web 18 | Jenny Scott | Designer portfolio | 5 | ink-trail cursor |
| web 19 | Eventra | Event management | 6 | confetti clicks |
| web 20 | Lucky Knot | Wedding services (Vietnamese) | 7 | petals on click |
| web 21 | Axion Bank | Banking & lending | 6 | 3D tilt cards |
| web 22 | Abdullah Tariq | Developer portfolio | 5 | rolling-letter buttons |
| web 23 | Planet Friendly Gardening | Gardening & shop | 7 | depth cursor |
| web 24 | Gretna Green | Wedding venue | 5 | plain (none) |
| web 25 | Agrigo | Smart agriculture | 7 | tilt cards |

## Sites 26–32 (longer pages)
| Folder | Brand | Type | Pages | Signature effect |
|---|---|---|---|---|
| web 26 | Farmora | Farm-tech & marketplace | 6 | sparkle cursor |
| web 27 | KidHope | Non-profit charity | 7 | confetti clicks |
| web 28 | Rivora Fresh | Online grocery (working cart) | 6 | tilt cards |
| web 29 | Verde Living Walls | Vertical gardens | 5 | falling leaves |
| web 30 | Terra Futures | Agriculture report 2035 | 6 | plain (none) |
| web 31 | Rootwell Farm | Farm stay | 7 | depth cursor |
| web 32 | Aliança Construtora | Construction (Portuguese) | 5 | plain (none) |

## Sites 33–40 (original designs, not copied from any mockup)
| Folder | Brand | Type | Pages | Signature effect |
|---|---|---|---|---|
| web 33 | Carewell Hospital | Multi-specialty hospital | 6 | plain |
| web 34 | Medora Family Clinic | Children’s clinic | 6 | bubble cursor |
| web 35 | Stackly | Workflow SaaS (dark) | 6 | dot-field hero |
| web 36 | Nimbus AI | AI assistant + waitlist | 5 | ink trail |
| web 37 | Vaultline | Premium banking app | 6 | plain |
| web 38 | Penny | Teen money app | 4 | confetti clicks |
| web 39 | Brightwell Academy | K-12 school | 6 | plain |
| web 40 | Lumen Learning | Online learning platform | 7 | 3D-tilt cards |
