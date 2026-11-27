/* =====================================================================
   Rent H&U – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Rent H&U",
  "phone": "+1 555 020 3040",
  "email": "hello@renthu.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "blur",
  "page": "blur",
  "sig": "bubble"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1564013799919-ab600027ffc6', 1800), alt: "Modern home at dusk" },
  'p1': { src: u('1600596542815-ffad4c1539a9', 800), alt: "Ocean Breeze Villa" },
  'p2': { src: u('1570129477492-45c003edd2be', 800), alt: "Jackson House" },
  'p3': { src: u('1480074568708-e7b720bb3f09', 800), alt: "Lakeside Cottage" },
  'p4': { src: u('1448630360428-65456885c650', 800), alt: "Harbour Loft" },
  'p5': { src: u('1568605114967-8130f3a36994', 800), alt: "Pine Ridge Estate" },
  'p6': { src: u('1583608205776-bfd35f0d9f83', 800), alt: "Oak Street Home" },
  'easy': { src: u('1600607687939-ce8a6c25118c', 1000), alt: "Living room" },
  'about': { src: u('1503174971373-b1f69850bded', 1000), alt: "Bright interior" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
