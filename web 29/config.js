/* =====================================================================
   Verde Living Walls – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Verde Living Walls",
  "phone": "+1 555 110 3000",
  "email": "hello@verde.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "pop",
  "page": "zoom",
  "sig": "leaves"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1470058869958-2a77ade41c02', 900), alt: "Green wall", pos: 'center' },
  'o1': { src: u('1598902108854-10e335adac99', 800), alt: "Garden" },
  'o2': { src: u('1585320806297-9794b3e4eeae', 800), alt: "Garden path" },
  'b1': { src: u('1470058869958-2a77ade41c02', 900), alt: "Plant wall" },
  'g1': { src: u('1459156212016-c812468e2115', 600), alt: "Succulents" },
  'g2': { src: u('1599598425947-5202edd56bdb', 600), alt: "Bonsai" },
  'g3': { src: u('1501004318641-b39e6451bec6', 600), alt: "Plant" },
  'g4': { src: u('1416879595882-3373a0480b5b', 600), alt: "Potting" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
