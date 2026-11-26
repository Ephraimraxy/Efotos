/* =====================================================================
   Consult (Business) – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "phone": "+62 123 486 789",
  "email": "Hello@Email.co",
  "address": [
    "Lumbung Hidup St 425 East Java Madiun City",
    "Block ABC 123"
  ],
  "hours": "Monday - Friday 08 AM - 10 PM",
  "formEndpoint": ""
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "slide",
  "cursor": "none",
  "spot": ".card,.proj,.mem",
  "ripple": ".btn",
  "parallax": ".mis .wrap,.tm .pair .b",
  "heroFade": ".hero .wrap > div"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'banner': { src: u('1560264280-88b68371db39', 1800), alt: "Open-plan office with colleagues" },
  'hero': { src: u('1556761175-b413da4baf72', 1800), alt: "Consulting team in an open office" },
  'cta': { src: u('1521791136064-7986c2920216', 1800), alt: "Handshake" },
  'ab-1': { src: u('1573497019940-1c28c88b4f3e', 900), alt: "Smiling consultant", pos: 'center 20%' },
  'ab-2': { src: u('1580489944761-15a19d654956', 700), alt: "Consultant with a tablet", pos: 'center 20%' },
  'mis': { src: u('1522202176988-66273c2fd55f', 1800), alt: "Consultants collaborating" },
  'vid': { src: u('1573497620053-ea5300f94f21', 700), alt: "Consultant at a desk" },
  'tm-1': { src: u('1560250097-0b93528c311a', 600), alt: "Head consultant", pos: 'center 20%' },
  'tm-2': { src: u('1519085360753-af0119f7cbe7', 600), alt: "Consultant", pos: 'center 20%' },
  'sv-1': { src: u('1552664730-d307ca884978', 900), alt: "Strategy workshop" },
  'sv-2': { src: u('1519389950473-47ba0277781c', 900), alt: "Process planning" },
  'sv-3': { src: u('1460925895917-afdab827c52f', 900), alt: "Research analytics" },
  'sv-4': { src: u('1556155092-490a1ba16284', 900), alt: "Business analysis" },
  'sv-5': { src: u('1515187029135-18ee286d815b', 900), alt: "Change workshop" },
  'pr-1': { src: u('1556761175-b413da4baf72', 900), alt: "Retail strategy" },
  'pr-2': { src: u('1531482615713-2afd69097998', 900), alt: "Operations" },
  'pr-3': { src: u('1591696205602-2f950c417cb9', 900), alt: "Market study" },
  'pr-4': { src: u('1460925895917-afdab827c52f', 900), alt: "Analytics" },
  'pr-5': { src: u('1517048676732-d65bc937f952', 900), alt: "Merger meeting" },
  'pr-6': { src: u('1531545514256-b1400bc00f31', 900), alt: "Customer insights" },
  'mm-3': { src: u('1507679799987-c73779587ccf', 500), alt: "Consultant", pos: 'center 20%' },
  'mm-4': { src: u('1487412720507-e7ab37603c6f', 500), alt: "Consultant", pos: 'center 20%' },
  'mm-5': { src: u('1500648767791-00dcc994a43e', 500), alt: "Consultant", pos: 'center 20%' },
  'mm-6': { src: u('1589156280159-27698a70f29e', 500), alt: "Consultant", pos: 'center 20%' },
  'bl-1': { src: u('1591696205602-2f950c417cb9', 800), alt: "Growth chart" },
  'bl-2': { src: u('1531482615713-2afd69097998', 800), alt: "Operations review" },
  'bl-3': { src: u('1556155092-490a1ba16284', 800), alt: "Research on a laptop" },
  'bl-4': { src: u('1517048676732-d65bc937f952', 800), alt: "Team meeting" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'intro': { src: SAMPLE, title: "Our mission & vision" },
};
