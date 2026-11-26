/* =====================================================================
   Eventen – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "Eventen",
  "phone": "+33 877 554 332",
  "email": "info@website.com",
  "hours": "Mon - Fri: 9:00 - 18:30",
  "currency": "$",
  "formEndpoint": ""
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero-bg': { src: u('1531058020387-3be344556be6', 1800), alt: "Conference hall" },
  'cta-bg': { src: u('1587825140708-dfaf72ae4b04', 1800), alt: "Conference arena" },
  'hero-person': { src: u('1573496359142-b8d87734a5a2', 800), alt: "Event host", pos: 'center 15%' },
  'ov-1': { src: u('1559223607-a43c990c692c', 700), alt: "Audience" },
  'ov-2': { src: u('1522071820081-009f0129c71c', 800), alt: "Team at work" },
  'ov-3': { src: u('1551434678-e076c223a692', 700), alt: "Colleagues at a desk" },
  'venue-img': { src: u('1511578314322-379afb476865', 1000), alt: "Conference hall with round tables" },
  'spk-1': { src: u('1560250097-0b93528c311a', 600), alt: "Speaker", pos: 'center 20%' },
  'spk-2': { src: u('1573497019940-1c28c88b4f3e', 600), alt: "Speaker", pos: 'center 20%' },
  'spk-3': { src: u('1500648767791-00dcc994a43e', 600), alt: "Speaker", pos: 'center 25%' },
  'spk-4': { src: u('1580489944761-15a19d654956', 600), alt: "Speaker", pos: 'center 25%' },
  'spk-5': { src: u('1472099645785-5658abf4ff4e', 600), alt: "Speaker", pos: 'center 20%' },
  'spk-6': { src: u('1506794778202-cad84cf45f1d', 600), alt: "Speaker", pos: 'center 25%' },
  'spk-7': { src: u('1494790108377-be9c29b29330', 600), alt: "Speaker", pos: 'center 25%' },
  'spk-8': { src: u('1507003211169-0a1dd7228f2d', 600), alt: "Speaker", pos: 'center 25%' },
  'post-1': { src: u('1475721027785-f74eccf877e2', 800), alt: "Microphone on stage" },
  'post-2': { src: u('1540575467063-178a50c2df87', 800), alt: "Crowd" },
  'post-3': { src: u('1492684223066-81342ee5ff30', 800), alt: "Confetti" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
};
