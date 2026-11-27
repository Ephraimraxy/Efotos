/* =====================================================================
   RentXHome – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "RentXHome",
  "phone": "+1 555 030 4050",
  "email": "hello@rentx.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "zoom",
  "page": "slide",
  "sig": "magnifier",
  "mag": ".cardph"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1600585154340-be6161a56a0c', 1800), alt: "Modern house at dusk" },
  'feat': { src: u('1613490493576-7fde63acd811', 900), alt: "Modern house with pool" },
  'p1': { src: u('1580587771525-78b9dba3b914', 700), alt: "Villa" },
  'p2': { src: u('1582268611958-ebfd161ef9cf', 700), alt: "Apartment" },
  'p3': { src: u('1600596542815-ffad4c1539a9', 700), alt: "Townhouse" },
  'p4': { src: u('1515263487990-61b07816b324', 700), alt: "Loft" },
  'p5': { src: u('1570129477492-45c003edd2be', 700), alt: "House" },
  'p6': { src: u('1567496898669-ee935f5f647a', 700), alt: "Terraced home" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
