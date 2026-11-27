/* =====================================================================
   Agrigo – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Agrigo",
  "phone": "+1 555 080 9000",
  "email": "info@agrigo.example",
  "address": "1 Field Road, Demo City"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "pop",
  "page": "slide",
  "tilt": ".sc,.pjc",
  "tiltMax": 7
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1531123414780-f74242c2b052', 900), alt: "Farmer", pos: 'center 25%' },
  'a1': { src: u('1589923188900-85dae523342b', 700), alt: "Farm worker" },
  'a2': { src: u('1500651230702-0e2d8a49d4ad', 700), alt: "Strawberries" },
  'f1': { src: u('1581578017093-cd30fce4eeb7', 1000), alt: "Agronomist" },
  's1': { src: u('1625246333195-78d9c38ad449', 500), alt: "Crops" },
  's2': { src: u('1464226184884-fa280b87c399', 500), alt: "Vegetables" },
  's3': { src: u('1500937386664-56d1dfef3854', 500), alt: "Wheat" },
  's4': { src: u('1495107334309-fcf20504a5ab', 500), alt: "Pasture" },
  'p1': { src: u('1515150144380-bca9f1650ed9', 800), alt: "Irrigation" },
  'p2': { src: u('1574323347407-f5e1ad6d020b', 800), alt: "Grain" },
  'p3': { src: u('1509391366360-2e959784a276', 800), alt: "Solar" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
