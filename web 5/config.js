/* =====================================================================
   Eventics – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
   ---------------------------------------------------------------------
   SITE   -> company name, phone, email, address, hours, social links
   MEDIA  -> every photo. Replace one by changing its `src`:
              • local file:  src: 'images/my-photo.jpg'   (put the file in /images)
              • any web URL: src: 'https://example.com/photo.jpg'
             The page refers to the key (e.g. data-media="hero"), nothing else to edit.
   VIDEOS -> pop-up videos. `src` = YouTube link, Vimeo link, or a .mp4/.webm file.
   Stock photos: Unsplash (free licence, https://unsplash.com/license)
   ===================================================================== */

window.SITE = {
  "name": "Eventics",
  "phone": "+1 (212) 555-0147",
  "email": "info@eventics.com",
  "currency": "$",
  "formEndpoint": ""
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "left",
  "cursor": "none",
  "tilt": ".spk,.post,.plan:not(.hot),.feat",
  "spot": ".feat,.sess,.tcard,.plan",
  "magnet": ".btn",
  "ripple": ".btn",
  "split": ".hero h1,.h2",
  "parallax": ".kcol .a,.kcol .b",
  "heroFade": ".hero .wrap",
  "tiltMax": 7
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1587825140708-dfaf72ae4b04', 1800), alt: "Speaker on a conference stage" },
  'band': { src: u('1540575467063-178a50c2df87', 1600), alt: "Audience" },
  'k-1': { src: u('1559223607-a43c990c692c', 900), alt: "Audience at a conference" },
  'k-2': { src: u('1556761175-5973dc0f32e7', 700), alt: "Speaker presenting" },
  's-1': { src: u('1560250097-0b93528c311a', 500), alt: "Speaker", pos: 'center 20%' },
  's-2': { src: u('1573497019940-1c28c88b4f3e', 500), alt: "Speaker", pos: 'center 20%' },
  's-3': { src: u('1500648767791-00dcc994a43e', 500), alt: "Speaker", pos: 'center 20%' },
  's-4': { src: u('1494790108377-be9c29b29330', 500), alt: "Speaker", pos: 'center 20%' },
  's-5': { src: u('1472099645785-5658abf4ff4e', 500), alt: "Speaker", pos: 'center 20%' },
  's-6': { src: u('1506794778202-cad84cf45f1d', 500), alt: "Speaker", pos: 'center 20%' },
  's1': { src: u('1528605248644-14dd04022da1', 500), alt: "Networking dinner" },
  's2': { src: u('1505373877841-8d25f7d46678', 500), alt: "Presentation hall" },
  's3': { src: u('1515187029135-18ee286d815b', 500), alt: "Workshop" },
  'g-1': { src: u('1531058020387-3be344556be6', 1200), alt: "Conference hall" },
  'g-2': { src: u('1511578314322-379afb476865', 900), alt: "Hall with round tables" },
  'g-3': { src: u('1492684223066-81342ee5ff30', 900), alt: "Confetti" },
  'g-4': { src: u('1429962714451-bb934ecdc4ec', 900), alt: "Concert crowd" },
  'g-5': { src: u('1511795409834-ef04bbd61622', 900), alt: "Table setting" },
  'g-6': { src: u('1475721027785-f74eccf877e2', 900), alt: "Microphone" },
  'g-7': { src: u('1559223607-a43c990c692c', 900), alt: "Audience" },
  'dir-1': { src: u('1511578314322-379afb476865', 1000), alt: "Venue hall" },
  'dir-2': { src: u('1587825140708-dfaf72ae4b04', 1000), alt: "Main stage" },
  'n-1': { src: u('1475721027785-f74eccf877e2', 800), alt: "Microphone" },
  'n-2': { src: u('1540575467063-178a50c2df87', 800), alt: "Crowd" },
  'n-3': { src: u('1492684223066-81342ee5ff30', 800), alt: "Confetti" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'promo': { src: SAMPLE, title: "Eventics 2027 promo" },
};
