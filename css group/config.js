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
  "hours": "Mon–Sat 8:00 AM–6:00 PM",
  "formEndpoint": "forms.php"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "fade",
  "page": "instant"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: 'images/hero.jpg', alt: "CSS Group" },
  'co1': { src: 'images/sector-service-farm.jpg', alt: "Agriculture" },
  'co2': { src: 'images/sector-construction.jpg', alt: "Construction" },
  'co3': { src: 'images/sector-energy.jpg', alt: "Energy" },
  'co4': { src: 'images/sector-airplane2.jpg', alt: "Aviation" },
  'co5': { src: 'images/sector-real-estate.jpg', alt: "Real estate" },
  'co6': { src: 'images/sector-ict.jpg', alt: "ICT" },
  'r1': { src: 'images/farms-training-2.jpg', alt: "Agriculture" },
  'r2': { src: u('1574362848149-11496d93a7c7', 900), alt: "Construction" },
  'r3': { src: u('1509391366360-2e959784a276', 900), alt: "Energy" },
  'r4': { src: u('1530521954074-e64f6810b32d', 900), alt: "Aviation" },
  'r5': { src: 'images/estate.jpg', alt: "Real estate" },
  'r6': { src: u('1517694712202-14dd9538aa97', 900), alt: "ICT" },
  'a1': { src: 'images/farms-training-1.jpg', alt: "CSS Farms training" },
  'a2': { src: 'images/estate.jpg', alt: "Residence" },
  'a3': { src: 'images/farms-training-2.jpg', alt: "Farm" },
  'n1': { src: 'images/farms-training-2.jpg', alt: "News" },
  'n2': { src: 'images/farms-training-1.jpg', alt: "News" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
