/* =====================================================================
   Lumen Learning – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Lumen Learning",
  "phone": "+1 555 700 9000",
  "email": "hello@lumen.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "up",
  "page": "fade",
  "sig": "card3d",
  "card3d": ".cc"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'm1': { src: u('1531545514256-b1400bc00f31', 900), alt: "Students studying" },
  'm2': { src: u('1573167243872-43c6433b9d40', 600), alt: "Learners" },
  'm3': { src: u('1571260899304-425eee4c7efc', 1200), alt: "Class" },
  'c1': { src: u('1624953587687-daf255b6b80a', 500), alt: "Python" },
  'c2': { src: u('1561070791-2526d30994b5', 500), alt: "Design swatches" },
  'c3': { src: u('1554224155-6726b3ff858f', 500), alt: "Finance" },
  'c4': { src: u('1517694712202-14dd9538aa97', 500), alt: "Code" },
  'c5': { src: u('1460925895917-afdab827c52f', 500), alt: "Analytics" },
  'c6': { src: u('1586717791821-3f44a563fa4c', 500), alt: "Sketching" },
  'c7': { src: u('1552664730-d307ca884978', 500), alt: "Workshop" },
  'c8': { src: u('1516321318423-f06f85e504b3', 500), alt: "Laptop" },
  'c9': { src: u('1556155092-490a1ba16284', 500), alt: "Marketing" },
  'c10': { src: u('1488590528505-98d2b5aba04b', 500), alt: "SQL" },
  'c11': { src: u('1555099962-4199c345e5dd', 500), alt: "Security" },
  'c12': { src: u('1558655146-9f40138edfeb', 500), alt: "Motion" },
  'i1': { src: u('1573496799652-408c2ac9fe98', 600), alt: "Instructor", pos: 'center 20%' },
  'i2': { src: u('1508341591423-4347099e1f19', 600), alt: "Instructor", pos: 'center 20%' },
  'i3': { src: u('1531123897727-8f129e1688ce', 600), alt: "Instructor", pos: 'center 20%' },
  'i4': { src: u('1557862921-37829c790f19', 600), alt: "Instructor", pos: 'center 20%' },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
