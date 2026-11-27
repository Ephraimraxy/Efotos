/* =====================================================================
   Rootwell Farm – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Rootwell Farm",
  "phone": "+84 97 000 0000",
  "email": "hello@rootwell.example",
  "address": "Hamlet Farm, Hill District, Province"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "left",
  "page": "fade",
  "sig": "depth"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1530507629858-e4977d30e9e0', 1000), alt: "Farmers harvesting" },
  'w1': { src: u('1597916829826-02e5bb4a54e0', 800), alt: "Beetroot" },
  'do': { src: u('1508341591423-4347099e1f19', 900), alt: "Child with vegetables" },
  'a1': { src: u('1589923188900-85dae523342b', 600), alt: "Farm tour" },
  'a2': { src: u('1509099836639-18ba1795216d', 600), alt: "Children" },
  'a3': { src: u('1509099836639-18ba1795216d', 600), alt: "Kids" },
  'a4': { src: u('1590682680695-43b964a3ae17', 600), alt: "Hands in soil" },
  'a5': { src: u('1500651230702-0e2d8a49d4ad', 600), alt: "Harvest" },
  'a6': { src: u('1476611338391-6f395a0ebc7b', 600), alt: "Trees" },
  'a7': { src: u('1498837167922-ddd27525d352', 600), alt: "Cooking" },
  'a8': { src: u('1492496913980-501348b61469', 600), alt: "Seeds" },
  'r1': { src: u('1518780664697-55e3ad937233', 800), alt: "Bungalow" },
  'r2': { src: u('1480074568708-e7b720bb3f09', 800), alt: "Family room" },
  'r3': { src: u('1572120360610-d971b9d7767c', 800), alt: "Dorm house" },
  'r4': { src: u('1476514525535-07fb3b4ae5f1', 800), alt: "Camping" },
  't1': { src: u('1507152832244-10d45c7eda57', 900), alt: "Guest" },
  'n1': { src: u('1501004318641-b39e6451bec6', 900), alt: "Soil and plants" },
  'n2': { src: u('1523348837708-15d4a09cfac2', 300), alt: "Seedlings" },
  'n3': { src: u('1536657464919-892534f60d6e', 300), alt: "Oranges" },
  'n4': { src: u('1530267981375-f0de937f5f13', 300), alt: "Field" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
