/* =====================================================================
   Balanza – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Balanza",
  "phone": "+1 (234) 567-8900",
  "email": "hello@balanza.com",
  "address": [
    "45 Greenway Avenue",
    "Portland, OR"
  ],
  "formEndpoint": ""
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "blur",
  "page": "zoom",
  "split": ".hero h1,.h2",
  "parallax": ".ab .col .c,.fq .imgs .b",
  "heroFade": ".hero .t",
  "sig": "ripple"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1552196563-55cd4e45efb3', 1800), alt: "Woman meditating in a bright room", pos: '75% 40%' },
  'ab-1': { src: u('1508214751196-bcfd4ca60f91', 900), alt: "Consultant", pos: 'center 20%' },
  'ab-2': { src: u('1546961329-78bef0414d7c', 500), alt: "Smiling coach", pos: 'center 25%' },
  'av-1': { src: u('1494790108377-be9c29b29330', 150), alt: "Client", pos: 'center 20%' },
  'av-2': { src: u('1438761681033-6461ffad8d80', 150), alt: "Client", pos: 'center 20%' },
  'av-3': { src: u('1544005313-94ddf0286df2', 150), alt: "Client", pos: 'center 20%' },
  'disc': { src: u('1531545514256-b1400bc00f31', 1400), alt: "Team around a laptop", pos: 'center 30%' },
  'res': { src: u('1553028826-f4804a6dba3b', 900), alt: "Team workshop from above" },
  'fq-1': { src: u('1545389336-cf090694435e', 600), alt: "Woman in tree pose", pos: 'center 30%' },
  'fq-2': { src: u('1599901860904-17e6ed7083a0', 600), alt: "Yoga stretch", pos: 'center 20%' },
  'cta': { src: u('1441974231531-c6227db76b6e', 1800), alt: "Sunlit forest" },
  'b-1': { src: u('1499209974431-9dddcece7f88', 800), alt: "Person at sunrise" },
  'b-2': { src: u('1544367567-0f2fcb009e0b', 800), alt: "Yoga at sunset" },
  'b-3': { src: u('1545205597-3d9d02c29597', 800), alt: "Group yoga on the beach" },
  'sv-1': { src: u('1506126613408-eca07ce68773', 900), alt: "Meditation" },
  'sv-2': { src: u('1504384308090-c894fdcc538d', 900), alt: "Office" },
  'sv-3': { src: u('1518310383802-640c2de311b2', 900), alt: "Group workshop" },
  'sv-4': { src: u('1519834785169-98be25ec3f84', 900), alt: "Summit above the clouds" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'promo': { src: SAMPLE, title: "Results that support balance" },
};
