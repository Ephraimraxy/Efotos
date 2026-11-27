/* =====================================================================
   Terra Futures – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Terra Futures",
  "email": "hello@terrafutures.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "clip",
  "page": "instant"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1515150144380-bca9f1650ed9', 1800), alt: "Irrigated field" },
  'e1': { src: u('1615811361523-6bd03d7748e7', 1200), alt: "Tractor aerial" },
  'e2': { src: u('1625246333195-78d9c38ad449', 600), alt: "Corn" },
  'e3': { src: u('1625246333195-78d9c38ad449', 900), alt: "Crop field" },
  'e4': { src: u('1590682680695-43b964a3ae17', 600), alt: "Soil" },
  'e5': { src: u('1515150144380-bca9f1650ed9', 1200), alt: "Sprinklers" },
  'e6': { src: u('1530267981375-f0de937f5f13', 500), alt: "Tractor" },
  'e7': { src: u('1508614589041-895b88991e3e', 500), alt: "Drone" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
