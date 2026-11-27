/* =====================================================================
   Paylane – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Paylane",
  "phone": "+44 20 7946 0000",
  "email": "hello@paylane.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "up",
  "page": "fade",
  "sig": "dotfield",
  "field": "[data-field]"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'av-1': { src: u('1507591064344-4c6ce005b128', 120), alt: "Customer", pos: 'center 20%' },
  'av-2': { src: u('1531384441138-2736e62e0919', 120), alt: "Customer", pos: 'center 20%' },
  'av-3': { src: u('1523824921871-d6f1a15151f1', 120), alt: "Customer", pos: 'center 20%' },
  'av-4': { src: u('1507152832244-10d45c7eda57', 120), alt: "Customer", pos: 'center 20%' },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
