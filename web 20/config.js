/* =====================================================================
   Lucky Knot – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Lucky Knot Wedding Services",
  "phone": "090 8 765 432",
  "email": "hello@luckyknot.example",
  "address": "12 Đường Hoa, Thành phố Demo"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "clip",
  "page": "fade",
  "sig": "petals"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1519167758481-83f550bb49b3', 1800), alt: "Wedding hall" },
  'bouq': { src: u('1487530811176-3780de880c2d', 700), alt: "Bridal bouquet" },
  'c1': { src: u('1469371670807-013ccf25f16a', 700), alt: "Aisle" },
  'c2': { src: u('1519225421980-715cb0215aed', 700), alt: "Table" },
  'c3': { src: u('1523438885200-e635ba2c371e', 700), alt: "Garden" },
  'd1': { src: u('1525258946800-98cfd641d0de', 700), alt: "Roses" },
  'd2': { src: u('1464366400600-7168b8af9bc3', 700), alt: "Reception" },
  'd3': { src: u('1522673607200-164d1b6ce486', 700), alt: "Chairs on lawn" },
  'p1': { src: u('1529636798458-92182e662485', 600), alt: "Arch" },
  'p2': { src: u('1585320806297-9794b3e4eeae', 600), alt: "Garden path" },
  'p3': { src: u('1490750967868-88aa4486c946', 600), alt: "Flowers" },
  'g1': { src: u('1583939003579-730e3918a45a', 600), alt: "Couple" },
  'g2': { src: u('1465495976277-4387d4b0b4c6', 600), alt: "Hands" },
  'g3': { src: u('1478146896981-b80fe463b330', 600), alt: "Bride" },
  'g4': { src: u('1501901609772-df0848060b33', 600), alt: "Couple" },
  'g5': { src: u('1530023367847-a683933f4172', 600), alt: "Banquet" },
  'g6': { src: u('1518199266791-5375a83190b7', 600), alt: "Hearts" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
