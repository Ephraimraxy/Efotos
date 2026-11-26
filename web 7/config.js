/* =====================================================================
   Consult (Tax) – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Consult",
  "phone": "+1 (415) 555-0199",
  "email": "advice@consult.com",
  "address": [
    "88 Market Street",
    "San Francisco, CA"
  ],
  "formEndpoint": ""
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "up",
  "split": ".hero h1,.h2,.cta h2",
  "parallax": ".col .main",
  "heroFade": ".hero .wrap > div:first-child",
  "sig": "preview",
  "preview": {
    ".sc": [
      "sv-1",
      "sv-2",
      "sv-3",
      "sv-4",
      "sv-5",
      "sv-6"
    ],
    ".post": "self"
  }
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1519085360753-af0119f7cbe7', 1800), alt: "Tax consultant in a suit", pos: 'center 30%' },
  'cta': { src: u('1521791136064-7986c2920216', 1800), alt: "Handshake" },
  'ab-1': { src: u('1556761175-5973dc0f32e7', 1000), alt: "Team discussing documents" },
  'ab-2': { src: u('1531545514256-b1400bc00f31', 700), alt: "Colleagues at a laptop" },
  'ab-3': { src: u('1573497620053-ea5300f94f21', 700), alt: "Two women meeting" },
  'sv-1': { src: u('1554224154-26032ffc0d07', 900), alt: "Tax forms and calculator" },
  'sv-2': { src: u('1553729459-efe14ef6055d', 900), alt: "Counting money" },
  'sv-3': { src: u('1504384308090-c894fdcc538d', 900), alt: "Corporate office" },
  'sv-4': { src: u('1486406146926-c627a92ad1ab', 900), alt: "City towers" },
  'sv-5': { src: u('1526304640581-d334cdbbf45e', 900), alt: "Dollar bills" },
  'sv-6': { src: u('1521791055366-0d553872125f', 900), alt: "Signing documents" },
  'p-1': { src: u('1507003211169-0a1dd7228f2d', 200), alt: "Client", pos: 'center 20%' },
  'p-2': { src: u('1589156280159-27698a70f29e', 200), alt: "Client", pos: 'center 20%' },
  'p-3': { src: u('1531746020798-e6953c6e8e04', 200), alt: "Client", pos: 'center 20%' },
  'b-1': { src: u('1554224155-6726b3ff858f', 800), alt: "Tax deductions" },
  'b-2': { src: u('1554224154-26032ffc0d07', 800), alt: "Year-end checklist" },
  'b-3': { src: u('1556155092-490a1ba16284', 800), alt: "International tax" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
