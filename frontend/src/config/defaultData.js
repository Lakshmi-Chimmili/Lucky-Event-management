// Curated fallback packages & services to guarantee zero-downtime display even during Render free-tier cold starts
export const DEFAULT_CATEGORIES = [
  {
    _id: 'cat_wedding_01',
    name: 'Wedding / Marriage',
    description: 'Grand wedding coordination from mandap setup, guest hospitality, royal catering to luxury videography.',
    basePricePerAttendee: 1500,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_birthday_02',
    name: 'Birthday Party',
    description: 'Celebrate your special milestone with themed decors, fun activities, cake cutting management & music.',
    basePricePerAttendee: 500,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_corporate_03',
    name: 'Corporate / Professional Event',
    description: 'Seamless corporate conferences, product launches, gala dinners & team building summits with AV support.',
    basePricePerAttendee: 1000,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_family_04',
    name: 'Family Function',
    description: 'Warm get-togethers, housewarming, poojas & family reunions managed with care and personalized hospitality.',
    basePricePerAttendee: 700,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_engagement_05',
    name: 'Engagement Ceremony',
    description: 'Ring exchange ceremony management with aesthetic ring trays, floral stages, and intimate dinner setups.',
    basePricePerAttendee: 900,
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_anniversary_06',
    name: 'Anniversary',
    description: 'Commemorate years of love with romantic candle-light themes, live violinists, and custom photobooths.',
    basePricePerAttendee: 800,
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_babyshower_07',
    name: 'Baby Shower',
    description: 'Charming pastel-themed baby shower decor, fun baby trivia games, return gifts & refreshment counters.',
    basePricePerAttendee: 750,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_reception_08',
    name: 'Reception',
    description: 'High-end post-wedding receptions featuring red carpet entrances, banquet halls, multi-cuisine dining & DJ.',
    basePricePerAttendee: 1200,
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_college_09',
    name: 'College / School Event',
    description: 'Vibrant cultural fests, farewell parties & annual functions with heavy sound, stage trusses and light shows.',
    basePricePerAttendee: 600,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_other_10',
    name: 'Other Event',
    description: 'Custom tailor-made event management services for any unique gathering or private party.',
    basePricePerAttendee: 500,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800'
  }
];

export const DEFAULT_SERVICES = [
  {
    _id: 'ser_dj_01',
    name: 'DJ & Music',
    description: 'Professional club DJ with high-octane sound tracks, console & smoke machine effects.',
    pricingType: 'flat',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'ser_catering_02',
    name: 'Catering',
    description: 'Multi-course gourmet buffet (starters, main course, live counters & dessert assortments).',
    pricingType: 'perAttendee',
    price: 300,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'ser_photo_03',
    name: 'Photography & Videography',
    description: 'Candid photography, 4K cinematic highlight video, drone shots & online album.',
    pricingType: 'flat',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'ser_stage_04',
    name: 'Stage Decoration',
    description: 'Custom royal backdrop, LED screens, velvet couches & floral framing.',
    pricingType: 'flat',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'ser_dance_05',
    name: 'Dance Performance',
    description: 'Professional choreographers and dance troupes for sangeet or entertainment performance.',
    pricingType: 'flat',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'ser_sound_06',
    name: 'Sound System',
    description: 'High wattage JBL/RCF line array speakers, wireless mic & audio mixer setup.',
    pricingType: 'flat',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800'
  }
];
