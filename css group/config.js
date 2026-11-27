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
  "phone": "+234 000 000 0000",
  "email": "info@cssgroup.com.ng",
  "address": "Abuja, Nigeria (update with head-office address)",
  "formEndpoint": "forms.php"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "fade",
  "page": "instant"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1523192193543-6e7296d960e4', 1800), alt: "Modern city buildings" },
  'co1': { src: u('1523741543316-beb7fc7023d8', 900), alt: "Farm fields" },
  'co2': { src: u('1509391366360-2e959784a276', 900), alt: "Solar panels" },
  'co3': { src: u('1574362848149-11496d93a7c7', 900), alt: "Building project" },
  'co4': { src: u('1530521954074-e64f6810b32d', 900), alt: "Airport traveller" },
  'co5': { src: u('1517694712202-14dd9538aa97', 900), alt: "Software code" },
  'co6': { src: u('1512917774080-9991f1c4c750', 900), alt: "Modern home" },
  'a1': { src: u('1581578017093-cd30fce4eeb7', 600), alt: "Farm worker" },
  'a2': { src: u('1600047509807-ba8f99d2cdde', 600), alt: "Residence" },
  'a3': { src: u('1615811361523-6bd03d7748e7', 600), alt: "Tractor aerial" },
  'w1': { src: u('1556761175-5973dc0f32e7', 800), alt: "Team" },
  'w2': { src: u('1521791136064-7986c2920216', 800), alt: "Handshake" },
  'w3': { src: u('1519389950473-47ba0277781c', 800), alt: "Desk" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
