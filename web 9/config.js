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

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1573497620053-ea5300f94f21', 1800), alt: "Two women in a consultation", pos: 'center 35%' },
  'ab-1': { src: u('1573497019940-1c28c88b4f3e', 900), alt: "Consultant", pos: 'center 20%' },
  'ab-2': { src: u('1522202176988-66273c2fd55f', 500), alt: "Two women collaborating", pos: 'center 30%' },
  'av-1': { src: u('1494790108377-be9c29b29330', 150), alt: "Client", pos: 'center 20%' },
  'av-2': { src: u('1438761681033-6461ffad8d80', 150), alt: "Client", pos: 'center 20%' },
  'av-3': { src: u('1544005313-94ddf0286df2', 150), alt: "Client", pos: 'center 20%' },
  'disc': { src: u('1531545514256-b1400bc00f31', 1400), alt: "Team around a laptop", pos: 'center 30%' },
  'res': { src: u('1522202176988-66273c2fd55f', 900), alt: "Women collaborating" },
  'fq-1': { src: u('1438761681033-6461ffad8d80', 600), alt: "Consultant", pos: 'center 20%' },
  'fq-2': { src: u('1580489944761-15a19d654956', 600), alt: "Consultant", pos: 'center 20%' },
  'cta': { src: u('1470115636492-6d2b56f9146d', 1800), alt: "Sunlit forest road" },
  'b-1': { src: u('1499209974431-9dddcece7f88', 800), alt: "Person at sunrise" },
  'b-2': { src: u('1544367567-0f2fcb009e0b', 800), alt: "Yoga at sunset" },
  'b-3': { src: u('1545205597-3d9d02c29597', 800), alt: "Group yoga on the beach" },
  'sv-1': { src: u('1506126613408-eca07ce68773', 900), alt: "Meditation" },
  'sv-2': { src: u('1560264280-88b68371db39', 900), alt: "Office" },
  'sv-3': { src: u('1515187029135-18ee286d815b', 900), alt: "Team workshop" },
  'sv-4': { src: u('1470115636492-6d2b56f9146d', 900), alt: "Forest path" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'promo': { src: SAMPLE, title: "Results that support balance" },
};
