/* =====================================================================
   Stackly – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Stackly",
  "email": "hello@stackly.example",
  "phone": "+1 555 300 5000"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "blur",
  "page": "blur",
  "sig": "dotfield",
  "field": ".hero"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
