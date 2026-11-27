/* =====================================================================
   Planet Friendly Gardening – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Planet Friendly Gardening",
  "phone": "+44 20 7946 0200",
  "email": "hello@gardening.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "blur",
  "page": "zoom",
  "sig": "depth"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1585320806297-9794b3e4eeae', 1800), alt: "Rose garden path" },
  'h1': { src: u('1590682680695-43b964a3ae17', 600), alt: "Planting seedling" },
  'h2': { src: u('1589923188900-85dae523342b', 600), alt: "Gardener" },
  'gr': { src: u('1581578017093-cd30fce4eeb7', 1000), alt: "Gardener in garden" },
  's1': { src: u('1558904541-efa843a96f01', 700), alt: "Lawn" },
  's2': { src: u('1515150144380-bca9f1650ed9', 700), alt: "Watering" },
  's3': { src: u('1416879595882-3373a0480b5b', 700), alt: "Soil scoop" },
  's4': { src: u('1459156212016-c812468e2115', 700), alt: "Succulents" },
  'p1': { src: u('1599598425947-5202edd56bdb', 700), alt: "Bonsai" },
  'p2': { src: u('1523348837708-15d4a09cfac2', 700), alt: "Seedling tray" },
  'p3': { src: u('1530836369250-ef72a3f5cda8', 700), alt: "Hand planting" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
