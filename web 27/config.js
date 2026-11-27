/* =====================================================================
   KidHope – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "KidHope",
  "phone": "+1 555 090 1000",
  "email": "hello@kidhope.example",
  "address": "12 Hope Street, Demo City"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "up",
  "page": "slide",
  "sig": "confetti"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1509099836639-18ba1795216d', 1400), alt: "Smiling children" },
  't1': { src: u('1509099836639-18ba1795216d', 700), alt: "Children" },
  't2': { src: u('1571260899304-425eee4c7efc', 700), alt: "Students" },
  't3': { src: u('1511632765486-a01980e01a18', 700), alt: "Friends" },
  'h1': { src: u('1515150144380-bca9f1650ed9', 600), alt: "Water" },
  'h2': { src: u('1529156069898-49953e39b3ac', 700), alt: "Kids" },
  's1': { src: u('1571260899304-425eee4c7efc', 500), alt: "Class" },
  's2': { src: u('1509099836639-18ba1795216d', 500), alt: "Kids" },
  's3': { src: u('1464226184884-fa280b87c399', 500), alt: "Food" },
  's4': { src: u('1518780664697-55e3ad937233', 500), alt: "Shelter" },
  'v1': { src: u('1509099836639-18ba1795216d', 900), alt: "Children" },
  'k1': { src: u('1515150144380-bca9f1650ed9', 700), alt: "Water" },
  'k2': { src: u('1571260899304-425eee4c7efc', 700), alt: "Students" },
  'k3': { src: u('1464226184884-fa280b87c399', 700), alt: "Food" },
  'k4': { src: u('1518780664697-55e3ad937233', 700), alt: "Shelter" },
  'k5': { src: u('1531123414780-f74242c2b052', 700), alt: "Girl" },
  'k6': { src: u('1471193945509-9ad0617afabf', 700), alt: "Food relief" },
  'f1': { src: u('1529156069898-49953e39b3ac', 1000), alt: "Group" },
  'n1': { src: u('1509099836639-18ba1795216d', 800), alt: "Kids" },
  'n2': { src: u('1517457373958-b7bdd4587205', 300), alt: "Crowd" },
  'n3': { src: u('1517486808906-6ca8b3f04846', 300), alt: "Team" },
  'n4': { src: u('1616077168712-fc6c788db4af', 300), alt: "Phone" },
  'n5': { src: u('1526304640581-d334cdbbf45e', 300), alt: "Money" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'story': { src: SAMPLE, title: "Our story" },
};
