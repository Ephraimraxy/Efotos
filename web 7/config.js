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

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1519085360753-af0119f7cbe7', 1800), alt: "Tax consultant in a suit", pos: 'center 30%' },
  'cta': { src: u('1521791136064-7986c2920216', 1800), alt: "Handshake" },
  'ab-1': { src: u('1556761175-5973dc0f32e7', 1000), alt: "Team discussing documents" },
  'ab-2': { src: u('1531545514256-b1400bc00f31', 700), alt: "Colleagues at a laptop" },
  'ab-3': { src: u('1573497620053-ea5300f94f21', 700), alt: "Two women meeting" },
  'sv-1': { src: u('1554224155-6726b3ff858f', 900), alt: "Tax documents" },
  'sv-2': { src: u('1554224154-26032ffc0d07', 900), alt: "Tax forms" },
  'sv-3': { src: u('1542744173-8e7e53415bb0', 900), alt: "Corporate meeting" },
  'sv-4': { src: u('1436491865332-7a61a109cc05', 900), alt: "International travel" },
  'sv-5': { src: u('1460925895917-afdab827c52f', 900), alt: "Sales analytics" },
  'sv-6': { src: u('1450101499163-c8848c66ca85', 900), alt: "Signing documents" },
  'p-1': { src: u('1500648767791-00dcc994a43e', 200), alt: "Client", pos: 'center 20%' },
  'p-2': { src: u('1573497019940-1c28c88b4f3e', 200), alt: "Client", pos: 'center 20%' },
  'p-3': { src: u('1560250097-0b93528c311a', 200), alt: "Client", pos: 'center 20%' },
  'b-1': { src: u('1554224155-6726b3ff858f', 800), alt: "Tax deductions" },
  'b-2': { src: u('1554224154-26032ffc0d07', 800), alt: "Year-end checklist" },
  'b-3': { src: u('1556155092-490a1ba16284', 800), alt: "International tax" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
