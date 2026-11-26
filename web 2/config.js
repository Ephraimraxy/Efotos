/* =====================================================================
   Eventen – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Eventen",
  "phone": "+33 877 554 332",
  "email": "info@website.com",
  "hours": "Mon - Fri: 9:00 - 18:30",
  "currency": "$",
  "formEndpoint": ""
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "zoom",
  "cursor": "ring",
  "tilt": ".feat,.spk,.plan,.post,.tc,.gstrip .ph",
  "spot": ".feat,.plan,.sess,.tc",
  "magnet": ".btn",
  "ripple": ".btn",
  "split": ".hero h1,h2.t",
  "parallax": ".person,.collage .a,.collage .c",
  "heroFade": ".hero .wrap > div:last-child",
  "tiltMax": 9
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero-bg': { src: u('1470229722913-7c0e2dbbafd3', 1800), alt: "Glowing stage and crowd" },
  'cta-bg': { src: u('1506157786151-b8491531f063', 1800), alt: "Concert lights" },
  'hero-person': { src: u('1573496359142-b8d87734a5a2', 800), alt: "Event host", pos: 'center 15%' },
  'ov-1': { src: u('1517457373958-b7bdd4587205', 700), alt: "Outdoor networking" },
  'ov-2': { src: u('1553028826-f4804a6dba3b', 800), alt: "Workshop from above" },
  'ov-3': { src: u('1556761175-5973dc0f32e7', 700), alt: "Speaker in a loft venue" },
  'venue-img': { src: u('1511578314322-379afb476865', 1000), alt: "Conference hall with round tables" },
  'spk-1': { src: u('1531427186611-ecfd6d936c79', 600), alt: "Speaker", pos: 'center 20%' },
  'spk-2': { src: u('1488426862026-3ee34a7d66df', 600), alt: "Speaker", pos: 'center 20%' },
  'spk-3': { src: u('1492562080023-ab3db95bfbce', 600), alt: "Speaker", pos: 'center 25%' },
  'spk-4': { src: u('1546961329-78bef0414d7c', 600), alt: "Speaker", pos: 'center 25%' },
  'spk-5': { src: u('1522529599102-193c0d76b5b6', 600), alt: "Speaker", pos: 'center 20%' },
  'spk-6': { src: u('1539571696357-5a69c17a67c6', 600), alt: "Speaker", pos: 'center 25%' },
  'spk-7': { src: u('1438761681033-6461ffad8d80', 600), alt: "Speaker", pos: 'center 25%' },
  'spk-8': { src: u('1529626455594-4ff0802cfb7e', 600), alt: "Speaker", pos: 'center 25%' },
  'post-1': { src: u('1475721027785-f74eccf877e2', 800), alt: "Microphone on stage" },
  'post-2': { src: u('1459749411175-04bf5292ceea', 800), alt: "Stage lights" },
  'post-3': { src: u('1492684223066-81342ee5ff30', 800), alt: "Confetti" },
  'gal-1': { src: u('1506157786151-b8491531f063', 900), alt: "Concert" },
  'gal-2': { src: u('1517457373958-b7bdd4587205', 900), alt: "Crowd" },
  'gal-3': { src: u('1516450360452-9312f5e86fc7', 900), alt: "Stage" },
  'gal-4': { src: u('1553028826-f4804a6dba3b', 900), alt: "Workshop" },
  'gal-5': { src: u('1559223607-a43c990c692c', 900), alt: "Audience" },
  'gal-6': { src: u('1501281668745-f7f57925c3b4', 900), alt: "Phones up" },
  'gal-7': { src: u('1556740749-887f6717d7e4', 900), alt: "Networking" },
  'gal-8': { src: u('1573497019236-17f8177b81e8', 900), alt: "Speaker" },
  'gal-9': { src: u('1470229722913-7c0e2dbbafd3', 900), alt: "Light show" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
