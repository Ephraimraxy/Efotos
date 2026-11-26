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

const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.MEDIA = {
  'hero': { src: u('1530521954074-e64f6810b32d', 1800), alt: "Traveller relaxing at an airport lounge", pos: 'center 40%' },
  'av-1': { src: u('1487412720507-e7ab37603c6f', 200), alt: "Happy traveller" },
  'av-2': { src: u('1500648767791-00dcc994a43e', 200), alt: "Happy traveller" },
  'av-3': { src: u('1494790108377-be9c29b29330', 200), alt: "Happy traveller" },
  'about-1': { src: u('1487412720507-e7ab37603c6f', 900), alt: "Traveller in a beanie" },
  'about-2': { src: u('1520250497591-112f2f40a3f4', 900), alt: "Tropical resort" },
  'd-france': { src: u('1502602898657-3e91760cbb34', 800), alt: "Eiffel Tower" },
  'd-bali': { src: u('1537996194471-e657df975ab4', 800), alt: "Bali temple" },
  'd-maldives': { src: u('1520250497591-112f2f40a3f4', 800), alt: "Tropical resort" },
  'd-italy': { src: u('1523906834658-6e24ef2386f9', 800), alt: "Venice" },
  'story': { src: u('1501785888041-af3ef285b470', 1600), alt: "Turquoise lake" },
  'story-window': { src: u('1507525428034-b723cf961d3e', 500), alt: "Beach at sunset" },
  'x-1': { src: u('1476611338391-6f395a0ebc7b', 700), alt: "Hikers at sunset" },
  'x-2': { src: u('1559827260-dc66d52bef19', 700), alt: "Ocean wave" },
  'x-3': { src: u('1436491865332-7a61a109cc05', 700), alt: "Above the clouds" },
  'x-4': { src: u('1470071459604-3b5ec3a7fe05', 700), alt: "Green hills" },
  'banner-person': { src: u('1438761681033-6461ffad8d80', 500), alt: "Traveller", pos: 'center 20%' },
  'b-1': { src: u('1488646953014-85cb44e25828', 800), alt: "Map and camera" },
  'b-2': { src: u('1469854523086-cc02fe5d8800', 800), alt: "Road trip" },
  'b-3': { src: u('1513635269975-59663e0ac1ad', 800), alt: "London skyline" },
  'hero-tours': { src: u('1476514525535-07fb3b4ae5f1', 1800), alt: "Alpine lake" },
  'hero-hotels': { src: u('1520250497591-112f2f40a3f4', 1800), alt: "Resort pool" },
  'hero-rest': { src: u('1511795409834-ef04bbd61622', 1800), alt: "Dining table" },
  'hero-act': { src: u('1476611338391-6f395a0ebc7b', 1800), alt: "Hikers" },
  'hero-dest': { src: u('1523906834658-6e24ef2386f9', 1800), alt: "Venice" },
  'hero-about': { src: u('1530789253388-582c481c54b0', 1800), alt: "Balloons" },
  'hero-blog': { src: u('1488646953014-85cb44e25828', 1800), alt: "Map" },
  'hero-contact': { src: u('1436491865332-7a61a109cc05', 1800), alt: "Wing view" },
  't-1': { src: u('1537996194471-e657df975ab4', 800), alt: "Bali Escape" },
  't-2': { src: u('1464822759023-fed622ff2c3b', 800), alt: "Swiss Alps Adventure" },
  't-3': { src: u('1530789253388-582c481c54b0', 800), alt: "Cappadocia Discovery" },
  't-4': { src: u('1507525428034-b723cf961d3e', 800), alt: "Maldives Journey" },
  't-5': { src: u('1502602898657-3e91760cbb34', 800), alt: "Paris City Break" },
  't-6': { src: u('1523906834658-6e24ef2386f9', 800), alt: "Venice Romance" },
  't-7': { src: u('1533105079780-92b9be482077', 800), alt: "Santorini Sunsets" },
  't-8': { src: u('1501785888041-af3ef285b470', 800), alt: "Lake Braies Hike" },
  'h-1': { src: u('1520250497591-112f2f40a3f4', 800), alt: "Coral Bay Resort" },
  'h-2': { src: u('1533105079780-92b9be482077', 800), alt: "Caldera View Suites" },
  'h-3': { src: u('1499856871958-5b9627545d1a', 800), alt: "Seine Boutique Hotel" },
  'h-4': { src: u('1513635269975-59663e0ac1ad', 800), alt: "Thames Riverside Inn" },
  'r-1': { src: u('1511795409834-ef04bbd61622', 800), alt: "Terrace Table" },
  'r-2': { src: u('1528605248644-14dd04022da1', 800), alt: "The Long Table" },
  'a-1': { src: u('1544551763-46a013bb70d5', 800), alt: "Reef Diving" },
  'a-2': { src: u('1476611338391-6f395a0ebc7b', 800), alt: "Sunset Summit Hike" },
  'a-3': { src: u('1436491865332-7a61a109cc05', 800), alt: "Paragliding Flight" },
  'a-4': { src: u('1559827260-dc66d52bef19', 800), alt: "Windsurf Lesson" },
};

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
window.VIDEOS = {
  'story': { src: SAMPLE, title: "Our travel story" },
};
