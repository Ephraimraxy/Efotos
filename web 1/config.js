/* =====================================================================
   WEB 1 – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
   ---------------------------------------------------------------------
   1. SITE   -> company name, phone, email, address, hours, social links
   2. MEDIA  -> every photo on the site. To replace one, change its `src`:
                 • a local file:   src: 'images/my-photo.jpg'
                 • any web URL:    src: 'https://example.com/photo.jpg'
                 The page uses the key name (e.g. "hero-home") in
                 data-media="hero-home", so nothing else needs editing.
   3. VIDEOS -> every video. `src` can be a YouTube link, a Vimeo link,
                 or a direct .mp4/.webm file/URL.
   ===================================================================== */

window.SITE = {
  name: 'Talento',
  phone: '123 456 789',
  email: 'hello@talento.com',
  address: ['Lumbung Hidup St 425 East Java', 'Madiun City Block ABC 123'],
  hours: 'Monday - Friday 08 AM - 10 PM',
  copyright: 'Allright Reserved - Wirastudio Elementor Kit',
  social: { facebook: '#', twitter: '#', youtube: '#', instagram: '#' },

  // Where forms are sent.
  //  ''  -> the built-in Node server (`npm start`) at /api/forms
  //  or paste a Formspree / Netlify / other endpoint URL here.
  formEndpoint: ''
};

// Unsplash helper: u('photo-id', width). Free to use (unsplash.com/license).
const u = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  /* ---------- page banners ---------- */
  'hero-home':      { src: u('1521737604893-d14cc237f11d'), alt: 'Team collaborating in a bright office' },
  'hero-gallery':   { src: u('1521791136064-7986c2920216'), alt: 'Business handshake' },
  'hero-about':     { src: u('1522202176988-66273c2fd55f'), alt: 'Colleagues working together' },
  'hero-services':  { src: u('1553877522-43269d4ea984'), alt: 'Team meeting around a table' },
  'hero-pricing':   { src: u('1454165804606-c3d57bc86b40'), alt: 'Working on a laptop' },
  'hero-contact':   { src: u('1497366216548-37526070297c'), alt: 'Modern office interior' },

  /* ---------- gallery video cards ---------- */
  'event-1': { src: u('1517245386807-bb43f82c33c4', 1000), alt: 'Recruitment event' },
  'event-2': { src: u('1552664730-d307ca884978', 1000), alt: 'Development talents workshop' },
  'event-3': { src: u('1531482615713-2afd69097998', 1000), alt: 'Executive search process' },
  'event-4': { src: u('1556761175-5973dc0f32e7', 1000), alt: 'Leadership event' },

  /* ---------- content images ---------- */
  'team-1':  { src: u('1600880292203-757bb62b4baf', 700), alt: 'Interview in progress', fallback: 'images/team-1.jpg' },
  'team-2':  { src: u('1542744173-8e7e53415bb0', 700), alt: 'Meeting room discussion' },
  'cta':     { src: u('1454165804606-c3d57bc86b40'), alt: 'Professional working on a laptop' },
  'about-1': { src: u('1519389950473-47ba0277781c', 900), alt: 'Our team at work' },
  'about-2': { src: u('1556761175-b413da4baf72', 900), alt: 'Planning session' },

  /* ---------- people (team & testimonials) ---------- */
  'person-1': { src: u('1573496359142-b8d87734a5a2', 500), alt: 'Sarah Mitchell' },
  'person-2': { src: u('1507679799987-c73779587ccf', 500), alt: 'Daniel Brooks' },
  'person-3': { src: u('1573164713714-d95e436ab8d6', 500), alt: 'Amara Okafor' },
  'person-4': { src: u('1560250097-0b93528c311a', 500), alt: 'James Carter' },

  /* ---------- service photos ---------- */
  'service-1': { src: u('1600880292089-90a7e086ee0c', 800), alt: 'Acquisition and recruitment' },
  'service-2': { src: u('1573497019940-1c28c88b4f3e', 800), alt: 'Executive search' },
  'service-3': { src: u('1454165804606-c3d57bc86b40', 800), alt: 'Performance management' },
  'service-4': { src: u('1522202176988-66273c2fd55f', 800), alt: 'Learning and development' },
  'service-5': { src: u('1497366216548-37526070297c', 800), alt: 'HR consulting' },
  'service-6': { src: u('1519389950473-47ba0277781c', 800), alt: 'Workforce planning' }
};

/* Videos shown in the pop-up player. Paste a YouTube/Vimeo link or an .mp4 URL.
   (These are placeholder clips – swap in your own.) */
const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'video-recruitment': { src: SAMPLE, title: 'Recruitment Events' },
  'video-development': { src: SAMPLE, title: 'Development Talents' },
  'video-executive':   { src: SAMPLE, title: 'Executive Search Process' },
  'video-leadership':  { src: SAMPLE, title: 'Leadership Events' },
  'video-team':        { src: SAMPLE, title: 'Meet Our Team' }
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "fade",
  "cursor": "none",
  "spot": ".card-s,.plan,.sc,.step,.member",
  "tilt": ".card-s,.plan,.member,.step",
  "magnet": ".btn",
  "ripple": ".btn",
  "split": ".hero h1,.section h2",
  "parallax": ".photo,.thumb",
  "heroFade": ".hero-inner",
  "tiltMax": 5
};
