/* =====================================================================
   Atlas Properties – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Atlas Properties",
  "phone": "+1 555 010 2030",
  "email": "hello@atlas.example",
  "address": "100 Harbor Street, Demo City"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "fade",
  "page": "instant"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1523192193543-6e7296d960e4', 1800), alt: "Residential towers" },
  'c1': { src: u('1574362848149-11496d93a7c7', 900), alt: "City Point" },
  'c2': { src: u('1460317442991-0ec209397118', 900), alt: "Harborview" },
  'c3': { src: u('1515263487990-61b07816b324', 900), alt: "The Lakeside" },
  'c4': { src: u('1545324418-cc1a3fa10c00', 900), alt: "Skyline Court" },
  'c5': { src: u('1567496898669-ee935f5f647a', 900), alt: "Garden Terrace" },
  'c6': { src: u('1479839672679-a46483c0e7c8', 900), alt: "Meridian Lofts" },
  'a1': { src: u('1448630360428-65456885c650', 600), alt: "Tower" },
  'a2': { src: u('1600047509807-ba8f99d2cdde', 600), alt: "Residence" },
  'a3': { src: u('1512917774080-9991f1c4c750', 600), alt: "The Lakeside" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
