import type { BlogPost, SiteSettings, Testimonial, VideoResource } from '../types/models';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'JK Vaastu',
  founderName: 'Jaydevji',
  phone: '+91 84315 69661',
  whatsapp: '918431569661',
  email: 'jkvastu06@gmail.com',
  locations:
    'Shop 95, First Floor, Pride Icon Mall, Gokul Rd, Chaitanya Nagar, Rajendra Nagar, Hubballi, Karnataka 580030',
  officeHours: 'Mon - Sat, 9:30 AM - 7:30 PM IST',
  logoUrl: '/jkvaastu/logo.png',
  googlePlaceId: '',
  googleBusinessQuery: 'JK Vaastu Pride Icon Mall Gokul Rd Hubballi 580030',
};

export const JKVAASTU_MEDIA_GALLERY = [
  { label: 'Transform Home & Workspace', url: '/jkvaastu/hero-transform.png' },
  { label: 'Home & Workspace Balance', url: '/jkvaastu/hero-workspace.png' },
  { label: 'JK Vaastu Consultation Cover', url: '/jkvaastu/about-cover.jpg' },
  { label: 'Vastu Tips to Attract Money', url: '/jkvaastu/blog-money.png' },
  { label: 'Simple Changes for Positive Energy', url: '/jkvaastu/blog-energy.png' },
  { label: 'Importance of North Direction', url: '/jkvaastu/blog-north.png' },
  { label: 'Vastu Editorial Guide', url: '/jkvaastu/blog-vastu.jpg' },
  { label: 'Vastu for House', url: '/jkvaastu/house.jpg' },
  { label: 'New House Construction', url: '/jkvaastu/new-house.jpg' },
  { label: 'Main Front Door', url: '/jkvaastu/main-door.jpeg' },
  { label: 'Kitchen Alignment', url: '/jkvaastu/kitchen.png' },
  { label: 'Pooja Room Sanctuary', url: '/jkvaastu/pooja-room.jpg' },
  { label: 'Study Room Focus', url: '/jkvaastu/study-room.jpg' },
  { label: 'Master Bedroom Rest', url: '/jkvaastu/bedroom.jpg' },
  { label: 'Corporate Office Vastu', url: '/jkvaastu/corporate.jpg' },
  { label: 'Career & Job Growth', url: '/jkvaastu/career.jpg' },
  { label: 'Health & Vitality', url: '/jkvaastu/health.jpg' },
  { label: 'Marriage & Harmony', url: '/jkvaastu/marriage.jpg' },
  { label: 'Education & Clarity', url: '/jkvaastu/education.jpg' },
  { label: 'Wealth & Prosperity', url: '/jkvaastu/wealth.jpeg' },
];

// Editorial content synthesized from Saral Vaastu's scientific methodology,
// paired strictly with JK Vaastu's authentic media and brand identity.
export const CORE_PILLARS = [
  {
    index: '01',
    title: 'Connect with Cosmic Energy via Directions',
    subtitle: 'Personalized to Date of Birth & Gender',
    description:
      'Every individual carries four favorable and four unfavorable directions calculated from the date of birth and gender of the family head. Aligning daily activities—working, sleeping, studying, and welcoming guests—with your personal favorable directions establishes a steady intake of positive cosmic energy.',
    mechanism: 'Natal directional mapping without generic one-size-fits-all templates.',
    image: '/jkvaastu/blog-north.png',
  },
  {
    index: '02',
    title: 'Balance Cosmic Energy via Structure',
    subtitle: 'Zero Demolition & Zero Structural Breakage',
    description:
      'Whether your residence or workplace is owned or rented, structural walls do not need to be torn down. By auditing the layout, main entrance, kitchen, bedroom, pooja room, and placement of natural elements (Earth, Water, Fire, Air, and Space), energy obstructions are resolved practically.',
    mechanism: 'Non-invasive spatial remedies that save renovation cost and time.',
    image: '/jkvaastu/hero-workspace.png',
  },
  {
    index: '03',
    title: 'Channelize Energy via the Seven Chakras',
    subtitle: 'Aligning Space with Human Vitality',
    description:
      'When living and working spaces are freed from directional disharmony, cosmic energy flows unhindered through the body’s seven subtle energy centers—from stability in the Root Chakra to clarity in the Crown Chakra—supporting health, financial stability, and peaceful relationships.',
    mechanism: 'Continuous subtle alignment during sleep, focus, and daily routines.',
    image: '/jkvaastu/blog-energy.png',
  },
];

export const SEVEN_CHAKRAS = [
  {
    number: '01',
    sanskrit: 'Muladhara',
    english: 'Root Chakra',
    location: 'Base of the spine',
    element: 'Earth',
    influence: 'Financial stability, grounding, security, and physical foundation.',
  },
  {
    number: '02',
    sanskrit: 'Svadhishthana',
    english: 'Sacral Chakra',
    location: 'Lower abdomen / navel region',
    element: 'Water',
    influence: 'Emotional balance, creativity, adaptability, and harmonious bonding.',
  },
  {
    number: '03',
    sanskrit: 'Manipura',
    english: 'Solar Plexus Chakra',
    location: 'Upper abdomen',
    element: 'Fire',
    influence: 'Confidence, career momentum, willpower, and sound decision-making.',
  },
  {
    number: '04',
    sanskrit: 'Anahata',
    english: 'Heart Chakra',
    location: 'Center of the chest',
    element: 'Air',
    influence: 'Compassion, domestic peace, trust, and enduring marital harmony.',
  },
  {
    number: '05',
    sanskrit: 'Vishudha',
    english: 'Throat Chakra',
    location: 'Throat center',
    element: 'Space',
    influence: 'Clear communication, leadership expression, and client negotiations.',
  },
  {
    number: '06',
    sanskrit: 'Ajna',
    english: 'Third Eye Chakra',
    location: 'Between the eyebrows',
    element: 'Light',
    influence: 'Concentration, academic memory, intuition, and strategic foresight.',
  },
  {
    number: '07',
    sanskrit: 'Sahasrara',
    english: 'Crown Chakra',
    location: 'Crown of the head',
    element: 'Cosmic Energy',
    influence: 'Mental serenity, spiritual clarity, and holistic life fulfillment.',
  },
];

export interface ServiceItem {
  id: string;
  group: 'Home & Rooms' | 'Residence & Property' | 'Commercial & Business' | 'Life Verticals';
  title: string;
  summary: string;
  highlights: string[];
  image: string;
  bookingCategory:
    | 'Vastu for House'
    | 'Vastu for Business'
    | 'Career & Job'
    | 'Health & Chakras'
    | 'Marriage & Relationships'
    | 'Education & Study'
    | 'New Property Selection';
}

export const SERVICE_CATALOG: ServiceItem[] = [
  {
    id: 'vastu-house',
    group: 'Home & Rooms',
    title: 'Vastu for House & Main Front Door',
    summary:
      'The main entrance acts as the primary gateway for cosmic energy entering your home. Rather than rigid rules, we evaluate entrance orientation against the family head’s favorable directions to invite health, wealth, and calm.',
    highlights: [
      'Personalized entrance assessment for owned and rented homes',
      'Eliminating domestic discord and financial blockages without demolition',
      'Balanced placement of doorways, foyers, and circulation paths',
    ],
    image: '/jkvaastu/main-door.jpeg',
    bookingCategory: 'Vastu for House',
  },
  {
    id: 'vastu-kitchen',
    group: 'Home & Rooms',
    title: 'Vastu for Kitchen',
    summary:
      'Representing the Fire element (Agni) and family nourishment, kitchen orientation directly affects vitality and prosperity. We harmonize cooking direction, South-East Agneya balance, and water-fire separation.',
    highlights: [
      'Harmonizing stove, sink, and storage zones without rebuilding counters',
      'Supporting family digestion, immunity, and financial retention',
      'Tailored layout advice for compact urban apartments',
    ],
    image: '/jkvaastu/kitchen.png',
    bookingCategory: 'Vastu for House',
  },
  {
    id: 'vastu-bedroom',
    group: 'Home & Rooms',
    title: 'Vastu for Master & Family Bedrooms',
    summary:
      'Sleep occupies one-third of human life and is when the seven chakras recharge most deeply. Correct head-sleeping orientation and bedroom balance foster restorative rest, emotional stability, and marital understanding.',
    highlights: [
      'Individual favorable sleeping directions by date of birth',
      'Eliminating restlessness, chronic fatigue, and relationship friction',
      'Practical mirror, beam, and headboard alignment remedies',
    ],
    image: '/jkvaastu/bedroom.jpg',
    bookingCategory: 'Vastu for House',
  },
  {
    id: 'vastu-pooja',
    group: 'Home & Rooms',
    title: 'Vastu for Pooja Room',
    summary:
      'The spiritual nucleus and energy reservoir of the home. Guided along North-East (Ishan), North, or East principles, a balanced sanctuary anchors mental serenity and radiates clarity across every room.',
    highlights: [
      'Optimal idol orientation and prayer seating direction',
      'Protecting sacred stillness from adjacent utility or structural clashes',
      'Simple spatial adjustments for flats without dedicated prayer rooms',
    ],
    image: '/jkvaastu/pooja-room.jpg',
    bookingCategory: 'Vastu for House',
  },
  {
    id: 'vastu-study',
    group: 'Home & Rooms',
    title: 'Vastu for Study Room',
    summary:
      'Engineered for concentration, memory retention, and examination confidence. Aligning the student’s study desk with their personal auspicious direction minimizes distraction and academic anxiety.',
    highlights: [
      'Individual student directional mapping for peak cognitive focus',
      'Desk placement, lighting balance, and bookshelf zoning',
      'Effective for home study corners and hostel rooms alike',
    ],
    image: '/jkvaastu/study-room.jpg',
    bookingCategory: 'Education & Study',
  },
  {
    id: 'vastu-residence',
    group: 'Residence & Property',
    title: 'New House, Apartments & Property Selection',
    summary:
      'Planning a new house construction or shortlisting an apartment to rent or purchase? Pre-selection Vastu audits prevent decades of directional misalignment before you sign the deed or lay the foundation.',
    highlights: [
      'Floor-plan vetting for new houses, villas, and high-rise flats',
      'Comparative Vastu scoring for shortlisting rental or purchase properties',
      'Plot slope, road alignment, and Brahmasthan preservation',
    ],
    image: '/jkvaastu/new-house.jpg',
    bookingCategory: 'New Property Selection',
  },
  {
    id: 'vastu-business',
    group: 'Commercial & Business',
    title: 'Corporate Offices, Shops & Commercial Spaces',
    summary:
      'Built for enterprises, offices, retail shops, malls, hotels, hospitals, factories, and educational institutes. Aligning leadership cabins, cash counters, and production zones drives turnover, smooth cash flow, and team morale.',
    highlights: [
      'Owner & executive seating aligned to personal wealth directions',
      'Resolving stalled growth, receivables delays, and legal friction',
      'Zero-downtime commercial remedies without halting operations',
    ],
    image: '/jkvaastu/corporate.jpg',
    bookingCategory: 'Vastu for Business',
  },
  {
    id: 'vastu-industry',
    group: 'Commercial & Business',
    title: 'Factories, Hospitals & Commercial Layouts',
    summary:
      'Large-scale operational spaces require disciplined balancing of heavy machinery, raw-material storage, dispatch bays, patient recovery wards, and utilities so operational energy flows smoothly.',
    highlights: [
      'Industrial plant layout, power zones, and dispatch alignment',
      'Hospital and clinic healing-zone optimization',
      'Commercial property selection for lease or acquisition',
    ],
    image: '/jkvaastu/hospital.jpg',
    bookingCategory: 'Vastu for Business',
  },
  {
    id: 'vastu-career',
    group: 'Life Verticals',
    title: 'Career Growth, Job Stability & Wealth',
    summary:
      'Persistent stagnation, delayed promotions, or frequent job transitions often trace back to unfavorable working and home directions. Personalized alignment sharpens professional clarity during interviews, meetings, and daily execution.',
    highlights: [
      'Favorable desk facing for work-from-home and corporate offices',
      'Interview and presentation directional preparation',
      'Clearing cash-flow blockages and strengthening financial stability',
    ],
    image: '/jkvaastu/career.jpg',
    bookingCategory: 'Career & Job',
  },
  {
    id: 'vastu-health',
    group: 'Life Verticals',
    title: 'Health, Vitality & Chakra Balance',
    summary:
      'Chronic fatigue, recurring stress, or disturbed sleep frequently correlate with sleeping or spending prolonged hours in unfavorable zones. Harmonizing structural energies supports the body’s seven chakras.',
    highlights: [
      'Restorative sleeping orientation matched to personal birth profile',
      'Correcting energy drains from bathrooms, kitchens, and dark corners',
      'Holistic alignment complementing modern wellness practices',
    ],
    image: '/jkvaastu/health.jpg',
    bookingCategory: 'Health & Chakras',
  },
  {
    id: 'vastu-marriage',
    group: 'Life Verticals',
    title: 'Marriage & Family Relationships',
    summary:
      'Unresolved communication gaps, recurring arguments, or delays in marriage often reflect disturbed relationship zones inside the residence. Restoring spatial balance nurtures empathy, trust, and household serenity.',
    highlights: [
      'Strengthening emotional harmony among couples and extended family',
      'Correcting imbalances affecting marriage prospects and domestic peace',
      'Subtle, practical home adjustments without disruption',
    ],
    image: '/jkvaastu/marriage.jpg',
    bookingCategory: 'Marriage & Relationships',
  },
  {
    id: 'vastu-education',
    group: 'Life Verticals',
    title: 'Education & Student Success',
    summary:
      'Helping school, university, and competitive-exam students overcome scattered focus and exam stress. By aligning study posture and room energies, students absorb knowledge with greater retention and calm.',
    highlights: [
      'Over 300+ students guided toward academic and career milestones',
      'Tailored guidance for board exams, engineering, medical, and civil services',
      'Actionable setup for bedrooms, study tables, and student hostels',
    ],
    image: '/jkvaastu/education.jpg',
    bookingCategory: 'Education & Study',
  },
];

export const CONSULTATION_STEPS = [
  {
    step: '01',
    title: 'Share Your Details & Floor Plan',
    detail:
      'Submit your consultation request with property type, city, and the date of birth of the family head or business owner.',
  },
  {
    step: '02',
    title: 'Personalized Energy & Direction Audit',
    detail:
      'Jaydevji and our Vastu specialists map your favorable directions, room placements, and underlying cosmic energy imbalances.',
  },
  {
    step: '03',
    title: 'Non-Demolition Action Blueprint',
    detail:
      'Receive practical, step-by-step placement, directional, and chakra-balancing remedies tailored to your exact space.',
  },
  {
    step: '04',
    title: 'Guided Implementation & Follow-Up',
    detail:
      'Apply the simple adjustments at home or work with ongoing guidance from our Bangalore and Hubballi consultation desk.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Does JK Vaastu require demolition or major structural alterations?',
    answer:
      'No. Our scientific, prediction-oriented approach is built on non-demolition remedies. Whether you own your home or live in a rented flat or leased office, we resolve directional and structural energy imbalances without breaking walls, saving substantial time and renovation expense.',
  },
  {
    question: 'Why is the Date of Birth required for Vastu consultation?',
    answer:
      'Traditional rigid rules treat every occupant identically, yet the same house can bring prosperity to one family and difficulties to another. Using the date of birth and gender of the family head (or business owner), we identify the four personally favorable and four unfavorable directions so every recommendation fits your unique energy profile.',
  },
  {
    question: 'Can these principles be applied to a rented apartment or leased office?',
    answer:
      'Yes. Because our solutions focus on connecting with personal favorable directions, optimizing object placement, and balancing the five elements rather than rebuilding walls, they work equally effectively in rented flats, independent houses, and leased commercial offices.',
  },
  {
    question: 'How do living spaces influence the body’s Seven Chakras?',
    answer:
      'Cosmic energy constantly circulates through our surroundings. When you sleep, study, or work aligned with your favorable directions in a balanced structure, positive energy charges the seven chakras smoothly—promoting clearer decision-making, calmer sleep, steadier finances, and stronger relationships.',
  },
  {
    question: 'How soon do clients notice positive changes after implementing remedies?',
    answer:
      'Most families and business owners begin observing calmer environments, improved sleep, and clearer momentum within 30 to 90 days of consistently following the directional and structural recommendations.',
  },
  {
    question: 'Do you offer both Online Consultations and On-Site Visits?',
    answer:
      'Yes. We conduct on-site consultations across Bangalore, Hubballi, and surrounding regions, as well as detailed Online Video and Phone consultations using floor plans and compass readings for clients across India and abroad.',
  },
];

// Starter seed data for initial Firestore seeding (or fallback preview before first seed)
export const STARTER_BLOGS: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Connect, Balance, Channelize: The Scientific Three-Step Vastu Framework',
    slug: 'connect-balance-channelize-scientific-vastu-framework',
    category: 'Vastu Principles',
    excerpt:
      'Discover how aligning personal favorable directions, non-demolition structural balance, and the seven chakras transforms modern homes and workplaces.',
    content:
      'Scientific Vastu Shastra is not about superstition or tearing down concrete walls. At its core, it is an architectural and directional discipline designed to harmonize human beings with omnipresent cosmic energy.\n\n1. Connect with Cosmic Energy via Directions\nEvery individual has four favorable and four unfavorable directions derived from their date of birth and gender. When you face a favorable direction while working, studying, or conducting business negotiations—and align your head in a supportive direction during sleep—your daily routine draws steady, constructive energy.\n\n2. Balance Cosmic Energy via Structure\nThe five elements (Earth, Water, Fire, Air, and Space) govern every room of a property. Whether you live in an owned independent house or a rented urban apartment, clearing clutter from the Brahmasthan (central zone), harmonizing the South-East kitchen fire zone, and keeping the North-East serene allows energy to circulate unhindered—without any structural demolition.\n\n3. Channelize Cosmic Energy via the Seven Chakras\nOnce your environment is harmonized, cosmic energy naturally charges the body’s seven subtle energy centers—from stability in Muladhara (Root) to strategic clarity in Ajna (Third Eye). Over time, families report calmer sleep, fewer domestic misunderstandings, and sharper professional focus.',
    coverImage: '/jkvaastu/blog-energy.png',
    author: 'Jaydevji',
    readTime: '5 min read',
    status: 'published',
    featured: true,
  },
  {
    title: 'Importance of the North Direction for Financial Stability and Career Growth',
    slug: 'importance-of-north-direction-financial-stability',
    category: 'Career & Wealth',
    excerpt:
      'Learn why the North zone governs opportunity flow, cash liquidity, and career expansion—and practical ways to keep it balanced without renovation.',
    content:
      'In Vedic spatial science, the North direction is associated with Kubera—the principle of steady resource flow, new opportunities, and professional expansion. Many households and offices unknowingly block this vital sector with heavy storage cabinets, unused scrap, or dark, stagnant corners.\n\nKey Signs of a Blocked North Zone\n• Delayed client payments or unpredictable cash flow despite strong effort\n• Career stagnation or missed promotions\n• Difficulty converting business leads into sustained partnerships\n\nPractical Non-Demolition Adjustments\nKeep the North zone of your home and office clean, well-lit, and visually open. Avoid placing heavy metallic clutter or red-dominated decor in this sector. If your personal date-of-birth chart marks North as one of your favorable directions, positioning your work desk to face North during critical calls and strategy sessions can noticeably sharpen clarity and confidence.',
    coverImage: '/jkvaastu/blog-north.png',
    author: 'Jaydevji',
    readTime: '4 min read',
    status: 'published',
    featured: false,
  },
  {
    title: 'Vastu Tips to Attract Prosperity in Homes and Commercial Workspaces',
    slug: 'vastu-tips-attract-prosperity-home-workspace',
    category: 'Business Vastu',
    excerpt:
      'Simple, logical adjustments for main entrances, leadership cabins, and cash zones that strengthen business stability and family peace.',
    content:
      'Prosperity grows where clarity, discipline, and balanced spatial energy meet. In commercial offices, shops, and residences alike, small directional misalignments can quietly drain momentum.\n\nMain Entrance Clarity\nYour front door is the primary threshold through which opportunities enter. Ensure the entrance is bright, squeak-free, and unobstructed by footwear racks or broken fixtures.\n\nWorkspace & Leadership Orientation\nBusiness owners and decision-makers benefit from sitting in a stable zone with a solid wall behind them, facing one of their personally favorable directions calculated by date of birth. Keep accounts, ledgers, and cash safes organized and free from dampness or clutter.\n\nHarmonizing Residence and Office Together\nBecause the family head spends critical restorative hours at home, corporate Vastu delivers its strongest results when both the commercial space and the home bedroom/kitchen alignment are audited together.',
    coverImage: '/jkvaastu/blog-money.png',
    author: 'Jaydevji',
    readTime: '6 min read',
    status: 'published',
    featured: false,
  },
  {
    title: 'Room-by-Room Home Vastu Guide: Main Door, Kitchen, Pooja Room & Study',
    slug: 'room-by-room-home-vastu-guide',
    category: 'Home Vastu',
    excerpt:
      'A clear blueprint explaining how each zone of your house supports health, harmony, and student concentration—without structural breakage.',
    content:
      'Every room in a home serves a distinct energetic purpose. Understanding how these rooms interact helps families build a peaceful living environment.\n\nMain Door\nEvaluate entrance energy according to the homeowner’s personal favorable directions. Keep the threshold welcoming, clean, and well-illuminated.\n\nKitchen (Agneya Zone)\nThe kitchen embodies nourishment and fire. Separating direct contact between the cooking stove (fire) and sink (water) while maintaining natural ventilation supports family health.\n\nPooja Room (Ishan Sanctuary)\nPositioned ideally in the calm North-East, North, or East sectors, the prayer room should remain uncluttered and separated from washroom walls.\n\nStudy Room\nStudents achieve stronger concentration and recall when seated facing their favorable intellectual direction (commonly North or East, refined by date of birth), with clean lighting and minimal visual distractions behind the desk.',
    coverImage: '/jkvaastu/blog-vastu.jpg',
    author: 'Jaydevji',
    readTime: '5 min read',
    status: 'published',
    featured: false,
  },
];

export const STARTER_TESTIMONIALS: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    clientName: 'Ramesh K.',
    role: 'Software Engineer',
    city: 'Bengaluru',
    serviceUsed: 'Vastu for House',
    quote:
      'After implementing the Vastu corrections suggested by JK Vaastu, we noticed a significant improvement in our home environment. There is more peace, better sleep, and overall positivity without breaking a single wall.',
    rating: 5,
    status: 'published',
  },
  {
    clientName: 'Priya S.',
    role: 'Business Owner',
    city: 'Mumbai',
    serviceUsed: 'Vastu for Business',
    quote:
      'Our business was facing constant losses despite our best efforts. Jaydevji guided us with simple yet effective directional and workspace changes. Within a few months, we saw steady growth and financial stability.',
    rating: 5,
    status: 'published',
  },
  {
    clientName: 'Ankit Roy',
    role: 'Management Consultant',
    city: 'Bengaluru',
    serviceUsed: 'Career & Job',
    quote:
      'The consultation was detailed, logical, and easy to follow. Every remedy was practical for our rented apartment and did not require major structural changes. Highly recommended.',
    rating: 5,
    status: 'published',
  },
  {
    clientName: 'Vikram N.',
    role: 'IT Consultant',
    city: 'Hyderabad',
    serviceUsed: 'New Property Selection',
    quote:
      'JK Vaastu provided clear, step-by-step guidance for our new home construction. Every directional principle was explained logically, and the results for our family have been remarkably positive.',
    rating: 5,
    status: 'published',
  },
];

export const STARTER_VIDEOS: Omit<VideoResource, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Live Vastu Awareness Webinar: Balancing Cosmic Energy Without Demolition',
    category: 'Webinar',
    videoUrl: 'https://jkvaastu.com/join-webinar/',
    thumbnailUrl: '/jkvaastu/hero-transform.png',
    duration: '45 min session',
    description:
      'Join Jaydevji to learn how personal favorable directions, five-element home balance, and the seven chakras work together for modern apartments and offices.',
    status: 'published',
  },
  {
    title: 'Vastu for Home & Workspace: Practical Remedies for Rented & Owned Properties',
    category: 'Home Vastu',
    videoUrl: 'https://jkvaastu.com/vastu-for-house/',
    thumbnailUrl: '/jkvaastu/hero-workspace.png',
    duration: '28 min guide',
    description:
      'Step-by-step walkthrough of main entrance alignment, kitchen fire-water balance, and restful sleeping directions for families.',
    status: 'published',
  },
  {
    title: 'Unlocking North Direction & Cash-Flow Alignment for Growing Businesses',
    category: 'Business Vastu',
    videoUrl: 'https://jkvaastu.com/vastu-for-commercial/',
    thumbnailUrl: '/jkvaastu/blog-money.png',
    duration: '32 min session',
    description:
      'How entrepreneurs and corporate teams organize leadership seating, reception zones, and account desks to restore business momentum.',
    status: 'published',
  },
];

// Exact Personalized Favorable Direction Engine (Eight Mansions / Saral Vaastu Kua System)
// Supports all 8 Kua profiles (1, 2, 3, 4, 6, 7, 8, 9) with Solar Year (Feb 4) boundary adjustment.
export type CompassDirection =
  | 'North'
  | 'North-East'
  | 'East'
  | 'South-East'
  | 'South'
  | 'South-West'
  | 'West'
  | 'North-West';

export interface RankedDirection {
  rank: 1 | 2 | 3 | 4;
  direction: CompassDirection;
  degrees: string;
  category: string;
  benefit: string;
}

export interface UnfavorableDirection {
  direction: CompassDirection;
  degrees: string;
  severity: string;
  caution: string;
}

export interface DirectionProfile {
  fullName?: string;
  birthDate: string;
  gender: 'male' | 'female';
  solarYearUsed: number;
  solarAdjustmentApplied: boolean;
  lastTwoDigitsSum: number;
  energyNumber: 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9;
  rawBeforeFiveRule: number;
  groupName: 'East Group' | 'West Group';
  element: string;
  trigram: string;
  favorableColors: string[];
  favorable: RankedDirection[];
  unfavorable: UnfavorableDirection[];
  primaryChakra: string;
  mainDoorRecommendation: string;
  sleepRecommendation: string;
  workRecommendation: string;
  formulaSummary: string;
}

const DIRECTION_DEGREES: Record<CompassDirection, string> = {
  North: '337.5° – 22.5°',
  'North-East': '22.5° – 67.5°',
  East: '67.5° – 112.5°',
  'South-East': '112.5° – 157.5°',
  South: '157.5° – 202.5°',
  'South-West': '202.5° – 247.5°',
  West: '247.5° – 292.5°',
  'North-West': '292.5° – 337.5°',
};

interface KuaTableEntry {
  groupName: 'East Group' | 'West Group';
  element: string;
  trigram: string;
  favorableColors: string[];
  primaryChakra: string;
  // Ordered strictly: [1st Success/Prosperity, 2nd Health, 3rd Marriage/Relationships, 4th Education/Personal Growth]
  favorableOrder: [CompassDirection, CompassDirection, CompassDirection, CompassDirection];
  // Ordered strictly: [Minor Obstacles, Five Ghosts/Stress, Six Killings/Disputes, Total Loss/Most Unfavorable]
  unfavorableOrder: [CompassDirection, CompassDirection, CompassDirection, CompassDirection];
}

const EXACT_KUA_TABLE: Record<1 | 2 | 3 | 4 | 6 | 7 | 8 | 9, KuaTableEntry> = {
  1: {
    groupName: 'East Group',
    element: 'Water',
    trigram: 'Kan',
    favorableColors: ['Deep Blue', 'White', 'Metallic Grey', 'Sea Green'],
    primaryChakra: 'Svadhishthana (Sacral) & Vishudha (Throat)',
    favorableOrder: ['South-East', 'East', 'South', 'North'],
    unfavorableOrder: ['West', 'North-East', 'North-West', 'South-West'],
  },
  2: {
    groupName: 'West Group',
    element: 'Earth',
    trigram: 'Kun',
    favorableColors: ['Warm Beige', 'Earthy Yellow', 'Terracotta', 'Soft Coral'],
    primaryChakra: 'Muladhara (Root) & Anahata (Heart)',
    favorableOrder: ['North-East', 'West', 'North-West', 'South-West'],
    unfavorableOrder: ['East', 'South-East', 'South', 'North'],
  },
  3: {
    groupName: 'East Group',
    element: 'Wood (Yang)',
    trigram: 'Zhen',
    favorableColors: ['Emerald Green', 'Teal', 'Soft Blue', 'Natural Wood'],
    primaryChakra: 'Anahata (Heart) & Manipura (Solar Plexus)',
    favorableOrder: ['South', 'North', 'South-East', 'East'],
    unfavorableOrder: ['South-West', 'North-West', 'North-East', 'West'],
  },
  4: {
    groupName: 'East Group',
    element: 'Wood (Yin)',
    trigram: 'Xun',
    favorableColors: ['Sage Green', 'Aqua Blue', 'Light Teal', 'Cream'],
    primaryChakra: 'Anahata (Heart) & Ajna (Third Eye)',
    favorableOrder: ['North', 'South', 'East', 'South-East'],
    unfavorableOrder: ['North-West', 'South-West', 'West', 'North-East'],
  },
  6: {
    groupName: 'West Group',
    element: 'Metal (Yang)',
    trigram: 'Qian',
    favorableColors: ['Ivory White', 'Warm Gold', 'Silver Grey', 'Ochre'],
    primaryChakra: 'Ajna (Third Eye) & Sahasrara (Crown)',
    favorableOrder: ['West', 'North-East', 'South-West', 'North-West'],
    unfavorableOrder: ['South-East', 'East', 'North', 'South'],
  },
  7: {
    groupName: 'West Group',
    element: 'Metal (Yin)',
    trigram: 'Dui',
    favorableColors: ['Pearl White', 'Champagne Gold', 'Sandstone', 'Light Grey'],
    primaryChakra: 'Vishudha (Throat) & Muladhara (Root)',
    favorableOrder: ['North-West', 'South-West', 'North-East', 'West'],
    unfavorableOrder: ['North', 'South', 'South-East', 'East'],
  },
  8: {
    groupName: 'West Group',
    element: 'Earth (Mountain)',
    trigram: 'Gen',
    favorableColors: ['Warm Sand', 'Saffron Ochre', 'Cream', 'Soft Amber'],
    primaryChakra: 'Muladhara (Root) & Ajna (Third Eye)',
    favorableOrder: ['South-West', 'North-West', 'West', 'North-East'],
    unfavorableOrder: ['South', 'North', 'East', 'South-East'],
  },
  9: {
    groupName: 'East Group',
    element: 'Fire',
    trigram: 'Li',
    favorableColors: ['Warm Saffron', 'Coral', 'Olive Green', 'Burgundy'],
    primaryChakra: 'Manipura (Solar Plexus) & Sahasrara (Crown)',
    favorableOrder: ['East', 'South-East', 'North', 'South'],
    unfavorableOrder: ['North-East', 'West', 'South-West', 'North-West'],
  },
};

function reduceToSingleDigit(n: number): number {
  let sum = Math.abs(Math.trunc(n));
  while (sum > 9) {
    sum = String(sum)
      .split('')
      .reduce((acc, ch) => acc + parseInt(ch, 10), 0);
  }
  return sum;
}

export function calculateFavorableDirections(
  birthDate: string,
  gender: 'male' | 'female',
  fullName?: string
): DirectionProfile | null {
  if (!birthDate) return null;
  const parts = birthDate.split('-');
  if (parts.length !== 3) return null;
  const calYear = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (
    Number.isNaN(calYear) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    calYear < 1920 ||
    calYear > 2026 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  // Standard Vastu / Eight Mansions Solar Year boundary (Feb 4 Lichun):
  // Births from Jan 1 through Feb 3 align to the preceding solar year.
  const solarAdjustmentApplied = month === 1 || (month === 2 && day < 4);
  const solarYearUsed = solarAdjustmentApplied ? calYear - 1 : calYear;

  const lastTwo = solarYearUsed % 100;
  const lastTwoDigitsSum = reduceToSingleDigit(Math.floor(lastTwo / 10) + (lastTwo % 10));

  let rawNum: number;
  let formulaSummary: string;
  if (gender === 'male') {
    if (solarYearUsed >= 2000) {
      rawNum = reduceToSingleDigit(9 - lastTwoDigitsSum);
      if (rawNum === 0) rawNum = 9;
      formulaSummary = `Male (2000+): 9 − ${lastTwoDigitsSum} = ${rawNum}`;
    } else {
      rawNum = reduceToSingleDigit(10 - lastTwoDigitsSum);
      if (rawNum === 0) rawNum = 9;
      formulaSummary = `Male (1900s): 10 − ${lastTwoDigitsSum} = ${rawNum}`;
    }
  } else {
    if (solarYearUsed >= 2000) {
      rawNum = reduceToSingleDigit(lastTwoDigitsSum + 6);
      formulaSummary = `Female (2000+): ${lastTwoDigitsSum} + 6 → ${rawNum}`;
    } else {
      rawNum = reduceToSingleDigit(lastTwoDigitsSum + 5);
      formulaSummary = `Female (1900s): ${lastTwoDigitsSum} + 5 → ${rawNum}`;
    }
  }

  let finalKua: 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9;
  if (rawNum === 5) {
    finalKua = gender === 'male' ? 2 : 8;
    formulaSummary += ` (Kua 5 maps to ${finalKua} for ${gender === 'male' ? 'Male' : 'Female'})`;
  } else {
    finalKua = rawNum as 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9;
  }

  const entry = EXACT_KUA_TABLE[finalKua];
  const [d1, d2, d3, d4] = entry.favorableOrder;
  const [u1, u2, u3, u4] = entry.unfavorableOrder;

  const favorable: RankedDirection[] = [
    {
      rank: 1,
      direction: d1,
      degrees: DIRECTION_DEGREES[d1],
      category: '1st Best · Wealth, Career & Success',
      benefit: `Primary prosperity axis for Kua ${finalKua}. Best direction to face for business decisions, interviews, leadership desks, and main property entrance.`,
    },
    {
      rank: 2,
      direction: d2,
      degrees: DIRECTION_DEGREES[d2],
      category: '2nd Best · Health & Vitality',
      benefit: `Restorative healing direction. Ideal head-sleeping orientation and kitchen/dining focus to recharge immunity and reduce fatigue.`,
    },
    {
      rank: 3,
      direction: d3,
      degrees: DIRECTION_DEGREES[d3],
      category: '3rd Best · Marriage, Family & Harmony',
      benefit: `Nurtures trust, marital harmony, diplomacy, and smooth client or family relationships.`,
    },
    {
      rank: 4,
      direction: d4,
      degrees: DIRECTION_DEGREES[d4],
      category: '4th Best · Education, Focus & Stability',
      benefit: `Supports calm concentration, student memory retention, meditation, and steady personal growth.`,
    },
  ];

  const unfavorable: UnfavorableDirection[] = [
    {
      direction: u1,
      degrees: DIRECTION_DEGREES[u1],
      severity: 'Minor Obstacles',
      caution: 'Avoid placing your primary work desk facing here; may cause avoidable delays.',
    },
    {
      direction: u2,
      degrees: DIRECTION_DEGREES[u2],
      severity: 'Stress & Friction',
      caution: 'Minimize prolonged sitting or sleeping facing this sector to avoid misunderstandings.',
    },
    {
      direction: u3,
      degrees: DIRECTION_DEGREES[u3],
      severity: 'Disputes & Drain',
      caution: 'Keep clutter-free and avoid using for financial ledgers or key negotiations.',
    },
    {
      direction: u4,
      degrees: DIRECTION_DEGREES[u4],
      severity: 'Most Unfavorable',
      caution: 'Avoid main entrance or bed-head alignment here; consult JK Vaastu for non-demolition balancing.',
    },
  ];

  return {
    fullName: fullName?.trim() || undefined,
    birthDate,
    gender,
    solarYearUsed,
    solarAdjustmentApplied,
    lastTwoDigitsSum,
    energyNumber: finalKua,
    rawBeforeFiveRule: rawNum,
    groupName: entry.groupName,
    element: entry.element,
    trigram: entry.trigram,
    favorableColors: entry.favorableColors,
    favorable,
    unfavorable,
    primaryChakra: entry.primaryChakra,
    mainDoorRecommendation: `Ideally align or energize your main entrance toward ${d1} (${DIRECTION_DEGREES[d1]}) or ${d3} (${DIRECTION_DEGREES[d3]}) for sustained prosperity and domestic peace.`,
    sleepRecommendation: `Position your bed so the crown of your head points toward ${d2} (Health) or ${d3} (Harmony) while resting; avoid pointing your head toward ${u4}.`,
    workRecommendation: `Face ${d1} during business negotiations, career tasks, and office hours, or face ${d4} during deep study and exam preparation.`,
    formulaSummary,
  };
}
