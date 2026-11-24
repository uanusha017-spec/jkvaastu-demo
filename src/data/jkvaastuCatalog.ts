import type { ServiceCategory } from '../types/models';

export type ServiceGroupId =
  | 'vastu-for-house'
  | 'vastu-for-residence'
  | 'vastu-for-commercial'
  | 'other-services';

export interface ServiceTipSection {
  heading: string;
  points: string[];
}

export interface JKServiceDetail {
  slug: string;
  groupId: ServiceGroupId;
  groupLabel: string;
  title: string;
  image: string;
  bookingCategory: ServiceCategory;
  introHeading: string;
  summary: string;
  introParagraphs: string[];
  tips: ServiceTipSection[];
}

export interface JKServiceGroup {
  id: ServiceGroupId;
  label: string;
  shortLabel: string;
  coverImage: string;
  bookingCategory: ServiceCategory;
  summary: string;
  introParagraphs: string[];
  items: JKServiceDetail[];
}

// Authentic content & visual assets fetched directly from https://jkvaastu.com/about-us/
export const JK_ABOUT_US = {
  eyebrow: 'About JK Vaastu · Authentic Vedic Vastu Shastra',
  headline: 'Creating Spaces Filled With Positivity, Balance & Prosperity',
  leadParagraphs: [
    'JK Vastu is dedicated to helping individuals, families, and businesses create spaces filled with positivity, balance, and prosperity through the principles of Vastu Shastra and ancient Vedic sciences. Our mission is to guide people in aligning their homes and workplaces with natural energies so they can experience better health, success, and harmony in life.',
    'At JK Vastu, we believe that the environment around us plays a vital role in shaping our experiences and outcomes. When a space is properly aligned according to Vastu principles, it can support peaceful relationships, financial growth, mental clarity, and overall well-being.',
  ],
  founderTitle: 'About Jaydevji',
  founderParagraphs: [
    'Jaydevji’s mission is to guide people toward a life filled with balance, peace, and success. Through his consultations and teachings, he aims to spread awareness about the power of Vedic sciences and the importance of maintaining positive energy in everyday life.',
    'Today, Jaydevji continues to inspire and guide individuals from different walks of life who seek clarity, practical Vastu solutions, and spiritual growth.',
  ],
  mission:
    'At JK Vastu, our mission is to help individuals and families create balanced, peaceful, and prosperous living and working environments through the authentic principles of Vastu Shastra. We aim to provide practical guidance that helps people align their spaces with natural energies, allowing them to experience better health, stronger relationships, and greater success in life. Our goal is to make the ancient knowledge of Vastu simple, accessible, and applicable to modern lifestyles so that anyone can benefit from positive energy and harmonious surroundings.',
  vision:
    'Our vision is to become a trusted name in Vastu consultation, helping people across different places transform their homes, offices, and workplaces into spaces filled with positivity and harmony. We aspire to spread awareness about the importance of energy balance and Vastu principles, empowering individuals to create environments that support happiness, stability, and long-term prosperity. Through continuous guidance and dedication, JK Vastu aims to inspire people to live in spaces that nurture peace, growth, and success.',
  approach: [
    'At JK Vastu, we combine traditional Vastu principles with practical solutions that are easy to implement. Our approach focuses on identifying energy imbalances in a space and recommending remedies that help restore harmony and positivity.',
    'We believe that even small changes in the placement of objects, direction, and energy flow can create significant improvements in a person’s life.',
  ],
  whyChoose: [
    'Guidance based on authentic Vastu principles',
    'Practical solutions without unnecessary structural changes',
    'Personalized consultation for homes and businesses based on date of birth',
    'Focus on creating positive, balanced, and confidential environments',
  ],
  includedServices: [
    'Residential plot analysis',
    'Commercial site evaluation',
    'Direction & road assessment',
    'Energy field testing',
    'Vastu remedies for existing sites',
    'Online & On-site consultation',
    'Personalized Vastu guidance based on date of birth',
  ],
  images: {
    portrait: '/jkvaastu/about-portrait.png',
    consult: '/jkvaastu/guruji-consult.png',
    cover: '/jkvaastu/cover-2.jpg',
    sanctuary: '/jkvaastu/about-cover.jpg',
  },
};

export const JK_SERVICE_GROUPS: JKServiceGroup[] = [
  {
    "id": "vastu-for-house",
    "label": "Vastu For House",
    "shortLabel": "House",
    "coverImage": "/jkvaastu/house.jpg",
    "bookingCategory": "Vastu for House",
    "summary": "Vastu Shastra plays a vital role in creating a harmonious and balanced living environment by aligning your home with natural energies. A well-designed Vaastu-compliant house ensures positive energy flow, promoting health, prosperity, and peace of mind for its residents. Key aspects such as the direction of the main entrance, placement of rooms, positioning of the kitchen, and location of the master bedroom significantly influence the overall well-being of the occupants. For example, the northeast direction is considered highly auspicious for prayer rooms and water elements, while the southeast is ideal for the kitchen as it represents the fire element. Proper ventilation, natural lighting, and clutter-free spaces further enhance positive vibrations within the home. By following Vastu principles, one can minimize negative influences and create a space that supports success, happiness, and spiritual growth.",
    "introParagraphs": [
      "Vastu Shastra plays a vital role in creating a harmonious and balanced living environment by aligning your home with natural energies. A well-designed Vaastu-compliant house ensures positive energy flow, promoting health, prosperity, and peace of mind for its residents. Key aspects such as the direction of the main entrance, placement of rooms, positioning of the kitchen, and location of the master bedroom significantly influence the overall well-being of the occupants. For example, the northeast direction is considered highly auspicious for prayer rooms and water elements, while the southeast is ideal for the kitchen as it represents the fire element. Proper ventilation, natural lighting, and clutter-free spaces further enhance positive vibrations within the home. By following Vastu principles, one can minimize negative influences and create a space that supports success, happiness, and spiritual growth."
    ],
    "items": [
      {
        "slug": "vastu-for-main-front-door",
        "groupId": "vastu-for-house",
        "groupLabel": "Vastu For House",
        "title": "Vastu For Main Front Door",
        "image": "/jkvaastu/main-door.jpeg",
        "bookingCategory": "Vastu for House",
        "introHeading": "What is Vastu for Main Front Door?",
        "summary": "The main front door is the primary entry point for positive cosmic energy, wealth, and well-being into your home. At JK Vaastu, we evaluate entrance orientation, surrounding plot slope, road alignment, and personal favorable directions to ensure every entry invites prosperity and peaceful living.",
        "introParagraphs": [
          "The main front door is the gateway of cosmic energy into your residence. According to Vastu Shastra, both the orientation of the main entrance and the surrounding plot geometry directly influence the financial stability, health, and harmony of the people who live within.",
          "Before finalizing an entrance or building on a plot, it is essential to analyze how natural energies flow into the threshold. A well-aligned entrance and plot with strong positive energy bring financial stability, career growth, family harmony, and peaceful living.",
          "At JK Vaastu, we provide expert Main Entrance & Site Vastu consultation to help you align doors and thresholds without unnecessary structural breakage."
        ],
        "tips": [
          {
            "heading": "Plot Shape",
            "points": [
              "Square and rectangular plots are considered most auspicious.",
              "Avoid triangular, irregular, or cut-corner plots."
            ]
          },
          {
            "heading": "Plot Direction",
            "points": [
              "North-facing and East-facing plots are highly beneficial.",
              "West-facing plots can also be good with proper planning.",
              "Avoid plots with South-West road extensions."
            ]
          },
          {
            "heading": "Slope Of The Land",
            "points": [
              "The land should slope towards North or East.",
              "South or South-West slopes are generally not recommended."
            ]
          },
          {
            "heading": "Surroundings",
            "points": [
              "Avoid plots near graveyards, hospitals, heavy industries, or polluted areas.",
              "Plots near temples or water bodies require proper evaluation."
            ]
          },
          {
            "heading": "Road Position",
            "points": [
              "Roads in North or East bring positive energy.",
              "T-junction plots require careful Vastu analysis."
            ]
          },
          {
            "heading": "Soil Quality",
            "points": [
              "Fertile soil with natural fragrance is considered good.",
              "Rocky, dry, or foul-smelling land may indicate negative vibrations."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-kitchen",
        "groupId": "vastu-for-house",
        "groupLabel": "Vastu For House",
        "title": "Vastu For Kitchen",
        "image": "/jkvaastu/kitchen.png",
        "bookingCategory": "Vastu for House",
        "introHeading": "What is Vastu for Kitchen?",
        "summary": "The kitchen is one of the most important areas in a home according to Vaastu Shastra, as it represents health, energy, and prosperity. Ideally, the kitchen should be located in the southeast direction, which is governed by the fire element. Furthermore, cooking should be done facing east to promote positive energy and well-being. In addition, the placement of the stove, sink, and storage should be balanced to maintain harmony between fire and water elements. Moreover, keeping the kitchen clean, well-lit, and clutter-free further enhances the flow of positive vibrations. Ultimately, following Vastu principles in the kitchen not only improves physical health but also brings peace, prosperity, and happiness to the entire household.",
        "introParagraphs": [
          "The kitchen is one of the most important areas in a home according to Vaastu Shastra, as it represents health, energy, and prosperity. Ideally, the kitchen should be located in the southeast direction, which is governed by the fire element. Furthermore, cooking should be done facing east to promote positive energy and well-being. In addition, the placement of the stove, sink, and storage should be balanced to maintain harmony between fire and water elements. Moreover, keeping the kitchen clean, well-lit, and clutter-free further enhances the flow of positive vibrations. Ultimately, following Vastu principles in the kitchen not only improves physical health but also brings peace, prosperity, and happiness to the entire household."
        ],
        "tips": [
          {
            "heading": "Placement of Stove",
            "points": [
              "The stove should be placed in the South-East Corner of the kitchen.",
              "The person cooking should face East Direction, which brings positivity and good health.",
              "Avoid placing the stove directly in front of the entrance."
            ]
          },
          {
            "heading": "Storage of Appliances",
            "points": [
              "Store grains, pulses, and heavy items in the South or West Direction.",
              "Electrical appliances like microwave, oven, and mixer should be placed in the South-East.",
              "Avoid placing heavy storage in the North -East Corner."
            ]
          },
          {
            "heading": "Ventilation and Lighting",
            "points": [
              "The kitchen should have proper ventilation to allow fresh air and remove negative energy.",
              "Windows in the East direction are ideal.",
              "Keep the kitchen well-lit and clean at all times."
            ]
          },
          {
            "heading": "Sink And Water Placement",
            "points": [
              "Water elements like sink or purifier should be placed in the North-East Direction.",
              "Ensure there is distance between stove(fire) and sink(water) to maintain balance of elements."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-pooja-room",
        "groupId": "vastu-for-house",
        "groupLabel": "Vastu For House",
        "title": "Vastu For Pooja Room",
        "image": "/jkvaastu/pooja-room.jpg",
        "bookingCategory": "Vastu for House",
        "introHeading": "What is Vastu for Pooja Room?",
        "summary": "The pooja room is the most sacred space in a home, and as per Vastu Shastra, its placement and design play a vital role in attracting positive energy, peace, and prosperity. Ideally, the pooja room should be located in the north-east (Ishanya) direction, which is considered the most auspicious zone. The idols or pictures of deities should be placed facing west or east so that the person praying faces east or north while worshipping. The room should always be clean, clutter-free, and well-lit, preferably using natural light. It is advisable to use light and soothing colors such as white, light yellow, or cream to enhance spiritual vibrations. Avoid placing the pooja room in bedrooms, under staircases, or near bathrooms, as these areas can disturb the positive energy flow. Following Vastu principles for your pooja room helps create a divine atmosphere, promoting mental peace, harmony, and overall well-being in the household.",
        "introParagraphs": [
          "The pooja room is the most sacred space in a home, and as per Vastu Shastra, its placement and design play a vital role in attracting positive energy, peace, and prosperity. Ideally, the pooja room should be located in the north-east (Ishanya) direction, which is considered the most auspicious zone. The idols or pictures of deities should be placed facing west or east so that the person praying faces east or north while worshipping. The room should always be clean, clutter-free, and well-lit, preferably using natural light. It is advisable to use light and soothing colors such as white, light yellow, or cream to enhance spiritual vibrations. Avoid placing the pooja room in bedrooms, under staircases, or near bathrooms, as these areas can disturb the positive energy flow. Following Vastu principles for your pooja room helps create a divine atmosphere, promoting mental peace, harmony, and overall well-being in the household."
        ],
        "tips": [
          {
            "heading": "Ideal Direction For Pooja Room",
            "points": [
              "According to Vaastu Shastra, the most auspicious direction for a pooja room is the North-East (Ishanya) corner of the house, as it is considered the zone of divine energy and spiritual growth. This direction attracts positive vibrations and enhances peace, prosperity, and harmony within the home. If the North-East is not available, the East or North directions are also suitable alternatives. It is important to avoid placing the pooja room in the South direction or near bathrooms, as these areas may disturb the sanctity and spiritual energy of the space. Keep the pooja room clean, clutter-free, and well-lit to maintain a positive spiritual atmosphere and enhance the flow of divine energy"
            ]
          },
          {
            "heading": "Placement Tips For Home Temple",
            "points": [
              "When setting up a home temple, ensure that the idols or images of deities are placed facing either East or West, allowing the person praying to face East or North, which is considered highly beneficial. The pooja room should always be clean, clutter-free, and well-lit to maintain positive energy flow. Avoid placing the temple directly on the floor; instead, use a raised platform or wooden structure. Do not place the pooja room under staircases or against bathroom walls. Additionally, keeping fresh flowers, incense, and proper ventilation enhances the spiritual ambiance and creates a peaceful environment for daily prayers."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-study",
        "groupId": "vastu-for-house",
        "groupLabel": "Vastu For House",
        "title": "Vastu For Study Room",
        "image": "/jkvaastu/study-room.jpg",
        "bookingCategory": "Education & Study",
        "introHeading": "What is Vastu for Study Room?",
        "summary": "A study room designed according to Vastu principles creates a positive and focused environment that enhances concentration, memory, and academic success. Ideally, the study room should be located in the east, north, or northeast direction of the house, as these zones promote clarity of thought and learning ability. While studying, one should face east or north to improve focus and grasping power.",
        "introParagraphs": [
          "A study room designed according to Vastu principles creates a positive and focused environment that enhances concentration, memory, and academic success. Ideally, the study room should be located in the east, north, or northeast direction of the house, as these zones promote clarity of thought and learning ability. While studying, one should face east or north to improve focus and grasping power.",
          "The study table should be placed in a way that allows a solid wall behind, providing support and stability. Keep the room well-lit, clutter-free, and organized to allow smooth flow of energy. Avoid placing mirrors directly in front of the study table, as they can distract the mind. Soft, soothing colors like light green, blue, or cream are recommended to create a calm and productive atmosphere. Proper Vastu for study room not only improves academic performance but also brings discipline, confidence, and mental peace."
        ],
        "tips": [
          {
            "heading": "Study Table Placement",
            "points": [
              "Always sit facing East or North while studying.",
              "Ensure there is a Solid wall behind you for support.",
              "Avoid sitting under beams or facing a wall directly."
            ]
          },
          {
            "heading": "Colors For Study Room",
            "points": [
              "Use light and soothing colors like Light Yellow, Green, White or Cream.",
              "Avoid dark or dull colors like black or deep red."
            ]
          },
          {
            "heading": "Lighting And Environment",
            "points": [
              "Ensure ample natural light, especially from the East.",
              "Use proper artificial lighting to avoid strain.",
              "Keep the study area clean, clutter-free and organized."
            ]
          },
          {
            "heading": "Placement Of Books",
            "points": [
              "Keep bookshelves in the South-West or West direction.",
              "Avoid placing books directly in front of the study table at eye level.",
              "Maintain neat and organized storage for better energy flow."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-bedroom",
        "groupId": "vastu-for-house",
        "groupLabel": "Vastu For House",
        "title": "Vastu For Bedroom",
        "image": "/jkvaastu/bedroom.jpg",
        "bookingCategory": "Vastu for House",
        "introHeading": "What is Vastu for Bedroom?",
        "summary": "A bedroom plays a vital role in maintaining peace, relaxation, and overall well-being, and following Vaastu principles can enhance positive energy in this space. Ideally, the master bedroom should be located in the southwest direction of the house, as it promotes stability and strong relationships. The bed should be placed so that your head points towards the south or east while sleeping, ensuring better health and restful sleep.",
        "introParagraphs": [
          "A bedroom plays a vital role in maintaining peace, relaxation, and overall well-being, and following Vaastu principles can enhance positive energy in this space. Ideally, the master bedroom should be located in the southwest direction of the house, as it promotes stability and strong relationships. The bed should be placed so that your head points towards the south or east while sleeping, ensuring better health and restful sleep.",
          "Avoid placing mirrors directly in front of the bed, as they can disturb energy flow. Colors like light blue, pastel green, or earthy tones create a calming atmosphere, while clutter should be minimized to maintain harmony. Proper ventilation, natural light, and balanced placement of furniture further contribute to a peaceful and rejuvenating bedroom environment according to Vastu Shastra."
        ],
        "tips": [
          {
            "heading": "Bed Placement And Sleeping Direction",
            "points": [
              "Sleep with your head towards South or West.",
              "Avoid sleeping with head towards North.",
              "Place the bed in the South-West corner of the room.",
              "Keep the bed slightly away from walls (not directly under beams)."
            ]
          },
          {
            "heading": "Mirror And Furniture Placement",
            "points": [
              "Avoid mirrors facing the bed.",
              "Place wardrobes in the South-West or South wall.",
              "Keep heavy furniture in the South-West.",
              "Avoid clutter under the bed."
            ]
          },
          {
            "heading": "Bedroom Colors As Per Vastu",
            "points": [
              "Use light or soothing colors like Beige, Light Blue, Pastel Green, Light Pink.",
              "Avoid dark red,black or bright colors."
            ]
          },
          {
            "heading": "Lighting And Ventilation",
            "points": [
              "Use Soft, warm lighting.",
              "Ensure proper ventilation and fresh air."
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "vastu-for-residence",
    "label": "Vastu For Residence",
    "shortLabel": "Residence",
    "coverImage": "/jkvaastu/residence.jpg",
    "bookingCategory": "New Property Selection",
    "summary": "Vastu for residence is the scientific planning and arrangement of a home according to directional and elemental principles to ensure positive energy flow.",
    "introParagraphs": [
      "Vastu for residence is the scientific planning and arrangement of a home according to directional and elemental principles to ensure positive energy flow.",
      "It focuses on:",
      "Proper placement of entrance, bedrooms, kitchen, and living areas",
      "Balancing the five natural elements (Earth, Water, Fire, Air, Space)",
      "Enhancing health, financial stability, and peace of mind",
      "Removing negative energy and correcting Vastu doshas",
      "When a home is aligned with Vastu principles, it supports stability, growth, and emotional harmony for every family member.",
      "Residence Vastu"
    ],
    "items": [
      {
        "slug": "vastu-for-new-house",
        "groupId": "vastu-for-residence",
        "groupLabel": "Vastu For Residence",
        "title": "Vastu For New House",
        "image": "/jkvaastu/new-house.jpg",
        "bookingCategory": "New Property Selection",
        "introHeading": "What is Vastu for New House?",
        "summary": "Buying or constructing a new house is a major milestone in life. A home designed according to Vastu Shastra invites prosperity, happiness, health, and peace. At JK Vaastu, we offer expert consultation to help your home attract positive energy and remove negative influences.",
        "introParagraphs": [
          "Buying or constructing a new house is a major milestone in life. A home designed according to Vastu Shastra invites prosperity, happiness, health, and peace. At JK Vaastu, we offer expert consultation to help your home attract positive energy and remove negative influences.",
          "Our solutions are practical, scientific, and tailored to your property layout.",
          "Vastu Shastra is an ancient Indian science of architecture that balances the five elements—Earth, Water, Fire, Air, and Space. When aligned properly, it supports financial growth, good health, harmonious relationships, mental stability, and career success.",
          "Planning your home with the right Vastu principles from the beginning helps avoid future issues and costly corrections."
        ],
        "tips": [
          {
            "heading": "Main Entrance Direction",
            "points": [
              "North, East, or North-East facing entrances are considered highly auspicious.",
              "Avoid South-West main entrances if possible."
            ]
          },
          {
            "heading": "Living Room Placement",
            "points": [
              "Ideally located in the North or East direction.",
              "Keeps the atmosphere welcoming and positive."
            ]
          },
          {
            "heading": "kitchen Position",
            "points": [
              "South-East (Agni corner) is the best direction for the kitchen.",
              "Avoid kitchen in North-East."
            ]
          },
          {
            "heading": "Master Bedroom",
            "points": [
              "South-West direction ensures stability and strength in relationships."
            ]
          },
          {
            "heading": "Staircase Position",
            "points": [
              "Should ideally be in South, West, or South-West direction.",
              "Avoid center of the house."
            ]
          },
          {
            "heading": "Pooja Room",
            "points": [
              "North-East is the most auspicious direction for prayer or meditation room."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-apartment-flat",
        "groupId": "vastu-for-residence",
        "groupLabel": "Vastu For Residence",
        "title": "Vastu For Apartment / Flat",
        "image": "/jkvaastu/apartments.jpg",
        "bookingCategory": "Vastu for House",
        "introHeading": "What is Vastu for Apartment/Flat?",
        "summary": "Living in an apartment or flat doesn’t mean you can’t benefit from Vastu Shastra. Even in modern buildings, proper Vastu alignment helps maintain positive energy, financial stability, good health, and harmonious relationships.",
        "introParagraphs": [
          "Living in an apartment or flat doesn’t mean you can’t benefit from Vastu Shastra. Even in modern buildings, proper Vastu alignment helps maintain positive energy, financial stability, good health, and harmonious relationships.",
          "At JK Vastu, we offer expert consultation for apartments and flats to ensure your home supports success, peace, and happiness.",
          "While apartments share common structures, factors like entrance direction, internal layout, kitchen placement, bedroom position, and energy flow still play a crucial role.",
          "Following Vastu for flats can support financial growth, better career opportunities, improved health, peaceful relationships, and overall positivity. Even small corrections can create a significant positive impact."
        ],
        "tips": [
          {
            "heading": "Kitchen Placement",
            "points": [
              "South-East direction (Fire zone) is ideal.",
              "Avoid kitchen in North-East area."
            ]
          },
          {
            "heading": "Balcony And Windows",
            "points": [
              "Balconies in North or East are beneficial.",
              "Ensure proper ventilation and natural sunlight."
            ]
          },
          {
            "heading": "Master Bedroom Location",
            "points": [
              "South-West bedroom promotes stability and strong relationships."
            ]
          },
          {
            "heading": "Pooja Room Position",
            "points": [
              "North-East corner is best for prayer or meditation area."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-selection-of-apartment-flat-for-rent-purchase",
        "groupId": "vastu-for-residence",
        "groupLabel": "Vastu For Residence",
        "title": "Apartment / Flat Selection (Rent / Purchase)",
        "image": "/jkvaastu/flat-select.jpg",
        "bookingCategory": "New Property Selection",
        "introHeading": "What is Vastu for Apartment/Flat Selection For Rent/Purchase?",
        "summary": "Selecting the right apartment or flat for rent or purchase is an important life decision. While location, budget, and amenities matter, the Vastu alignment of the flat plays a key role in influencing your health, finances, career, and relationships.",
        "introParagraphs": [
          "Selecting the right apartment or flat for rent or purchase is an important life decision. While location, budget, and amenities matter, the Vastu alignment of the flat plays a key role in influencing your health, finances, career, and relationships.",
          "At JK Vastu, we help you evaluate apartments and flats before you rent or buy, ensuring your home supports positivity, growth, and long-term stability.",
          "Even though apartments share common structures, factors like entrance direction, internal layout, kitchen placement, and bedroom positioning significantly impact energy flow. Ignoring Vastu can lead to financial challenges, career stagnation, family conflicts, health issues, and mental stress.",
          "A proper Vastu evaluation before finalizing the property helps you avoid future problems and ensures a balanced, harmonious living environment."
        ],
        "tips": [
          {
            "heading": "Main Entrance Direction",
            "points": [
              "North, East, or North-East facing entrances are considered highly auspicious.",
              "Avoid flats with South-West main entrances if possible."
            ]
          },
          {
            "heading": "Apartment/Flat Direction And Facing",
            "points": [
              "East-facing flats bring growth and opportunities.",
              "North-facing flats support financial stability.",
              "West-facing flats can be balanced with proper Vastu guidance."
            ]
          },
          {
            "heading": "Toilet And Bathroom Placement",
            "points": [
              "Should not be in North-East direction.",
              "Proper positioning prevents health and financial issues."
            ]
          },
          {
            "heading": "Master Bedroom Placement",
            "points": [
              "South-West bedroom promotes stability and strong family relationships."
            ]
          },
          {
            "heading": "Kitchen Placement",
            "points": [
              "South-East direction (Fire zone) is ideal.",
              "Avoid kitchen in North-East."
            ]
          },
          {
            "heading": "Natural Light And Ventilation",
            "points": [
              "Apartment/Flats with good sunlight and cross ventilation enhance positive energy flow."
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "vastu-for-commercial",
    "label": "Vastu For Commercial",
    "shortLabel": "Commercial",
    "coverImage": "/jkvaastu/corporate.jpg",
    "bookingCategory": "Vastu for Business",
    "summary": "Vastu for commercial focuses on creating a balanced and positive environment that supports business growth, financial stability, and customer satisfaction. By aligning elements like entrance direction, layout, seating arrangement, and placement of key areas such as cash counters, workstations, and products, Vastu helps attract opportunities and enhance productivity. Proper energy flow in offices, shops, and showrooms can improve employee performance, decision-making, and client relationships, ultimately leading to increased success and long-term prosperity in business.",
    "introParagraphs": [
      "Vastu for commercial focuses on creating a balanced and positive environment that supports business growth, financial stability, and customer satisfaction. By aligning elements like entrance direction, layout, seating arrangement, and placement of key areas such as cash counters, workstations, and products, Vastu helps attract opportunities and enhance productivity. Proper energy flow in offices, shops, and showrooms can improve employee performance, decision-making, and client relationships, ultimately leading to increased success and long-term prosperity in business.",
      "Commercial Vastu"
    ],
    "items": [
      {
        "slug": "vastu-for-office",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For Office",
        "image": "/jkvaastu/office.jpg",
        "bookingCategory": "Vastu for Business",
        "introHeading": "What is Vastu for Office?",
        "summary": "A workplace designed as per Vastu principles can attract success, financial growth, stability, and positive energy. Whether it’s a small office, startup, corporate space, clinic, showroom, or factory, proper Vastu alignment supports smooth operations and consistent business growth.",
        "introParagraphs": [
          "A workplace designed as per Vastu principles can attract success, financial growth, stability, and positive energy. Whether it’s a small office, startup, corporate space, clinic, showroom, or factory, proper Vastu alignment supports smooth operations and consistent business growth.",
          "At JK Vastu, we offer professional Vastu consultation for offices to improve productivity, reduce obstacles, and strengthen financial stability.",
          "An office is where key decisions are made and growth is driven. If the energy flow is not balanced, it can result in financial losses, delayed payments, employee conflicts, slow growth, mental stress, and poor client conversion."
        ],
        "tips": [
          {
            "heading": "Owner/Director Cabin Placement",
            "points": [
              "Southwest direction is ideal for the owner’s cabin.",
              "The owner should sit facing North or East."
            ]
          },
          {
            "heading": "Employee Workstation Placement",
            "points": [
              "Employees should ideally face North or East while working.",
              "Avoid seating directly under beams."
            ]
          },
          {
            "heading": "General Office Vastu Tips",
            "points": [
              "Keep the center of office open and clutter-free.",
              "Maintain proper lighting and ventilation."
            ]
          },
          {
            "heading": "Office Entrance Vastu Tips",
            "points": [
              "North or East-facing entrance is considered highly auspicious.",
              "Keep the entrance well-lit and free from clutter."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-malls",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For Malls",
        "image": "/jkvaastu/malls.jpg",
        "bookingCategory": "Vastu for Business",
        "introHeading": "What is Vastu for Malls?",
        "summary": "Shopping malls are dynamic commercial hubs where multiple businesses operate together. Their success depends not only on location and marketing but also on balanced energy flow and proper structural alignment.",
        "introParagraphs": [
          "Shopping malls are dynamic commercial hubs where multiple businesses operate together. Their success depends not only on location and marketing but also on balanced energy flow and proper structural alignment.",
          "At JK Vastu, we offer expert Vastu consultation for malls to enhance customer attraction, boost sales, and ensure long-term financial stability.",
          "Vastu for malls involves the strategic placement of entrances, anchor stores, escalators, food courts, parking areas, and common spaces. It helps improve customer movement, maintain balanced energy distribution, reduce obstacles, and support tenant success.",
          "Proper Vastu planning creates a vibrant, prosperous, and growth-oriented commercial environment."
        ],
        "tips": [
          {
            "heading": "Mall Entrance Placement",
            "points": [
              "North or East-facing entrances are highly favorable.",
              "Keep the entrance spacious, bright, and obstruction-free."
            ]
          },
          {
            "heading": "Escalator And Lift Placement",
            "points": [
              "Escalators are ideal in South, West, or Northwest directions.",
              "Avoid heavy structures in the Northeast corner."
            ]
          },
          {
            "heading": "Food Court And Kitchen Area",
            "points": [
              "Southeast is ideal for food courts and kitchen areas.",
              "Maintain proper ventilation and cleanliness for positive energy."
            ]
          },
          {
            "heading": "Parking And Basement Vastu",
            "points": [
              "Parking entry is suitable in North or East.",
              "Basement areas should be well-lit and clutter-free."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-shops",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For Shops",
        "image": "/jkvaastu/shop.jpg",
        "bookingCategory": "Vastu for Business",
        "introHeading": "What is Vastu for Shops?",
        "summary": "A shop’s success largely depends on customer attraction, steady sales, and positive business energy. Proper Vastu alignment helps remove obstacles, increase footfall, and create a welcoming shopping environment.",
        "introParagraphs": [
          "A shop’s success largely depends on customer attraction, steady sales, and positive business energy. Proper Vastu alignment helps remove obstacles, increase footfall, and create a welcoming shopping environment.",
          "At JK Vastu, we offer expert Vastu consultation for shops to support business growth, financial stability, and long-term success.",
          "Vastu for shops focuses on the correct placement of the entrance, cash counter, products, storage, and seating. It helps increase customer walk-ins, improve sales conversion, ensure smooth cash flow, and create a positive business atmosphere.",
          "Proper Vastu planning enhances profitability and long-term business stability."
        ],
        "tips": [
          {
            "heading": "Shop Entrance Vastu",
            "points": [
              "North or East-facing entrance is considered highly auspicious.",
              "Keep the entrance clean, bright, and obstruction-free."
            ]
          },
          {
            "heading": "Product Display Arrangement",
            "points": [
              "Heavy racks and storage should be in South or West.",
              "Northeast area should remain light and open."
            ]
          },
          {
            "heading": "Storage And Stock Area",
            "points": [
              "Store excess stock in South or West zones.",
              "Avoid clutter in the center of the shop."
            ]
          },
          {
            "heading": "Lighting And Energy Flow",
            "points": [
              "Maintain proper lighting, especially near entrance and cash counter.",
              "Keep the center area open for smooth customer movement."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-hotels",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For Hotels",
        "image": "/jkvaastu/hotels.jpg",
        "bookingCategory": "Vastu for Business",
        "introHeading": "What is Vastu for Hotels?",
        "summary": "Hotels are spaces where comfort, hospitality, and positive energy play a key role in success. Proper Vastu alignment helps attract guests, improve occupancy rates, and ensure smooth operations.",
        "introParagraphs": [
          "Hotels are spaces where comfort, hospitality, and positive energy play a key role in success. Proper Vastu alignment helps attract guests, improve occupancy rates, and ensure smooth operations.",
          "At JK Vastu, we offer expert Vastu consultation for hotels to create a welcoming environment that supports growth, reputation, and long-term profitability.",
          "Vastu for hotels involves the strategic placement of entrances, reception, guest rooms, kitchen, dining areas, and service spaces. It helps increase guest footfall, encourage repeat visits, maintain positive energy, improve staff coordination, and support steady financial growth.",
          "Proper Vastu planning ensures comfort, harmony, and overall commercial success."
        ],
        "tips": [
          {
            "heading": "Hotel Entrance Vastu",
            "points": [
              "North or East-facing entrance is highly favorable.",
              "Entrance should be spacious, well-lit, and welcoming."
            ]
          },
          {
            "heading": "Reception And Lobby Area",
            "points": [
              "Reception desk is ideal in the North or East zone.",
              "Keep lobby area clutter-free and well-ventilated."
            ]
          },
          {
            "heading": "Kitchen And Restaurant Area",
            "points": [
              "Southeast is ideal for kitchen area.",
              "Dining space should be clean, bright, and positive."
            ]
          },
          {
            "heading": "Parking And Services Area",
            "points": [
              "Parking entry is suitable in North or East.",
              "Service areas should not block the main energy flow."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-factory",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For Factory",
        "image": "/jkvaastu/factory.jpg",
        "bookingCategory": "Vastu for Business",
        "introHeading": "What is Vastu for Factory?",
        "summary": "A factory’s success depends on smooth production, efficient workforce, optimal machinery performance, and stable financial growth. Proper Vastu planning helps minimize operational obstacles, improve workflow, and create a balanced industrial environment.",
        "introParagraphs": [
          "A factory’s success depends on smooth production, efficient workforce, optimal machinery performance, and stable financial growth. Proper Vastu planning helps minimize operational obstacles, improve workflow, and create a balanced industrial environment.",
          "At JK Vastu, we offer expert Vastu consultation for factories to enhance productivity, safety, and long-term business growth.",
          "Vastu for factories focuses on the correct placement of entrance, machinery, raw materials, finished goods, office areas, and utilities. It helps enhance production efficiency, reduce machinery breakdowns, improve worker coordination, and maintain steady financial flow.",
          "Proper Vastu alignment supports stability and long-term industrial prosperity."
        ],
        "tips": [
          {
            "heading": "Factory Entrance Vastu",
            "points": [
              "North or East-facing entrance is considered favorable.",
              "Keep the main gate strong, wide, and obstruction-free."
            ]
          },
          {
            "heading": "Machinery Placement",
            "points": [
              "Heavy machinery should be placed in South or West zones.",
              "Avoid placing heavy equipment in the Northeast area."
            ]
          },
          {
            "heading": "Raw Material And Storage Area",
            "points": [
              "Store raw materials in South or Southwest.",
              "Keep finished goods in Northwest for smooth dispatch."
            ]
          },
          {
            "heading": "Administrative Office Area",
            "points": [
              "Owner or manager cabin is ideal in Southwest.",
              "The owner should face North or East while working."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-hospital",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For Hospital",
        "image": "/jkvaastu/hospital.jpg",
        "bookingCategory": "Vastu for Business",
        "introHeading": "What is Vastu for Hospital?",
        "summary": "Hospitals and healthcare centers are spaces of healing, care, and recovery. Proper Vastu alignment helps create a calm, positive, and supportive environment for patients, doctors, and staff, improving trust and overall efficiency.",
        "introParagraphs": [
          "Hospitals and healthcare centers are spaces of healing, care, and recovery. Proper Vastu alignment helps create a calm, positive, and supportive environment for patients, doctors, and staff, improving trust and overall efficiency.",
          "At JK Vastu, we offer expert Vastu consultation for hospitals to ensure harmony, smooth operations, and long-term success.",
          "Vastu for hospitals focuses on the correct placement of entrance, reception, consultation rooms, operation theatres, wards, pharmacy, and utility areas. It helps create a peaceful healing environment, enhance patient comfort, improve staff coordination, and support financial stability.",
          "Proper planning ensures balanced energy and efficient healthcare operations."
        ],
        "tips": [
          {
            "heading": "Hospital Entrance Vastu",
            "points": [
              "North or East-facing entrance is considered favorable.",
              "Entrance should be clean, spacious, and clearly visible."
            ]
          },
          {
            "heading": "Reception And Waiting Area",
            "points": [
              "Reception desk is ideal in North or East zone.",
              "Waiting area should be well-lit and clutter-free."
            ]
          },
          {
            "heading": "Patient Rooms And Wards",
            "points": [
              "Southwest and West are suitable for patient rooms.",
              "Beds should ideally have head towards South for stability.",
              "Avoid placing mirrors directly in front of the bed, as they may cause discomfort and disturb rest, which is essential for recovery and well-being."
            ]
          },
          {
            "heading": "Operation Theatres And Medical Equipments",
            "points": [
              "Operation theatres are suitable in West or Northwest zones.",
              "Heavy medical equipment should be placed in South or West."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-educational-institutes",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For Educational Institutes",
        "image": "/jkvaastu/educational-institutes.jpg",
        "bookingCategory": "Education & Study",
        "introHeading": "What is Vastu for Educational Institutes?",
        "summary": "Educational institutes like schools, colleges, and training centers are spaces for learning and growth. Proper Vastu alignment creates a positive and focused environment, improving concentration and academic performance.",
        "introParagraphs": [
          "Educational institutes like schools, colleges, and training centers are spaces for learning and growth. Proper Vastu alignment creates a positive and focused environment, improving concentration and academic performance.",
          "At JK Vastu, we provide expert consultation to ensure harmony, productivity, and long-term success.",
          "Vastu focuses on the correct placement of key areas like entrance, classrooms, offices, and libraries. It helps enhance learning, discipline, relationships, and overall institutional growth, ensuring balanced energy and academic excellence."
        ],
        "tips": [
          {
            "heading": "Main Entrance Direction",
            "points": [
              "North, East, or North-East facing entrances are considered highly auspicious.",
              "Avoid houses with South-West main entrances if possible."
            ]
          },
          {
            "heading": "Reception And Administration Areas",
            "points": [
              "Reception should be in the North or East direction.",
              "Administrative offices should be located in the South-West for stability and control."
            ]
          },
          {
            "heading": "Classrooms",
            "points": [
              "Students should face East or North while studying to improve concentration.",
              "Teachers should face East while teaching."
            ]
          },
          {
            "heading": "Principal Office",
            "points": [
              "The principal or head’s office should be in the South-West direction.",
              "Promotes authority, stability, and effective decision-making."
            ]
          },
          {
            "heading": "Library",
            "points": [
              "The library should be in the North-East or West direction.",
              "This enhances focus, knowledge absorption, and a calm reading environment."
            ]
          },
          {
            "heading": "Playground And Open Areas",
            "points": [
              "Open spaces and playgrounds should ideally be in the North or East direction.",
              "Encourages physical activity and positive energy flow."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-industry",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For Industry",
        "image": "/jkvaastu/industry.jpg",
        "bookingCategory": "Vastu for Business",
        "introHeading": "What is Vastu for Industry?",
        "summary": "Vastu Shastra plays an important role in the smooth functioning and success of industrial setups like factories, warehouses, and production units. Proper Vastu alignment ensures balanced energy flow, improving productivity, workforce efficiency, and financial growth. Correct placement of machinery, materials, and work areas helps reduce obstacles and maintain operational harmony.",
        "introParagraphs": [
          "Vastu Shastra plays an important role in the smooth functioning and success of industrial setups like factories, warehouses, and production units. Proper Vastu alignment ensures balanced energy flow, improving productivity, workforce efficiency, and financial growth. Correct placement of machinery, materials, and work areas helps reduce obstacles and maintain operational harmony.",
          "Checking Vastu for an industry is essential to avoid hidden imbalances that can cause delays, losses, labor issues, or machinery breakdowns. A proper analysis helps identify and correct these issues without major changes, leading to better workflow, employee satisfaction, and consistent business growth."
        ],
        "tips": [
          {
            "heading": "Main Entrance Direction",
            "points": [
              "The main entrance of an industry should ideally be in the North, East or North-East direction.",
              "This allows positive energy flow, attracts business opportunities, and improves overall growth."
            ]
          },
          {
            "heading": "Placement Of Heavy Machinery",
            "points": [
              "Heavy machines should be placed in the South-West, South or West zones.",
              "This ensures stability in operations and reduces breakdowns or financial losses."
            ]
          },
          {
            "heading": "Boiler And Electrical Equipments",
            "points": [
              "All fire-related elements like boilers, generators, and electrical panels must be in the South-East direction (Agni zone).",
              "This promotes smooth functioning and avoids accidents."
            ]
          },
          {
            "heading": "Raw Materials And Finished Goods Storage",
            "points": [
              "Raw Materials → South-West or West.",
              "Finished Goods → North-West."
            ]
          },
          {
            "heading": "Cash And Accounts Department",
            "points": [
              "The accounts and finance section should be in the North direction.",
              "Keep cash lockers opening towards the North to attract wealth and financial stability."
            ]
          },
          {
            "heading": "Open Space And Water Elements",
            "points": [
              "Keep the North-East area open and clean.",
              "Water sources like borewell or tanks should also be placed here to enhance prosperity and harmony."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-new-layout",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Vastu For New Layout",
        "image": "/jkvaastu/layout.jpg",
        "bookingCategory": "New Property Selection",
        "introHeading": "What is Vastu for New Layout?",
        "summary": "When planning a new home or commercial space, incorporating Vastu principles at the layout stage is essential. A well-designed Vastu-aligned layout ensures smooth positive energy flow, supporting health, wealth, and overall well-being while avoiding future structural changes.",
        "introParagraphs": [
          "When planning a new home or commercial space, incorporating Vastu principles at the layout stage is essential. A well-designed Vastu-aligned layout ensures smooth positive energy flow, supporting health, wealth, and overall well-being while avoiding future structural changes.",
          "Checking Vastu before construction helps build a strong foundation for long-term success and harmony. A proper layout promotes mental peace, financial stability, and healthy relationships, while ensuring effective use of space and a balanced, positive environment.",
          "It also helps in better space utilization, improved functionality, and natural energy balance. Early Vastu planning reduces future risks, avoids costly modifications, and ensures a stable and prosperous living or working space."
        ],
        "tips": [
          {
            "heading": "Main Entrance Direction",
            "points": [
              "The main entrance should ideally be in the North, East, or North-East direction, as it invites positive energy and opportunities into the space."
            ]
          },
          {
            "heading": "Living Room Placement",
            "points": [
              "The living room should be in the North, East, or North-East zone to encourage social harmony and a welcoming atmosphere."
            ]
          },
          {
            "heading": "Kitchen Position",
            "points": [
              "The kitchen is best placed in the South-East (Agni corner), which represents the fire element and supports good health."
            ]
          },
          {
            "heading": "Pooja Room Placement",
            "points": [
              "The pooja or prayer room should be located in the North-East, the most sacred zone that enhances spiritual energy."
            ]
          },
          {
            "heading": "Bedroom Location",
            "points": [
              "The master bedroom should be in the South-West direction to ensure stability, strength, and better decision-making."
            ]
          },
          {
            "heading": "Bathroom And Toilet Placement",
            "points": [
              "Bathrooms and toilets should be in the North-West or West direction to maintain hygiene and avoid energy imbalance."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-commercial-property-selection-for-rent-purchase",
        "groupId": "vastu-for-commercial",
        "groupLabel": "Vastu For Commercial",
        "title": "Commercial Property Selection (Rent / Purchase)",
        "image": "/jkvaastu/corporate.jpg",
        "bookingCategory": "New Property Selection",
        "introHeading": "What is Vastu for Commercial Property Selection For Rent/Purchase?",
        "summary": "Selecting the right commercial property for rent or purchase is a crucial decision that directly impacts business growth, financial stability, and long-term success. As per Vastu Shastra, the energy flow of a property influences prosperity, reputation, employee productivity, and client relationships. A Vastu-compliant space helps create a positive, stable, and growth-oriented business environment.",
        "introParagraphs": [
          "Selecting the right commercial property for rent or purchase is a crucial decision that directly impacts business growth, financial stability, and long-term success. As per Vastu Shastra, the energy flow of a property influences prosperity, reputation, employee productivity, and client relationships. A Vastu-compliant space helps create a positive, stable, and growth-oriented business environment.",
          "Before finalizing a property, checking Vastu is essential as factors like entrance direction, layout, cabin placement, and energy zones affect performance. Imbalances can lead to financial losses, delays, or employee dissatisfaction. A proper Vastu evaluation ensures smooth operations, better opportunities, long-term success, avoid future risks, costly changes, and ensures a profitable investment."
        ],
        "tips": [
          {
            "heading": "Main Entrance Direction",
            "points": [
              "The main entrance should ideally be in the North, Northeast, or East direction to attract positive energy, customer inflow, and financial growth."
            ]
          },
          {
            "heading": "Owner Cabin Placement",
            "points": [
              "The business owner or decision-maker should sit in the Southwest direction facing North or East. This position strengthens authority and stability."
            ]
          },
          {
            "heading": "Cash Counter Location",
            "points": [
              "The cash counter or accounts department should be placed in the North direction to improve cash flow and financial stability."
            ]
          },
          {
            "heading": "Storage And Heavy Items",
            "points": [
              "Heavy materials, stocks, and storage should be kept in the Southwest zone to create balance and grounding energy in the business."
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "other-services",
    "label": "Other Services",
    "shortLabel": "Other Services",
    "coverImage": "/jkvaastu/wealth.jpeg",
    "bookingCategory": "Career & Job",
    "summary": "Vastu services are designed to bring balance and positive energy into all aspects of life. They help improve marriage prospects and strengthen relationships by creating harmony in the living environment. Vastu for health focuses on enhancing physical and mental well-being through proper space alignment. Financial growth and stability are supported through Vastu for wealth and business success. It also aids in improving focus and concentration for better education outcomes. Career and job-related Vastu helps in attracting opportunities and professional growth. Relationship Vastu resolves conflicts and promotes peace within families. Personalized solutions are provided based on individual needs and spaces. These services often include practical remedies without major structural changes. Overall, Vastu creates a positive environment that supports happiness, success, and prosperity.",
    "introParagraphs": [
      "Vastu services are designed to bring balance and positive energy into all aspects of life. They help improve marriage prospects and strengthen relationships by creating harmony in the living environment. Vastu for health focuses on enhancing physical and mental well-being through proper space alignment. Financial growth and stability are supported through Vastu for wealth and business success. It also aids in improving focus and concentration for better education outcomes. Career and job-related Vastu helps in attracting opportunities and professional growth. Relationship Vastu resolves conflicts and promotes peace within families. Personalized solutions are provided based on individual needs and spaces. These services often include practical remedies without major structural changes. Overall, Vastu creates a positive environment that supports happiness, success, and prosperity."
    ],
    "items": [
      {
        "slug": "vastu-for-career-job",
        "groupId": "other-services",
        "groupLabel": "Other Services",
        "title": "Vastu For Career & Job",
        "image": "/jkvaastu/career.jpg",
        "bookingCategory": "Career & Job",
        "introHeading": "What is Vastu for Career And Job?",
        "summary": "Vastu for Career and Job focuses on aligning your home or workplace with positive energy to support growth, stability, and success. Certain directions influence confidence, recognition, and financial progress.",
        "introParagraphs": [
          "Vastu for Career and Job focuses on aligning your home or workplace with positive energy to support growth, stability, and success. Certain directions influence confidence, recognition, and financial progress.",
          "Imbalances in these areas can lead to job instability, career stagnation, or workplace conflicts. Correcting them helps create a supportive environment for steady professional growth.",
          "The placement of your workspace, entrance, and working direction impacts productivity and decision-making. Proper Vastu helps remove obstacles like delays, low confidence, and lack of direction, ensuring consistent career progress."
        ],
        "tips": [
          {
            "heading": "Vastu Remedies For Career Growth And Stability",
            "points": [
              "For individuals facing job-related challenges, Vastu remedies aim to improve energy flow in zones connected with opportunity and recognition. Strengthening the North direction can support financial growth, while the East direction enhances clarity and new beginnings.",
              "Balancing the energy in your living and working environment helps create a supportive atmosphere that encourages progress, stability, and long-term professional success."
            ]
          },
          {
            "heading": "Correcting placement of mirrors and electronic items",
            "points": [
              "These changes, when implemented correctly, can help build confidence, attract better opportunities, and promote long-term professional stability."
            ]
          }
        ]
      },
      {
        "slug": "vastu-for-health",
        "groupId": "other-services",
        "groupLabel": "Other Services",
        "title": "Vastu For Health",
        "image": "/jkvaastu/health.jpg",
        "bookingCategory": "Health & Chakras",
        "introHeading": "What is Vastu for Health?",
        "summary": "Vastu for Health focuses on creating a space that supports physical well-being, mental clarity, and emotional balance. The placement of rooms and energy zones plays a key role in overall health.",
        "introParagraphs": [
          "Vastu for Health focuses on creating a space that supports physical well-being, mental clarity, and emotional balance. The placement of rooms and energy zones plays a key role in overall health.",
          "Imbalances in certain areas can lead to stress, fatigue, or recurring health issues. Correcting these helps promote harmony, improve energy levels, and enhance overall wellness.",
          "Health is linked to the balance of the five elements. Key directions like Northeast, Southeast, and Northwest influence positivity, metabolism, and airflow. Proper placement of bedrooms, kitchen, and other spaces helps maintain stability, better sleep, and mental peace."
        ],
        "tips": []
      },
      {
        "slug": "vastu-for-relationship",
        "groupId": "other-services",
        "groupLabel": "Other Services",
        "title": "Vastu For Relationship",
        "image": "/jkvaastu/relationship.jpg",
        "bookingCategory": "Marriage & Relationships",
        "introHeading": "What is Vastu for Relationship?",
        "summary": "Vastu for Relationship focuses on creating a harmonious home environment that strengthens emotional bonds, understanding, and mutual respect. The energy balance of certain zones influences love, communication, and stability.",
        "introParagraphs": [
          "Vastu for Relationship focuses on creating a harmonious home environment that strengthens emotional bonds, understanding, and mutual respect. The energy balance of certain zones influences love, communication, and stability.",
          "When these areas are disturbed, it may lead to conflicts, emotional distance, or misunderstandings. Correcting them helps build trust, warmth, and a positive atmosphere.",
          "Key factors like bedroom placement, seating, and interior setup impact relationships. Proper alignment of zones such as Southwest, Northwest, and Northeast supports better communication, emotional balance, and stronger relationships."
        ],
        "tips": []
      },
      {
        "slug": "vastu-for-marriage",
        "groupId": "other-services",
        "groupLabel": "Other Services",
        "title": "Vastu For Marriage",
        "image": "/jkvaastu/marriage.jpg",
        "bookingCategory": "Marriage & Relationships",
        "introHeading": "What is Vastu for Marriage?",
        "summary": "Vastu for Marriage focuses on balancing home energies to support bonding, understanding, and long-term relationship stability. The placement of bedrooms, kitchen, entrance, and key zones plays an important role in marital harmony.",
        "introParagraphs": [
          "Vastu for Marriage focuses on balancing home energies to support bonding, understanding, and long-term relationship stability. The placement of bedrooms, kitchen, entrance, and key zones plays an important role in marital harmony.",
          "When these areas are imbalanced, it may lead to delays in marriage, misunderstandings, or frequent conflicts. Correcting them helps create a peaceful and supportive environment for relationships to grow.",
          "Factors like bedroom direction, bed placement, colors, and zones such as Southwest and Northwest influence marital balance. Proper Vastu alignment helps reduce obstacles, improve trust, and strengthen emotional connection between partners."
        ],
        "tips": []
      },
      {
        "slug": "vastu-for-education",
        "groupId": "other-services",
        "groupLabel": "Other Services",
        "title": "Vastu For Education",
        "image": "/jkvaastu/education.jpg",
        "bookingCategory": "Education & Study",
        "introHeading": "What is Vastu for Education?",
        "summary": "Vastu for Education focuses on creating a space that enhances learning, concentration, and intellectual growth. Proper alignment of study areas and seating directions supports better focus, memory, and academic performance.",
        "introParagraphs": [
          "Vastu for Education focuses on creating a space that enhances learning, concentration, and intellectual growth. Proper alignment of study areas and seating directions supports better focus, memory, and academic performance.",
          "Imbalances in key zones can lead to lack of concentration, poor retention, or mental fatigue. Correcting them helps improve clarity, confidence, and overall learning ability.",
          "Directions like Northeast and East are ideal for learning and growth, while proper placement of study rooms, desks, and entrances ensures a positive and distraction-free environment, supporting better academic results."
        ],
        "tips": []
      }
    ]
  }
];

export const ALL_JK_SERVICES: JKServiceDetail[] = JK_SERVICE_GROUPS.flatMap((g) => g.items);

export function getServiceBySlug(slug: string | null | undefined): JKServiceDetail | null {
  if (!slug) return null;
  return ALL_JK_SERVICES.find((item) => item.slug === slug) ?? null;
}

export function getServiceGroupById(id: string | null | undefined): JKServiceGroup | null {
  if (!id) return null;
  return JK_SERVICE_GROUPS.find((g) => g.id === id) ?? null;
}
