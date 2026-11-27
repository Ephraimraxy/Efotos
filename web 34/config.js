/* =====================================================================
   Medora Family Clinic – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Medora Family Clinic",
  "phone": "+1 555 200 4000",
  "email": "hello@medora.example",
  "address": "8 Sunny Lane, Demo City"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "pop",
  "page": "zoom",
  "sig": "bubble"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1509099836639-18ba1795216d', 900), alt: "Smiling children" },
  'about': { src: u('1470116892389-0de5d9770b2c', 900), alt: "Child shoes" },
  'tst': { src: u('1571260899304-425eee4c7efc', 900), alt: "Students" },
  't1': { src: u('1559839734-2b71ea197ec2', 600), alt: "Doctor", pos: 'center 20%' },
  't2': { src: u('1557862921-37829c790f19', 600), alt: "Dentist", pos: 'center 20%' },
  't3': { src: u('1523824921871-d6f1a15151f1', 600), alt: "Nurse", pos: 'center 20%' },
  't4': { src: u('1507152832244-10d45c7eda57', 600), alt: "Psychologist", pos: 'center 20%' },
  't5': { src: u('1566492031773-4f4e44671857', 600), alt: "Optometrist", pos: 'center 20%' },
  't6': { src: u('1531123897727-8f129e1688ce', 600), alt: "Nutritionist", pos: 'center 20%' },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
