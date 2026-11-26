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

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero-person': { src: u('1580489944761-15a19d654956', 900), alt: "Smiling creative director", pos: 'center 12%' },
  'ideas-1': { src: u('1522071820081-009f0129c71c', 1400), alt: "Creative team at work" },
  'ideas-2': { src: u('1573497019940-1c28c88b4f3e', 900), alt: "Smiling designer", pos: 'center 20%' },
  'svc-1': { src: u('1498050108023-c5249f4df085', 1000), alt: "UI/UX on a laptop" },
  'svc-2': { src: u('1556155092-490a1ba16284', 1000), alt: "Web dashboard" },
  'svc-3': { src: u('1519389950473-47ba0277781c', 1000), alt: "Desk from above" },
  'svc-4': { src: u('1540575467063-178a50c2df87', 1000), alt: "Event visuals" },
  'm-1': { src: u('1580489944761-15a19d654956', 300), alt: "Jane Smith", pos: 'center 20%' },
  'm-2': { src: u('1500648767791-00dcc994a43e', 300), alt: "John Doe", pos: 'center 20%' },
  'm-3': { src: u('1560250097-0b93528c311a', 300), alt: "Michael Brown", pos: 'center 20%' },
  'm-4': { src: u('1544005313-94ddf0286df2', 300), alt: "Emily Johnson", pos: 'center 20%' },
  'm-5': { src: u('1506794778202-cad84cf45f1d', 300), alt: "Brian Williams", pos: 'center 20%' },
  'm-6': { src: u('1494790108377-be9c29b29330', 300), alt: "Sarah Kim", pos: 'center 20%' },
  'touch-person': { src: u('1494790108377-be9c29b29330', 900), alt: "Happy designer", pos: 'center 15%' },
  'p-1': { src: u('1460925895917-afdab827c52f', 1000), alt: "Fintech dashboard" },
  'p-2': { src: u('1581291518857-4e27b48ff24e', 1000), alt: "Wireframe sketch" },
  'p-3': { src: u('1556155092-490a1ba16284', 1000), alt: "Analytics" },
  'p-4': { src: u('1556761175-b413da4baf72', 1000), alt: "Studio" },
  'p-5': { src: u('1516321318423-f06f85e504b3', 1000), alt: "Banking app" },
  'p-6': { src: u('1475721027785-f74eccf877e2', 1000), alt: "Launch film" },
  'p-7': { src: u('1519389950473-47ba0277781c', 1000), alt: "Packaging" },
  'p-8': { src: u('1492684223066-81342ee5ff30', 1000), alt: "Event visuals" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
