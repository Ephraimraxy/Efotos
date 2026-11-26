/* =====================================================================
   Wexico – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Wexico",
  "phone": "+44 20 7946 0321",
  "email": "hello@wexico.com",
  "address": [
    "12 Finsbury Square",
    "London EC2A 1AF"
  ],
  "formEndpoint": ""
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "pop",
  "parallax": ".hero .pic,.two .ph",
  "sig": "depth",
  "depth": ".wc,.sg .st,.fiv div,.plan,.post,.sv",
  "liquid": ".btn"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero-person': { src: u('1494790108377-be9c29b29330', 900), alt: "Smiling accountant", pos: 'center 12%' },
  'about-big': { src: u('1542744173-8e7e53415bb0', 1600), alt: "Team meeting around a table" },
  'sv-1': { src: u('1554224155-6726b3ff858f', 800), alt: "Tax documents and calculator" },
  'sv-2': { src: u('1460925895917-afdab827c52f', 800), alt: "Analytics on a laptop" },
  'sv-3': { src: u('1450101499163-c8848c66ca85', 800), alt: "Signing a document" },
  'sv-4': { src: u('1556742049-0cfed4f6a45d', 800), alt: "Staff at work" },
  'sv-5': { src: u('1531545514256-b1400bc00f31', 800), alt: "Team around a laptop" },
  'sv-6': { src: u('1554224154-26032ffc0d07', 800), alt: "Audit paperwork" },
  'st-1': { src: u('1556155092-490a1ba16284', 500), alt: "Accounting software" },
  'st-2': { src: u('1554224154-26032ffc0d07', 500), alt: "Tax forms" },
  'st-3': { src: u('1565514020179-026b92b84bb6', 500), alt: "Cash" },
  'why': { src: u('1504384308090-c894fdcc538d', 1600), alt: "Open-plan office" },
  'two': { src: u('1573497620053-ea5300f94f21', 900), alt: "Two advisors talking", pos: 'center 20%' },
  'rv-1': { src: u('1508214751196-bcfd4ca60f91', 700), alt: "Accountant", pos: 'center 15%' },
  'rv-2': { src: u('1531427186611-ecfd6d936c79', 300), alt: "Client", pos: 'center 20%' },
  'rv-3': { src: u('1522529599102-193c0d76b5b6', 300), alt: "Client", pos: 'center 20%' },
  'b-1': { src: u('1554224155-6726b3ff858f', 800), alt: "Tax deductions" },
  'b-2': { src: u('1498050108023-c5249f4df085', 800), alt: "Accounting software" },
  'b-3': { src: u('1579621970563-ebec7560ff3e', 800), alt: "Growing savings" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'intro': { src: SAMPLE, title: "Meet Wexico" },
};
