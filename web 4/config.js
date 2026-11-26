/* =====================================================================
   Creatix – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Creatix",
  "phone": "+1 (555) 010-2030",
  "email": "hello@creatix.studio",
  "address": [
    "221 Design Street",
    "London, UK"
  ],
  "formEndpoint": ""
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "clip",
  "page": "fade",
  "cursor": "ring",
  "magnet": ".btn,.pill,.slist button",
  "scramble": ".nav li:not(.lg) a,.ft h4,.thead .pill",
  "split": ".hero h1,.h2,.touch h2",
  "parallax": ".imgs .b,.portrait",
  "sig": "lens",
  "lens": ".proj,.mem .ph,.imgs .ph,.svcgrid .ph.sp,.touch .ph"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero-person': { src: u('1580894732444-8ecded7900cd', 1400), alt: "Smiling creative director", pos: '88% 12%' },
  'ideas-1': { src: u('1573167243872-43c6433b9d40', 1400), alt: "Creative team at work" },
  'ideas-2': { src: u('1524504388940-b1c1722653e1', 900), alt: "Designer portrait", pos: 'center 20%' },
  'svc-1': { src: u('1572044162444-ad60f128bdea', 1000), alt: "Designer with colour swatches" },
  'svc-2': { src: u('1542744094-3a31f272c490', 1000), alt: "Developer at two monitors" },
  'svc-3': { src: u('1486406146926-c627a92ad1ab', 1000), alt: "Skyscrapers from below" },
  'svc-4': { src: u('1501281668745-f7f57925c3b4', 1000), alt: "Phones at a live show" },
  'm-1': { src: u('1534528741775-53994a69daeb', 300), alt: "Jane Smith", pos: 'center 20%' },
  'm-2': { src: u('1463453091185-61582044d556', 300), alt: "John Doe", pos: 'center 20%' },
  'm-3': { src: u('1539571696357-5a69c17a67c6', 300), alt: "Michael Brown", pos: 'center 20%' },
  'm-4': { src: u('1544005313-94ddf0286df2', 300), alt: "Emily Johnson", pos: 'center 20%' },
  'm-5': { src: u('1506794778202-cad84cf45f1d', 300), alt: "Brian Williams", pos: 'center 20%' },
  'm-6': { src: u('1494790108377-be9c29b29330', 300), alt: "Sarah Kim", pos: 'center 20%' },
  'touch-person': { src: u('1573497019236-17f8177b81e8', 900), alt: "Smiling designer", pos: 'center 12%' },
  'p-1': { src: u('1559526324-4b87b5e36e44', 1000), alt: "Dashboard on a laptop" },
  'p-2': { src: u('1586717791821-3f44a563fa4c', 1000), alt: "Sketching a wireframe" },
  'p-3': { src: u('1499951360447-b19be8fe80f5', 1000), alt: "Desk setup" },
  'p-4': { src: u('1561070791-2526d30994b5', 1000), alt: "Brand colour swatches" },
  'p-5': { src: u('1517694712202-14dd9538aa97', 1000), alt: "Code on a laptop" },
  'p-6': { src: u('1516450360452-9312f5e86fc7', 1000), alt: "Launch show" },
  'p-7': { src: u('1558655146-9f40138edfeb', 1000), alt: "Pen on tablet" },
  'p-8': { src: u('1535320903710-d993d3d77d29', 1000), alt: "Analytics chart" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
