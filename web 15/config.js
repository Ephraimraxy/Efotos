/* =====================================================================
   Verdant Landscaping – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Verdant Landscaping",
  "phone": "+44 20 7946 0100",
  "email": "hello@verdant.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "clip",
  "page": "instant"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1598902108854-10e335adac99', 1400), alt: "Gardener at work" },
  'lt': { src: u('1416879595882-3373a0480b5b', 900), alt: "Planting" },
  'd1': { src: u('1523348837708-15d4a09cfac2', 700), alt: "Seedlings" },
  'd2': { src: u('1558904541-efa843a96f01', 700), alt: "Lawn" },
  'c1': { src: u('1599598425947-5202edd56bdb', 700), alt: "Raised beds" },
  'c2': { src: u('1459156212016-c812468e2115', 700), alt: "Succulents" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
