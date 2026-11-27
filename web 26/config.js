/* =====================================================================
   Farmora – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Farmora",
  "phone": "+1 800 123 2474",
  "email": "support@farmora.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "blur",
  "page": "blur",
  "sig": "sparkle"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1530507629858-e4977d30e9e0', 1800), alt: "Farmer harvesting greens", pos: 'center 30%' },
  'c1': { src: u('1581578017093-cd30fce4eeb7', 700), alt: "Gardener" },
  'c2': { src: u('1589923188900-85dae523342b', 700), alt: "Planting" },
  'm1': { src: u('1550989460-0adf9ea622e2', 700), alt: "Vegetables" },
  'm2': { src: u('1500651230702-0e2d8a49d4ad', 700), alt: "Strawberries" },
  'm3': { src: u('1536657464919-892534f60d6e', 700), alt: "Oranges" },
  'm4': { src: u('1471193945509-9ad0617afabf', 700), alt: "Market vegetables" },
  'm5': { src: u('1464226184884-fa280b87c399', 700), alt: "Carrots and chilli" },
  'm6': { src: u('1574323347407-f5e1ad6d020b', 700), alt: "Grain" },
  't1': { src: u('1615811361523-6bd03d7748e7', 700), alt: "Tractor aerial" },
  't2': { src: u('1515150144380-bca9f1650ed9', 700), alt: "Irrigation" },
  'u1': { src: u('1531123897727-8f129e1688ce', 120), alt: "Grower", pos: 'center 20%' },
  'u2': { src: u('1546456073-92b9f0a8d413', 120), alt: "Coop lead", pos: 'center 20%' },
  'u3': { src: u('1523824921871-d6f1a15151f1', 120), alt: "Farm manager", pos: 'center 20%' },
  'b1': { src: u('1592982537447-7440770cbfc9', 700), alt: "Field" },
  'b2': { src: u('1597916829826-02e5bb4a54e0', 700), alt: "Seedling" },
  'b3': { src: u('1506484381205-f7945653044d', 700), alt: "Market stall" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
