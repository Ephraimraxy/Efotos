/* =====================================================================
   Brightwell Academy – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Brightwell Academy",
  "phone": "+1 555 600 8000",
  "email": "office@brightwell.example",
  "address": "1 School Lane, Demo City"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "fade",
  "page": "fade"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1571260899304-425eee4c7efc', 1800), alt: "Students", pos: 'center 30%' },
  'p1': { src: u('1509099836639-18ba1795216d', 700), alt: "Young children" },
  'p2': { src: u('1531545514256-b1400bc00f31', 700), alt: "Students laughing" },
  'p3': { src: u('1523580846011-d3a5bc25702b', 700), alt: "Graduation" },
  'p4': { src: u('1552664730-d307ca884978', 700), alt: "Workshop" },
  'w1': { src: u('1573167243872-43c6433b9d40', 900), alt: "Teacher with students" },
  'w2': { src: u('1523240795612-9a054b0db644', 600), alt: "Library" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
