/* =====================================================================
   Jenny Scott – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Jenny Scott",
  "email": "jenny@portfolio.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "pop",
  "page": "slide",
  "sig": "ink"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1494790108377-be9c29b29330', 900), alt: "Portrait", pos: 'center 15%' },
  'who': { src: u('1548142813-c348350df52b', 800), alt: "Jenny", pos: 'center 20%' },
  'w1': { src: u('1499951360447-b19be8fe80f5', 700), alt: "Landing" },
  'w2': { src: u('1616077168712-fc6c788db4af', 700), alt: "App" },
  'w3': { src: u('1460925895917-afdab827c52f', 700), alt: "Dashboard" },
  'w4': { src: u('1542744094-3a31f272c490', 700), alt: "Portfolio" },
  'w5': { src: u('1516321318423-f06f85e504b3', 700), alt: "Habits" },
  'w6': { src: u('1556155092-490a1ba16284', 700), alt: "Console" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
