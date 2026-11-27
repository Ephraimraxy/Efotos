/* =====================================================================
   Agriture – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Agriture",
  "phone": "+1 555 040 5060",
  "email": "hello@agriture.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "up",
  "page": "zoom",
  "sig": "leaves"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1560493676-04071c5f467b', 1800), alt: "Farm fields" },
  'f1': { src: u('1523741543316-beb7fc7023d8', 800), alt: "Hills and fields" },
  'f2': { src: u('1530267981375-f0de937f5f13', 800), alt: "Tractor in field" },
  'c1': { src: u('1625246333195-78d9c38ad449', 800), alt: "Maize" },
  'c2': { src: u('1500651230702-0e2d8a49d4ad', 700), alt: "Strawberries" },
  'c3': { src: u('1589923188900-85dae523342b', 700), alt: "Farmer working" },
  'c4': { src: u('1473968512647-3e447244af8f', 700), alt: "Drone" },
  'c5': { src: u('1536657464919-892534f60d6e', 700), alt: "Oranges" },
  's1': { src: u('1509391366360-2e959784a276', 900), alt: "Solar panels" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
