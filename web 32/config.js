/* =====================================================================
   Aliança Construtora – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Aliança Construtora",
  "phone": "+55 11 0000 0000",
  "email": "contato@alianca.example"
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "up",
  "page": "fade"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1581382575275-97901c2635b7', 1000), alt: "Engenheiro no canteiro", pos: 'center 25%' },
  'ab': { src: u('1507679799987-c73779587ccf', 800), alt: "Engenheiros" },
  'sv1': { src: u('1574362848149-11496d93a7c7', 1200), alt: "Obra em constru\u00e7\u00e3o" },
  'sv2': { src: u('1515263487990-61b07816b324', 1200), alt: "Ilumina\u00e7\u00e3o" },
  'sv3': { src: u('1448630360428-65456885c650', 1200), alt: "Pr\u00e9-moldados" },
  'wm': { src: u('1559839734-2b71ea197ec2', 700), alt: "Engenheira", pos: 'center 20%' },
  'p1': { src: u('1600047509807-ba8f99d2cdde', 700), alt: "Escola" },
  'p2': { src: u('1460317442991-0ec209397118', 700), alt: "Centro" },
  'p3': { src: u('1545324418-cc1a3fa10c00', 700), alt: "Edif\u00edcio" },
  'p4': { src: u('1479839672679-a46483c0e7c8', 700), alt: "Galp\u00e3o" },
  'p5': { src: u('1567496898669-ee935f5f647a', 700), alt: "Posto" },
  'p6': { src: u('1523192193543-6e7296d960e4', 700), alt: "Pra\u00e7a" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
