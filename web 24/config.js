/* =====================================================================
   Gretna Green – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Gretna Green Venue",
  "phone": "+44 1461 000 000",
  "email": "info@gretna.example",
  "address": "1 Venue Lane, Gretna, Scotland"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "fade",
  "page": "instant"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1530023367847-a683933f4172', 1800), alt: "Long wedding table" },
  'vid': { src: u('1464047736614-af63643285bf', 900), alt: "Fairy lights" },
  'b1': { src: u('1583939003579-730e3918a45a', 1600), alt: "Confetti kiss" },
  'b2': { src: u('1519225421980-715cb0215aed', 1600), alt: "Table setting" },
  'w1': { src: u('1469371670807-013ccf25f16a', 700), alt: "Aisle" },
  'w2': { src: u('1464366400600-7168b8af9bc3', 700), alt: "Barn hall" },
  'w3': { src: u('1519167758481-83f550bb49b3', 700), alt: "Hall" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'tour': { src: SAMPLE, title: "Venue tour" },
};
