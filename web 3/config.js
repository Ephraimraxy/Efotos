/* =====================================================================
   TravelPerk – EDIT THIS FILE TO CHANGE CONTENT & MEDIA SITE-WIDE
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
  "name": "TravelPerk",
  "phone": "+123 (456) 7890",
  "email": "hello@travelperk.com",
  "currency": "$",
  "formEndpoint": ""
};

/* MOTION: turn effects on/off here (see fx.js). Set a value to '' to disable it. */
window.FX = {
  "reveal": "blur",
  "split": ".hero h1,.sh",
  "parallax": ".acol .a,.acol .b",
  "heroFade": ".hero .wrap",
  "sig": "plane",
  "pan": ".tour,.arch,.exp,.post,.story"
};

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1530521954074-e64f6810b32d', 1800), alt: "Traveller relaxing at an airport lounge", pos: 'center 40%' },
  'av-1': { src: u('1463453091185-61582044d556', 200), alt: "Happy traveller", pos: 'center 20%' },
  'av-2': { src: u('1517841905240-472988babdf9', 200), alt: "Happy traveller", pos: 'center 20%' },
  'av-3': { src: u('1508214751196-bcfd4ca60f91', 200), alt: "Happy traveller", pos: 'center 20%' },
  'about-1': { src: u('1485893086445-ed75865251e0', 900), alt: "Traveller in a hat", pos: 'center 25%' },
  'about-2': { src: u('1520250497591-112f2f40a3f4', 900), alt: "Tropical resort" },
  'd-france': { src: u('1502602898657-3e91760cbb34', 800), alt: "Eiffel Tower" },
  'd-japan': { src: u('1542051841857-5f90071e7989', 800), alt: "Tokyo at night" },
  'd-maldives': { src: u('1559128010-7c1ad6e1b6a5', 800), alt: "Tropical island" },
  'd-italy': { src: u('1523906834658-6e24ef2386f9', 800), alt: "Venice" },
  'story': { src: u('1493246507139-91e8fad9978e', 1600), alt: "Mountain lake" },
  'story-window': { src: u('1476673160081-cf065607f449', 500), alt: "Beach at sunset" },
  'x-1': { src: u('1506744038136-46273834b3fb', 700), alt: "Valley at dusk" },
  'x-2': { src: u('1518837695005-2083093ee35b', 700), alt: "Ocean wave" },
  'x-3': { src: u('1436491865332-7a61a109cc05', 700), alt: "Above the clouds" },
  'x-4': { src: u('1472214103451-9374bd1c798e', 700), alt: "Green hills" },
  'banner-person': { src: u('1534528741775-53994a69daeb', 500), alt: "Traveller", pos: 'center 20%' },
  'b-1': { src: u('1488646953014-85cb44e25828', 800), alt: "Map and camera" },
  'b-2': { src: u('1469854523086-cc02fe5d8800', 800), alt: "Road trip" },
  'b-3': { src: u('1519677100203-a0e668c92439', 800), alt: "Prague skyline" },
  'g-1': { src: u('1527631746610-bca00a040d60', 900), alt: "Backpacker in an alley" },
  'g-2': { src: u('1524492412937-b28074a5d7da', 900), alt: "Taj Mahal" },
  'g-3': { src: u('1480796927426-f609979314bd', 900), alt: "Japanese street" },
  'g-4': { src: u('1507699622108-4be3abd695ad', 900), alt: "Auckland skyline" },
  'g-5': { src: u('1500530855697-b586d89ba3ee', 900), alt: "Desert road" },
  'g-6': { src: u('1433086966358-54859d0ed716', 900), alt: "Waterfall" },
  'hero-tours': { src: u('1500530855697-b586d89ba3ee', 1800), alt: "Desert road" },
  'hero-hotels': { src: u('1520250497591-112f2f40a3f4', 1800), alt: "Resort pool" },
  'hero-rest': { src: u('1517248135467-4c7edcad34c4', 1800), alt: "Restaurant interior" },
  'hero-act': { src: u('1476611338391-6f395a0ebc7b', 1800), alt: "Hikers" },
  'hero-dest': { src: u('1523906834658-6e24ef2386f9', 1800), alt: "Venice" },
  'hero-about': { src: u('1530789253388-582c481c54b0', 1800), alt: "Balloons" },
  'hero-blog': { src: u('1527631746610-bca00a040d60', 1800), alt: "Backpacker" },
  'hero-contact': { src: u('1507699622108-4be3abd695ad', 1800), alt: "City skyline" },
  't-1': { src: u('1537996194471-e657df975ab4', 1400), alt: "Bali Escape" },
  't-2': { src: u('1491555103944-7c647fd857e6', 1400), alt: "Swiss Alps Adventure" },
  't-3': { src: u('1542051841857-5f90071e7989', 1400), alt: "Tokyo Discovery" },
  't-4': { src: u('1559128010-7c1ad6e1b6a5', 1400), alt: "Cape Town Journey" },
  't-5': { src: u('1502602898657-3e91760cbb34', 1400), alt: "Paris City Break" },
  't-6': { src: u('1523906834658-6e24ef2386f9', 1400), alt: "Venice Romance" },
  't-7': { src: u('1533105079780-92b9be482077', 1400), alt: "Santorini Sunsets" },
  't-8': { src: u('1493246507139-91e8fad9978e', 1400), alt: "Canadian Rockies Hike" },
  't-9': { src: u('1528127269322-539801943592', 1400), alt: "Ha Long Bay Cruise" },
  't-10': { src: u('1530789253388-582c481c54b0', 1400), alt: "Cappadocia Balloons" },
  'h-1': { src: u('1520250497591-112f2f40a3f4', 800), alt: "Coral Bay Resort" },
  'h-2': { src: u('1533105079780-92b9be482077', 800), alt: "Caldera View Suites" },
  'h-3': { src: u('1499856871958-5b9627545d1a', 800), alt: "Seine Boutique Hotel" },
  'h-4': { src: u('1513635269975-59663e0ac1ad', 800), alt: "Thames Riverside Inn" },
  'r-1': { src: u('1414235077428-338989a2e8c0', 800), alt: "Terrace Table" },
  'r-2': { src: u('1424847651672-bf20a4b0982b', 800), alt: "Brunch Collective" },
  'r-3': { src: u('1555396273-367ea4eb4db5', 800), alt: "Loft Kitchen" },
  'a-1': { src: u('1544551763-46a013bb70d5', 800), alt: "Reef Diving" },
  'a-2': { src: u('1476611338391-6f395a0ebc7b', 800), alt: "Sunset Summit Hike" },
  'a-3': { src: u('1436491865332-7a61a109cc05', 800), alt: "Paragliding Flight" },
  'a-4': { src: u('1559827260-dc66d52bef19', 800), alt: "Windsurf Lesson" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'story': { src: SAMPLE, title: "Our travel story" },
};
