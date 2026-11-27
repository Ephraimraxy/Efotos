/* =====================================================================
   Abdullah Tariq – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Abdullah Tariq",
  "email": "hello@abdullah.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "up",
  "page": "blur",
  "sig": "letterroll",
  "roll": ".btn,.nav>ul>li>a"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1508341591423-4347099e1f19', 900), alt: "Portrait", pos: 'center 20%' },
  'w1': { src: u('1460925895917-afdab827c52f', 900), alt: "Analytics dashboard" },
  'w2': { src: u('1616077168712-fc6c788db4af', 900), alt: "Travel app" },
  'w3': { src: u('1555099962-4199c345e5dd', 900), alt: "Code" },
  'w4': { src: u('1499951360447-b19be8fe80f5', 900), alt: "Docs" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
