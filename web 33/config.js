/* =====================================================================
   Carewell Hospital – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Carewell Hospital",
  "phone": "0800 000 999",
  "email": "care@carewell.example",
  "address": "1 Hospital Road, Demo City"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "up",
  "page": "fade"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1576091160399-112ba8d25d1d', 1000), alt: "Doctor with phone", pos: 'center 20%' },
  'd1': { src: u('1559839734-2b71ea197ec2', 600), alt: "Doctor", pos: 'center 20%' },
  'd2': { src: u('1557862921-37829c790f19', 600), alt: "Doctor", pos: 'center 20%' },
  'd3': { src: u('1548142813-c348350df52b', 600), alt: "Doctor", pos: 'center 20%' },
  'd4': { src: u('1531384441138-2736e62e0919', 600), alt: "Doctor", pos: 'center 20%' },
  'd5': { src: u('1573496799652-408c2ac9fe98', 600), alt: "Doctor", pos: 'center 20%' },
  'd6': { src: u('1566492031773-4f4e44671857', 600), alt: "Doctor", pos: 'center 20%' },
  'd7': { src: u('1531123897727-8f129e1688ce', 600), alt: "Doctor", pos: 'center 20%' },
  'd8': { src: u('1581382575275-97901c2635b7', 600), alt: "Doctor", pos: 'center 20%' },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
