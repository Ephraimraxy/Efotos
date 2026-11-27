/* =====================================================================
   Penny – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Penny",
  "email": "hello@penny.example",
  "phone": "+1 555 500 7000"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "pop",
  "page": "slide",
  "sig": "confetti"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'a1': { src: u('1509099836639-18ba1795216d', 700), alt: "Kids" },
  'a2': { src: u('1531123414780-f74242c2b052', 700), alt: "Teen", pos: 'center 20%' },
  'a3': { src: u('1517486808906-6ca8b3f04846', 700), alt: "Friends" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
