/* =====================================================================
   NavikX – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "NavikX Agritech",
  "phone": "+1 555 050 6070",
  "email": "hello@navikx.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "left",
  "page": "fade",
  "sig": "gps"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1473968512647-3e447244af8f', 1400), alt: "Drone over field" },
  's1': { src: u('1625246333195-78d9c38ad449', 500), alt: "Soil" },
  's2': { src: u('1515150144380-bca9f1650ed9', 500), alt: "Irrigation" },
  's3': { src: u('1615811361523-6bd03d7748e7', 500), alt: "Tractor aerial" },
  'why': { src: u('1581578017093-cd30fce4eeb7', 500), alt: "Farmer" },
  'p1': { src: u('1620200423727-8127f75d7f53', 400), alt: "Station" },
  'p2': { src: u('1590682680695-43b964a3ae17', 400), alt: "Soil sensor" },
  'p3': { src: u('1586771107445-d3ca888129ff', 400), alt: "Crop monitor" },
  'p4': { src: u('1508614589041-895b88991e3e', 400), alt: "Management" },
  'cta': { src: u('1530267981375-f0de937f5f13', 900), alt: "Tractor" },
  'cta2': { src: u('1592982537447-7440770cbfc9', 900), alt: "Field" },
  'k1': { src: u('1597916829826-02e5bb4a54e0', 500), alt: "Soil" },
  'k2': { src: u('1515150144380-bca9f1650ed9', 500), alt: "Irrigation" },
  'k3': { src: u('1508614589041-895b88991e3e', 500), alt: "Drone" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
