import { Product } from '../types';

import heroImg from '../assets/images/hero_accessories_showcase_1790671724566.jpg';
import butterflyClipsImg from '../assets/images/product_butterfly_hairclips_1790671742281.jpg';
import cloverNecklaceImg from '../assets/images/product_korean_pendant_necklace_1790671757541.jpg';
import giftHamperImg from '../assets/images/product_luxury_gift_hamper_1790671773811.jpg';
import babyHeadbandsImg from '../assets/images/product_baby_soft_headbands_1790671790832.jpg';

export { heroImg };

export const PRODUCTS: Product[] = [
  // 1. Teen Cute - Butterfly Hair Clips
  {
    id: 'ka-teen-01',
    name: 'Aesthetic Pastel Butterfly Hair Clip Duo',
    category: 'teen-cute',
    categoryLabel: 'Teen Cute',
    price: 650,
    originalPrice: 850,
    rating: 4.9,
    reviewCount: 142,
    badge: 'Bestseller',
    images: [
      butterflyClipsImg,
      heroImg,
    ],
    description: 'Iridescent acetate butterfly clips featuring premium spring hold and delicate pastel tinting. Engineered for strong grip without tugging or creasing sensitive hair.',
    specs: {
      material: 'Eco-friendly Cellulose Acetate & Rust-free Gold Alloy Spring',
      dimensions: '4.5cm x 3.8cm',
      weight: '14g per clip',
      packaging: 'Custom Komal organza drawstring bag & backing card',
      suitability: 'All hair types: fine, wavy, and thick hairstyles',
    },
    features: [
      'Gentle rounded teeth that never pull or snag delicate hair',
      'High-grade gloss resin with soft rainbow iridescence',
      'Ultra-durable inner tension spring tested for 5,000+ clips',
      'Perfect for half-up styles, curtain bangs, or messy buns',
    ],
    colors: [
      { name: 'Lilac Shimmer', hex: '#D8B4E2' },
      { name: 'Peach Sorbet', hex: '#FFD1BA' },
      { name: 'Mint Pearl', hex: '#C1E7E3' },
      { name: 'Buttercup', hex: '#FFF2B2' },
    ],
    inStock: true,
    stockCount: 18,
    isBestseller: true,
  },

  // 2. Cute Jewelry - Korean Clover Pendant
  {
    id: 'ka-jewel-01',
    name: 'Dainty Korean 18K Gold Clover Pendant',
    category: 'cute-jewelry',
    categoryLabel: 'Cute Jewelry',
    price: 1450,
    originalPrice: 1950,
    rating: 5.0,
    reviewCount: 98,
    badge: 'Trending',
    images: [
      cloverNecklaceImg,
      heroImg,
    ],
    description: 'A delicate everyday charm necklace inspired by Seoul high-street minimalist aesthetics. Features a double-sided mother-of-pearl style clover charm set in anti-tarnish 18K gold electroplate.',
    specs: {
      material: '18K Gold-Plated Stainless Steel & Mother of Pearl Inlay',
      dimensions: '40cm chain + 5cm extension; Charm: 1.2cm',
      weight: '6.2g',
      packaging: 'Signature Komal drawer jewelry box with velvet foam',
      suitability: 'Hypoallergenic & lead/nickel-free for everyday skin contact',
    },
    features: [
      'Water and sweat resistant triple PVD gold coating',
      'Double-sided polished finish (wearable on both sides)',
      'Adjustable 5cm lobster clasp extender fits all necklines',
      'Tarnish resistant for lasting shine without skin discoloration',
    ],
    colors: [
      { name: 'Pure White Shell', hex: '#FDFBF7' },
      { name: 'Onyx Noir', hex: '#1C1917' },
      { name: 'Emerald Malachite', hex: '#1E4D3E' },
      { name: 'Blush Carnelian', hex: '#C05C54' },
    ],
    inStock: true,
    stockCount: 12,
    isBestseller: true,
    isNew: true,
  },

  // 3. Elegant Gift Sets - Signature Hamper
  {
    id: 'ka-gift-01',
    name: 'Komal Signature Blush Velvet Gift Hamper',
    category: 'gift-sets',
    categoryLabel: 'Gift Sets',
    price: 2850,
    originalPrice: 3500,
    rating: 4.9,
    reviewCount: 86,
    badge: 'Luxe Gift Box',
    images: [
      giftHamperImg,
      heroImg,
    ],
    description: 'Our most-loved celebratory gift box. Contains 1 pair of dainty clover earrings, 1 large French marble claw clip, 1 pure mulberry silk mini scrunchie, and an embossed golden personalized greeting card inside a reusable blush pink rigid velvet box.',
    specs: {
      material: 'Rigid Velvet Box, 18K Gold Plated Jewelry, 100% Mulberry Silk',
      dimensions: '18cm x 15cm x 7cm box',
      weight: '340g total packed',
      packaging: 'Blush pink satin bow with branded metallic wax seal stamp',
      suitability: 'Ideal for Birthdays, Eid, Sister Gifts, and Graduations',
    },
    features: [
      'Comes fully gift-wrapped with satin ribbon and blank/custom greeting card',
      'Includes 4 best-selling Komal accessories curated for high versatility',
      'Sturdy magnetic-closure reusable keepsake storage box',
      'Ready-to-gift packaging saves time with zero wrapping needed',
    ],
    colors: [
      { name: 'Blush Rose', hex: '#F7D6D8' },
      { name: 'Champagne Gold', hex: '#F3E5AB' },
      { name: 'Powder Blue', hex: '#D0E3F0' },
    ],
    inStock: true,
    stockCount: 9,
    isBestseller: true,
  },

  // 4. Baby Accessories - Soft Headbands
  {
    id: 'ka-baby-01',
    name: 'Soft Organic Cotton Baby Floral Headbands (Trio)',
    category: 'baby-items',
    categoryLabel: 'Baby Accessories',
    price: 890,
    originalPrice: 1200,
    rating: 4.8,
    reviewCount: 64,
    badge: 'Gentle on Skin',
    images: [
      babyHeadbandsImg,
      heroImg,
    ],
    description: 'Ultra-stretchable seamless nylon bands topped with handmade organic cotton fabric florals and sweet mini bow knots. Specially tested to leave zero red marks on newborn and infant heads.',
    specs: {
      material: '100% Organic Cotton Florals & Medical-Grade Soft Nylon Band',
      dimensions: 'Stretches comfortably from 10cm to 30cm circumference',
      weight: '8g per headband',
      packaging: 'Eco kraft card with Komal Baby botanical stamping',
      suitability: 'Newborns (0 months) up to 3 years toddler',
    },
    features: [
      'Featherlight weight so babies forget they are wearing them',
      'One size expands gently as baby grows without pinching',
      'Zero sharp edges, harsh glue, or metal components',
      'Set includes three matching neutral shades for everyday outfits',
    ],
    colors: [
      { name: 'Pastel Garden Trio', hex: '#EBD8D0' },
      { name: 'Cream & Oat Trio', hex: '#F5EBE1' },
      { name: 'Dusty Rose Trio', hex: '#E8C5C8' },
    ],
    inStock: true,
    stockCount: 22,
    isNew: true,
  },

  // 5. Teen Cute - Pastel Claw Clip Set
  {
    id: 'ka-teen-02',
    name: 'French Marble Glossy Hair Claw (Large)',
    category: 'teen-cute',
    categoryLabel: 'Teen Cute',
    price: 550,
    originalPrice: 750,
    rating: 4.8,
    reviewCount: 110,
    images: [
      butterflyClipsImg,
      heroImg,
    ],
    description: 'An oversized, curved French silhouette claw clip with rounded interlocking teeth. Holds thick, long, or layered hair securely all day without headaches.',
    specs: {
      material: 'Cellulose Acetate with High-Tension Alloy Spring',
      dimensions: '11cm x 5cm',
      weight: '28g',
      packaging: 'Branded frosted ziplock pouch',
      suitability: 'Medium to thick long hair',
    },
    features: [
      'Curved ergonomic back contours naturally to the scalp',
      'Smooth hand-polished surface prevents hair friction and breakage',
      'Tested to hold high buns and French twists securely all day',
    ],
    colors: [
      { name: 'Tortoise Shell', hex: '#8B4513' },
      { name: 'Vanilla Cloud', hex: '#FAF0E6' },
      { name: 'Sage Marble', hex: '#9CAF88' },
    ],
    inStock: true,
    stockCount: 15,
  },

  // 6. Cute Jewelry - Celestial Huggies
  {
    id: 'ka-jewel-02',
    name: 'Celestial Star & Crescent Huggie Hoops',
    category: 'cute-jewelry',
    categoryLabel: 'Cute Jewelry',
    price: 980,
    originalPrice: 1350,
    rating: 4.9,
    reviewCount: 77,
    badge: 'Popular',
    images: [
      cloverNecklaceImg,
      heroImg,
    ],
    description: 'Chic asymmetrical huggie earrings featuring micro-pave cubic zirconia star and crescent moon charms. Lightweight snap clasp clicks shut securely.',
    specs: {
      material: '14K Gold Dip on Sterling Silver Post & AAA Cubic Zirconia',
      dimensions: 'Hoop inner diameter: 10mm; Charm drop: 8mm',
      weight: '3.1g pair',
      packaging: 'Velvet gift pouch',
      suitability: 'Earlobe and cartilage piercings',
    },
    features: [
      'Hypoallergenic S925 sterling silver posts prevent ear redness',
      'Secure click-latch closure ensures earrings stay put during sleep or workouts',
      'Dazzling micro-faceted pave crystals with diamond-like refraction',
    ],
    colors: [
      { name: 'Warm Gold', hex: '#E5C158' },
      { name: 'Silver Starlight', hex: '#E0E0E0' },
      { name: 'Rose Gold', hex: '#E8A598' },
    ],
    inStock: true,
    stockCount: 14,
  },

  // 7. Trendy Adult - Tennis Bracelet
  {
    id: 'ka-adult-01',
    name: 'Baguette Shimmer Luxe Tennis Bracelet',
    category: 'trendy-adult',
    categoryLabel: 'Trendy Adult',
    price: 1850,
    originalPrice: 2400,
    rating: 5.0,
    reviewCount: 92,
    badge: 'Elegance Pick',
    images: [
      cloverNecklaceImg,
      heroImg,
    ],
    description: 'Clean-cut rectangular baguette zircon stones handset in a sleek flexible track bracelet. Offers an effortless high-society look whether styled with a wrist watch or worn solo.',
    specs: {
      material: 'Platinum-tone Rhodium / 18K Gold Plated Brass & AAAA Baguette Zircon',
      dimensions: '16.5cm length with 3cm removable fold-over extender',
      weight: '11.5g',
      packaging: 'Jewelry box with anti-tarnish polishing cloth',
      suitability: 'Formal, office chic, and evening dinner wear',
    },
    features: [
      'Double safety clasp clasp lock prevents accidental unfastening',
      'Articulated bezel links flow smoothly around the wrist without pinching',
      'Tarnish-shield nano-coating maintains platinum brilliance over time',
    ],
    colors: [
      { name: 'Platinum Silver', hex: '#E5E7EB' },
      { name: 'Champagne Gold', hex: '#DFBA63' },
    ],
    inStock: true,
    stockCount: 8,
    isBestseller: true,
  },

  // 8. Trendy Adult - Baroque Pearl Drop Earrings
  {
    id: 'ka-adult-02',
    name: 'Sculpted Baroque Pearl Drop Earrings',
    category: 'trendy-adult',
    categoryLabel: 'Trendy Adult',
    price: 1350,
    originalPrice: 1750,
    rating: 4.8,
    reviewCount: 53,
    images: [
      cloverNecklaceImg,
      heroImg,
    ],
    description: 'Irregular natural-look freshwater baroque pearls suspended beneath a textured organic gold nugget stud. Every single pair possesses a unique, artisanal personality.',
    specs: {
      material: 'High-Luster Cultured Keshi Pearl & 18K Gold Brushed Metal',
      dimensions: 'Total length: 3.5cm; Pearl width: ~12mm',
      weight: '6.8g per pair',
      packaging: 'Hardbound Komal luxury keepsake gift box',
      suitability: 'Casual brunches, university presentations, weddings',
    },
    features: [
      'Lustrous iridescent nacre reflection under natural light',
      'Comfortable silicone-cushioned bullet backings prevent earlobe droop',
      'Textured gold stud complements both Eastern and Western attire',
    ],
    colors: [
      { name: 'Classic Gold & Ivory', hex: '#EDE8D0' },
      { name: 'Soft Silver & Pearl', hex: '#E2E8F0' },
    ],
    inStock: true,
    stockCount: 11,
  },

  // 9. Elegant Gift Sets - Bestie Forever Hamper
  {
    id: 'ka-gift-02',
    name: 'Sweet 16 & Bestie Forever Luxe Gift Box',
    category: 'gift-sets',
    categoryLabel: 'Gift Sets',
    price: 2450,
    originalPrice: 3100,
    rating: 4.9,
    reviewCount: 45,
    images: [
      giftHamperImg,
      heroImg,
    ],
    description: 'Specially created for best friends and birthdays! Includes 2 matching hand-braided friendship charm bracelets, 1 velvet heart hair claw, 2 mini floral hair pins, and a lovely calligraphy friendship note.',
    specs: {
      material: 'Pastel Satin Gift Box, Enamel Charms, French Claw & Cotton Braids',
      dimensions: '16cm x 12cm x 6cm',
      weight: '260g',
      packaging: 'Finished with a hand-tied mauve grossgrain ribbon',
      suitability: 'Teen girls, university friends, birthday surprises',
    },
    features: [
      'Two matching friendship bracelets meant to be shared between besties',
      'Includes celebratory handwritten note card with gold foil edges',
      'Protected with crinkle paper and luxury tissue liner',
    ],
    colors: [
      { name: 'Mauve Whisper', hex: '#D6C0D2' },
      { name: 'Peach Cream', hex: '#FAD4C0' },
    ],
    inStock: true,
    stockCount: 7,
  },

  // 10. Baby Accessories - Gentle Hair Clips
  {
    id: 'ka-baby-02',
    name: 'Gentle Fully-Lined Baby Ribbon Clips (5-Pack)',
    category: 'baby-items',
    categoryLabel: 'Baby Accessories',
    price: 750,
    originalPrice: 990,
    rating: 4.9,
    reviewCount: 88,
    images: [
      babyHeadbandsImg,
      heroImg,
    ],
    description: 'Pack of 5 tiny alligator clips entirely wrapped in soft grosgrain ribbon. The non-slip inner silicone strip holds wispy baby bangs firmly without pulling or slipping.',
    specs: {
      material: '100% Grosgrain Ribbon Wrapped Steel Alligator Clip',
      dimensions: 'Clip length: 3.5cm',
      weight: '2g per clip',
      packaging: 'Cotton pouch with clear display window',
      suitability: 'Babies and toddlers with fine, thin first hair',
    },
    features: [
      'Fully lined so zero exposed metal touches baby sensitive scalp',
      'Anti-slip silicone grip keeps clips secure in fine peach fuzz',
      '5 versatile everyday pastel colors matching baby dresses',
    ],
    colors: [
      { name: 'Warm Macaron Palette', hex: '#FCE7F3' },
      { name: 'Nordic Earth Palette', hex: '#E2E8F0' },
    ],
    inStock: true,
    stockCount: 25,
  },

  // 11. Teen Cute - Y2K Phone Charm & Beaded Wristlet
  {
    id: 'ka-teen-03',
    name: 'Kawaii Pastel Pearl Phone Lanyard Charm',
    category: 'teen-cute',
    categoryLabel: 'Teen Cute',
    price: 490,
    originalPrice: 650,
    rating: 4.7,
    reviewCount: 73,
    images: [
      butterflyClipsImg,
      heroImg,
    ],
    description: 'Chic beaded wrist strap featuring acrylic bow motifs, pastel heart beads, and faux freshwater pearls. Loops easily through any phone case mute opening or lanyard loop.',
    specs: {
      material: 'Reinforced 7-strand nylon cord, Acrylic beads & simulated pearls',
      dimensions: 'Loop circumference: 24cm',
      weight: '12g',
      packaging: 'Komal branded glassine sleeve',
      suitability: 'All smartphone cases (iPhone, Samsung, etc.)',
    },
    features: [
      'Heavy-duty tensile cord withstands up to 6kg of pull force',
      'Hands-free wrist tether keeps your phone safe while taking mirror selfies',
      'Adorned with sweet heart and star iridescent accents',
    ],
    colors: [
      { name: 'Cotton Candy Mix', hex: '#FECDD3' },
      { name: 'Cloud Lavender', hex: '#DDD6FE' },
    ],
    inStock: true,
    stockCount: 30,
  },

  // 12. Trendy Adult - Sculptural Gold Ring Set
  {
    id: 'ka-adult-03',
    name: 'Minimalist Dome & Twist Ring Duo',
    category: 'trendy-adult',
    categoryLabel: 'Trendy Adult',
    price: 1150,
    originalPrice: 1550,
    rating: 4.8,
    reviewCount: 41,
    images: [
      cloverNecklaceImg,
      heroImg,
    ],
    description: 'Set of two complementary sculptural rings: one polished bold dome ring and one delicate organic croissant twisted band. Made with adjustable open-back sizing.',
    specs: {
      material: '18K Gold Plated Stainless Steel (Waterproof & Non-tarnish)',
      dimensions: 'Adjustable back fits US Ring Sizes 5 to 9 comfortably',
      weight: '7.4g set',
      packaging: 'Microfiber travel envelope',
      suitability: 'Stackable or worn individually on index/ring finger',
    },
    features: [
      'Sweat-proof and soap-safe: wear while washing hands without worries',
      'Smooth inner hollow comfort-fit curve prevents moisture buildup',
      'Adjustable band allows seamless switching between fingers',
    ],
    colors: [
      { name: 'Radiant Gold', hex: '#E5C058' },
      { name: 'Sleek Silver', hex: '#CBD5E1' },
    ],
    inStock: true,
    stockCount: 16,
  },
];
