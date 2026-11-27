/* =====================================================================
   Nimbus AI – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Nimbus AI",
  "email": "hello@nimbus.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "pop",
  "page": "slide",
  "sig": "ink"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'u1': { src: u('1616077168712-fc6c788db4af', 700), alt: "Phone" },
  'u2': { src: u('1624953587687-daf255b6b80a', 700), alt: "Code" },
  'u3': { src: u('1572044162444-ad60f128bdea', 700), alt: "Desk" },
  'u4': { src: u('1517694712202-14dd9538aa97', 700), alt: "Laptop code" },
  'u5': { src: u('1499951360447-b19be8fe80f5', 700), alt: "Workspace" },
  'u6': { src: u('1460925895917-afdab827c52f', 700), alt: "Dashboard" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
