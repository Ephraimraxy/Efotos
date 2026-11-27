/* =====================================================================
   Rivora Fresh – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Rivora Fresh",
  "phone": "+1 555 100 2000",
  "email": "hello@rivora.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "zoom",
  "page": "zoom",
  "tilt": ".pd,.ct",
  "tiltMax": 6
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1464226184884-fa280b87c399', 1200), alt: "Fresh vegetables" },
  'a1': { src: u('1573496799652-408c2ac9fe98', 120), alt: "Customer", pos: 'center 20%' },
  'a2': { src: u('1519345182560-3f2917c472ef', 120), alt: "Customer", pos: 'center 20%' },
  'a3': { src: u('1566492031773-4f4e44671857', 120), alt: "Customer", pos: 'center 20%' },
  'c1': { src: u('1536657464919-892534f60d6e', 400), alt: "Fruit" },
  'c2': { src: u('1550989460-0adf9ea622e2', 400), alt: "Vegetables" },
  'c3': { src: u('1501004318641-b39e6451bec6', 400), alt: "Leafy" },
  'c4': { src: u('1459156212016-c812468e2115', 400), alt: "Herbs" },
  'c5': { src: u('1470337458703-46ad1756a187', 400), alt: "Juice" },
  'c6': { src: u('1512621776951-a57141f2eefd', 400), alt: "Organic bowl" },
  'farm': { src: u('1589923188900-85dae523342b', 900), alt: "Farmer" },
  'p1': { src: u('1512621776951-a57141f2eefd', 400), alt: "Avocado" },
  'p2': { src: u('1498837167922-ddd27525d352', 400), alt: "Broccoli" },
  'p3': { src: u('1559181567-c3190ca9959b', 400), alt: "Fruit" },
  'p4': { src: u('1464226184884-fa280b87c399', 400), alt: "Peppers" },
  'p5': { src: u('1501004318641-b39e6451bec6', 400), alt: "Spinach" },
  'p6': { src: u('1536657464919-892534f60d6e', 400), alt: "Orange" },
  'p7': { src: u('1500651230702-0e2d8a49d4ad', 400), alt: "Strawberries" },
  'p8': { src: u('1471193945509-9ad0617afabf', 400), alt: "Carrots" },
  'p9': { src: u('1470337458703-46ad1756a187', 400), alt: "Juice" },
  'pm1': { src: u('1536657464919-892534f60d6e', 900), alt: "Fruit" },
  'pm2': { src: u('1470337458703-46ad1756a187', 900), alt: "Juice" },
  'r1': { src: u('1512621776951-a57141f2eefd', 500), alt: "Bowl" },
  'r2': { src: u('1464226184884-fa280b87c399', 500), alt: "Peppers" },
  'r3': { src: u('1536657464919-892534f60d6e', 500), alt: "Citrus" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'farmv': { src: SAMPLE, title: "From our farm" },
};
