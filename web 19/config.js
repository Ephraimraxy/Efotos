/* =====================================================================
   Eventra – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Eventra Event Management",
  "phone": "+1 555 070 8090",
  "email": "hello@eventra.example",
  "address": "12 Grand Avenue, Demo City"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "flip",
  "page": "zoom",
  "sig": "confetti"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1511578314322-379afb476865', 1800), alt: "Banquet hall" },
  'ab1': { src: u('1511795409834-ef04bbd61622', 700), alt: "Table setting" },
  'ab2': { src: u('1540575467063-178a50c2df87', 700), alt: "Audience" },
  'sv': { src: u('1528605248644-14dd04022da1', 900), alt: "Dinner party" },
  'n1': { src: u('1519225421980-715cb0215aed', 500), alt: "Reception" },
  'n2': { src: u('1530023367847-a683933f4172', 500), alt: "Dinner" },
  'n3': { src: u('1559223607-a43c990c692c', 500), alt: "Conference" },
  'n4': { src: u('1492684223066-81342ee5ff30', 500), alt: "Confetti" },
  'g1': { src: u('1469371670807-013ccf25f16a', 700), alt: "Aisle" },
  'g2': { src: u('1587825140708-dfaf72ae4b04', 700), alt: "Conference" },
  'g3': { src: u('1429962714451-bb934ecdc4ec', 700), alt: "Party" },
  'g4': { src: u('1523438885200-e635ba2c371e', 700), alt: "Garden" },
  'g5': { src: u('1505373877841-8d25f7d46678', 700), alt: "Stage" },
  'g6': { src: u('1583939003579-730e3918a45a', 700), alt: "Confetti" },
  'g7': { src: u('1464366400600-7168b8af9bc3', 700), alt: "Hall" },
  'g8': { src: u('1531058020387-3be344556be6', 700), alt: "Hall" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
