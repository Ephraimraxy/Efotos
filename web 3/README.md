# Web 3 – TravelPerk

Travel booking website (blue TravelPerk template). Search form filters tours, tour/hotel/activity booking with live total, destinations, blog.

Pages: `index.html`, `tours.html`, `hotels.html`, `restaurants.html`, `destinations.html`, `activities.html`, `about.html`, `blog.html`, `contact.html`, `tour-bali-escape.html`, `tour-swiss-alps-adventure.html`, `tour-tokyo-discovery.html`, `tour-cape-town-journey.html`, `tour-paris-city-break.html`, `tour-venice-romance.html`, `tour-santorini-sunsets.html`, `tour-canadian-rockies-hike.html`, `tour-ha-long-bay-cruise.html`, `tour-cappadocia-balloons.html` · `admin.html` (form inbox)

## Run
```bash
cd "web 3"
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
