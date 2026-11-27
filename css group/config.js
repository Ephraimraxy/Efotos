/* =====================================================================
   CSS Group of Companies – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "CSS Group of Companies",
  "phone": "+234 702 603 3333",
  "email": "info@cssgroup.com.ng",
  "address": "No 20 Thomas Sankara Street, Asokoro, 900231, Abuja, NG.",
  "office1": "Abuja Office",
  "address1": "No 20 Thomas Sankara Street, Asokoro, 900231, Abuja, NG.",
  "office2": "Nasarawa Office (CSS Farms)",
  "address2": "Km 10 Abuja–Keffi Expressway, Gora, Nasarawa State, NG.",
  "hours": "Mon–Sat: 8:00 AM–6:00 PM",
  "closed": "Sunday: Closed",
  "formEndpoint": "forms.php"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "pop",
  "page": "slide",
  "tilt": ".sc,.pjc,.nw",
  "tiltMax": 5
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'chair': { src: 'images/chairman.jpg', alt: "chair" },
  'gate': { src: 'images/gate.jpg', alt: "gate" },
  'aerial': { src: 'images/aerial.jpg', alt: "aerial" },
  'hero': { src: 'images/hero.jpg', alt: "hero" },
  'about1': { src: 'images/about1.jpg', alt: "about1" },
  'about2': { src: 'images/about2.jpg', alt: "about2" },
  'f1': { src: 'images/aerial.jpg', alt: "f1" },
  'train1': { src: 'images/train1.jpg', alt: "train1" },
  'train2': { src: 'images/train2.jpg', alt: "train2" },
  'ev1': { src: 'images/ev1.jpg', alt: "ev1" },
  'ev2': { src: 'images/ev2.jpg', alt: "ev2" },
  'resort': { src: 'images/resort.jpg', alt: "resort" },
  'rest': { src: 'images/rest.jpg', alt: "rest" },
  'lounge': { src: 'images/lounge.jpg', alt: "lounge" },
  'room1': { src: 'images/room1.jpg', alt: "room1" },
  'sv1': { src: 'images/train1.jpg', alt: "sv1" },
  'sv5': { src: 'images/resort.jpg', alt: "sv5" },
  'sv2': { src: 'images/sector-construction.jpg', alt: "sv2" },
  'sv3': { src: 'images/sector-energy.jpg', alt: "sv3" },
  'sv4': { src: 'images/sector-airplane2.jpg', alt: "sv4" },
  'sv6': { src: 'images/sector-ict.jpg', alt: "sv6" },
  'c1': { src: 'images/sector-service-farm.jpg', alt: "c1" },
  'c2': { src: 'images/sector-construction.jpg', alt: "c2" },
  'c3': { src: 'images/sector-energy.jpg', alt: "c3" },
  'c4': { src: 'images/sector-airplane2.jpg', alt: "c4" },
  'c5': { src: 'images/sector-real-estate.jpg', alt: "c5" },
  'c6': { src: 'images/sector-ict.jpg', alt: "c6" },
  'oct1': { src: 'images/oct1.jpg', alt: "oct1" },
  'oct2': { src: 'images/oct2.jpg', alt: "oct2" },
  'oct3': { src: 'images/oct3.jpg', alt: "oct3" },
  'oct4': { src: 'images/oct4.jpg', alt: "oct4" },
  'oct5': { src: 'images/oct5.jpg', alt: "oct5" },
  'oct6': { src: 'images/oct6.jpg', alt: "oct6" },
  'oct7': { src: 'images/oct7.jpg', alt: "oct7" },
  'oct8': { src: 'images/oct8.jpg', alt: "oct8" },
  'bay1': { src: 'images/bay1.jpg', alt: "bay1" },
  'ebo1': { src: 'images/ebo1.jpg', alt: "ebo1" },
  'bay2': { src: 'images/bay2.jpg', alt: "bay2" },
  'ebo2': { src: 'images/ebo2.jpg', alt: "ebo2" },
  'bay3': { src: 'images/bay3.jpg', alt: "bay3" },
  'ebo3': { src: 'images/ebo3.jpg', alt: "ebo3" },
  'bay4': { src: 'images/bay4.jpg', alt: "bay4" },
  'ebo4': { src: 'images/ebo4.jpg', alt: "ebo4" },
  'bay5': { src: 'images/bay5.jpg', alt: "bay5" },
  'ebo5': { src: 'images/ebo5.jpg', alt: "ebo5" },
  'bay6': { src: 'images/bay6.jpg', alt: "bay6" },
  'ebo6': { src: 'images/ebo6.jpg', alt: "ebo6" },
  'bay7': { src: 'images/bay7.jpg', alt: "bay7" },
  'ebo7': { src: 'images/ebo7.jpg', alt: "ebo7" },
  'bay8': { src: 'images/bay8.jpg', alt: "bay8" },
  'ebo8': { src: 'images/ebo8.jpg', alt: "ebo8" },
  'bay9': { src: 'images/bay9.jpg', alt: "bay9" },
  'ebo9': { src: 'images/ebo9.jpg', alt: "ebo9" },
  'bay10': { src: 'images/bay10.jpg', alt: "bay10" },
  'ebo10': { src: 'images/ebo10.jpg', alt: "ebo10" },
  'bay11': { src: 'images/bay11.jpg', alt: "bay11" },
  'ebo11': { src: 'images/ebo11.jpg', alt: "ebo11" },
  'bay12': { src: 'images/bay12.jpg', alt: "bay12" },
  'ebo12': { src: 'images/ebo12.jpg', alt: "ebo12" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'isac': { src: 'images/isac-resort.mp4', title: "ISAC Resort" },
};
