import 'dotenv/config';
import mongoose from 'mongoose';

import collectionModel    from '../models/Product Management/collection.model.js';
import colourModel        from '../models/Product Variants/colour.model.js';
import sizeModel          from '../models/Product Variants/size.model.js';
import accessoryTypeModel from '../models/Product Management/accessoryType.model.js';
import accessoryModel     from '../models/Product Management/accessory.model.js';
import productModel       from '../models/Product Management/product.model.js';
import priceModel         from '../models/Product Management/price.model.js';
import couponModel        from '../models/PromotionManegment/coupon.model.js';
import eventModel         from '../models/PromotionManegment/event.model.js';
import bannerModel        from '../models/PromotionManegment/banner.model.js';
import stockKistModel     from '../models/Product Management/stockKist.model.js';

const MONGODB_URI = process.env.MONGODB_URI;

// ── Image helpers (picsum.photos — always available, seed-based = deterministic) ──
const img  = (seed, w = 500, h = 500)  => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const bnr  = (seed)                    => img(seed, 1200, 400);

// ── COLLECTIONS ───────────────────────────────────────────────────────────────
const COLLECTIONS = [
  { name: 'Summer Collection',  description: 'Light, airy fabrics and vibrant colours for the summer season.',            thumbnail: img('summer1'),   bannerThumnail: bnr('summer-b1'),   status: 'active'   },
  { name: 'Winter Collection',  description: 'Luxurious wools and cashmeres crafted for elegant warmth.',                 thumbnail: img('winter1'),   bannerThumnail: bnr('winter-b1'),   status: 'active'   },
  { name: 'Evening Wear',       description: 'Sophisticated gowns and cocktail dresses for every special occasion.',      thumbnail: img('evening1'),  bannerThumnail: bnr('evening-b1'),  status: 'active'   },
  { name: 'Casual Wear',        description: 'Effortlessly chic everyday essentials for the modern woman.',               thumbnail: img('casual1'),   bannerThumnail: bnr('casual-b1'),   status: 'active'   },
  { name: 'Office Wear',        description: 'Sharp, tailored pieces that command respect in any boardroom.',             thumbnail: img('office1'),   bannerThumnail: bnr('office-b1'),   status: 'active'   },
  { name: 'Bridal Collection',  description: 'Timeless bridal ensembles celebrating your most precious day.',             thumbnail: img('bridal1'),   bannerThumnail: bnr('bridal-b1'),   status: 'active'   },
];

// ── COLOURS ───────────────────────────────────────────────────────────────────
const COLOURS = [
  { name: 'Midnight Black',  colour: '#0D0D0D' },
  { name: 'Pure White',      colour: '#FAFAFA'  },
  { name: 'Ivory Cream',     colour: '#FFF8E7'  },
  { name: 'Navy Blue',       colour: '#1B3A6B'  },
  { name: 'Burgundy',        colour: '#7B1E2A'  },
  { name: 'Olive Green',     colour: '#4A5240'  },
  { name: 'Blush Pink',      colour: '#F4A7B9'  },
  { name: 'Mustard Yellow',  colour: '#D4AA3A'  },
  { name: 'Charcoal Grey',   colour: '#4A4A4A'  },
  { name: 'Rose Gold',       colour: '#C9956C'  },
];

// ── SIZES ─────────────────────────────────────────────────────────────────────
const SIZES = [
  { name: 'XS' }, { name: 'S' }, { name: 'M' },
  { name: 'L'  }, { name: 'XL'}, { name: 'XXL'},
];

// ── ACCESSORY TYPES ───────────────────────────────────────────────────────────
const ACCESSORY_TYPES = [
  { name: 'Handbags',          description: 'Luxury handbags and clutches for every occasion.',         thumbnail: img('handbag1'),    accessorybanner: bnr('handbag-b1'),    status: 'active' },
  { name: 'Belts',             description: 'Premium leather belts to complete any look.',              thumbnail: img('belt1'),       accessorybanner: bnr('belt-b1'),       status: 'active' },
  { name: 'Hats & Caps',       description: 'Stylish headwear from sun hats to structured caps.',       thumbnail: img('hat1'),        accessorybanner: bnr('hat-b1'),        status: 'active' },
  { name: 'Scarves & Stoles',  description: 'Silk, wool, and printed scarves for every season.',        thumbnail: img('scarf1'),      accessorybanner: bnr('scarf-b1'),      status: 'active' },
  { name: 'Jewellery',         description: 'Statement and everyday jewellery crafted with precision.', thumbnail: img('jewellery1'),  accessorybanner: bnr('jewellery-b1'),  status: 'active' },
  { name: 'Footwear',          description: 'Elegant shoes and sandals for every step you take.',       thumbnail: img('shoe1'),       accessorybanner: bnr('shoe-b1'),       status: 'active' },
];

// ── COUPONS ───────────────────────────────────────────────────────────────────
const COUPONS = [
  { couponCode: 'WELCOME10', discountType: 'percentage', discount: '10',  minimumOrderAmount: '0',    limitSingleUser: '1', maximumDiscountAmount: '500',  startDate: '2026-01-01', expiredDate: '2026-12-31', startTime: '00:00', expiredTime: '23:59', status: 'active'   },
  { couponCode: 'SAVE20',    discountType: 'percentage', discount: '20',  minimumOrderAmount: '1500', limitSingleUser: '1', maximumDiscountAmount: '1000', startDate: '2026-01-01', expiredDate: '2026-12-31', startTime: '00:00', expiredTime: '23:59', status: 'active'   },
  { couponCode: 'FLAT500',   discountType: 'flat',       discount: '500', minimumOrderAmount: '2000', limitSingleUser: '2', maximumDiscountAmount: '500',  startDate: '2026-01-01', expiredDate: '2026-12-31', startTime: '00:00', expiredTime: '23:59', status: 'active'   },
  { couponCode: 'NEWUSER15', discountType: 'percentage', discount: '15',  minimumOrderAmount: '500',  limitSingleUser: '1', maximumDiscountAmount: '750',  startDate: '2026-01-01', expiredDate: '2026-12-31', startTime: '00:00', expiredTime: '23:59', status: 'active'   },
  { couponCode: 'FESTIVE25', discountType: 'percentage', discount: '25',  minimumOrderAmount: '3000', limitSingleUser: '1', maximumDiscountAmount: '2000', startDate: '2026-10-01', expiredDate: '2026-11-30', startTime: '00:00', expiredTime: '23:59', status: 'inactive' },
];

// ── EVENTS ────────────────────────────────────────────────────────────────────
const EVENTS = [
  { title: 'Summer Sale 2026',          description: 'Up to 50% off on all summer essentials. Shop the season\'s best looks.',     thumbnail: img('event-summer'),  date: new Date('2026-06-01'), location: 'Online & All Stores',        url: '/summer-sale',     status: 'active'   },
  { title: 'Festive Collection Launch', description: 'New arrivals every day, celebrating the season with our exclusive festive line.', thumbnail: img('event-festive'), date: new Date('2026-10-15'), location: 'Mumbai Flagship & Online',   url: '/festive-launch',  status: 'active'   },
  { title: 'End of Season Sale',        description: 'Final reductions on select styles across all collections.',                   thumbnail: img('event-sale'),    date: new Date('2026-03-01'), location: 'Online',                     url: '/end-of-season',   status: 'inactive' },
];

// ── BANNERS ───────────────────────────────────────────────────────────────────
const BANNERS = [
  { columnName: 'Hero Banner',    Heading: 'New Summer Collection',   buttonName: 'Shop Now',    buttonLink: '/collection/summer', description: 'Discover our latest summer styles.',       thumbnail: bnr('hero1'),   status: 'active' },
  { columnName: 'Promo Banner',   Heading: 'Up to 50% Off — Sale',    buttonName: 'View Offers', buttonLink: '/sale',              description: 'Limited time offers on selected styles.',  thumbnail: bnr('promo1'),  status: 'active' },
  { columnName: 'Feature Banner', Heading: 'Bridal Collection 2026',  buttonName: 'Explore',     buttonLink: '/collection/bridal', description: 'Timeless looks for your most special day.', thumbnail: bnr('bridal2'), status: 'active' },
];

// ── ACCESSORIES ───────────────────────────────────────────────────────────────
const ACCESSORIES = [
  {
    accessoryName: 'Classic Structured Handbag',
    shortDescription: 'A timeless structured bag in premium leather.',
    detailedDescription: 'Crafted from full-grain leather with gold hardware. Multiple compartments and a detachable shoulder strap make this the perfect everyday luxury.',
    additionalInformation: 'Material: Full-grain leather. Dimensions: 30×22×10 cm. Gold-tone hardware.',
    selectSize: ['M', 'L'],
    selectColor: [{ color: 'Midnight Black', code: '#0D0D0D' }, { color: 'Ivory Cream', code: '#FFF8E7' }, { color: 'Burgundy', code: '#7B1E2A' }],
    selectAccessoryType: ['Handbags'],
    accessorySKU: 'HB-001',
    url: 'classic-structured-handbag',
    colorImages: [
      { color: 'Midnight Black', code: '#0D0D0D', accessoryThumbnail: img('hb-black'),  additionalThumbnail: [img('hb-black2')],  isDefault: true  },
      { color: 'Ivory Cream',    code: '#FFF8E7', accessoryThumbnail: img('hb-ivory'),  additionalThumbnail: [],                  isDefault: false },
      { color: 'Burgundy',       code: '#7B1E2A', accessoryThumbnail: img('hb-burg'),   additionalThumbnail: [],                  isDefault: false },
    ],
    status: 'active',
  },
  {
    accessoryName: 'Silk Printed Stole',
    shortDescription: 'A hand-printed silk stole in vibrant artisan patterns.',
    detailedDescription: '100% pure mulberry silk with hand-printed artisan patterns. Light and versatile, it adds instant elegance to any outfit.',
    additionalInformation: 'Material: 100% Mulberry Silk. Dimensions: 180×90 cm. Dry clean only.',
    selectSize: ['Free Size'],
    selectColor: [{ color: 'Blush Pink', code: '#F4A7B9' }, { color: 'Mustard Yellow', code: '#D4AA3A' }],
    selectAccessoryType: ['Scarves & Stoles'],
    accessorySKU: 'SC-001',
    url: 'silk-printed-stole',
    colorImages: [
      { color: 'Blush Pink',     code: '#F4A7B9', accessoryThumbnail: img('scarf-pink'),   additionalThumbnail: [], isDefault: true  },
      { color: 'Mustard Yellow', code: '#D4AA3A', accessoryThumbnail: img('scarf-yellow'), additionalThumbnail: [], isDefault: false },
    ],
    status: 'active',
  },
  {
    accessoryName: 'Wide Brim Sun Hat',
    shortDescription: 'Natural straw wide-brim hat with a signature silk ribbon.',
    detailedDescription: 'Woven from natural straw with a signature silk ribbon detail. UV-protective and lightweight — the perfect summer companion for beach days and garden parties.',
    additionalInformation: 'Material: Natural straw, silk ribbon. One size fits most. UPF 50+.',
    selectSize: ['Free Size'],
    selectColor: [{ color: 'Ivory Cream', code: '#FFF8E7' }, { color: 'Midnight Black', code: '#0D0D0D' }],
    selectAccessoryType: ['Hats & Caps'],
    accessorySKU: 'HT-001',
    url: 'wide-brim-sun-hat',
    colorImages: [
      { color: 'Ivory Cream',   code: '#FFF8E7', accessoryThumbnail: img('hat-ivory'), additionalThumbnail: [], isDefault: true  },
      { color: 'Midnight Black',code: '#0D0D0D', accessoryThumbnail: img('hat-black'), additionalThumbnail: [], isDefault: false },
    ],
    status: 'active',
  },
  {
    accessoryName: 'Premium Leather Belt',
    shortDescription: 'Slim vegetable-tanned leather belt with gold buckle.',
    detailedDescription: 'Handcrafted from vegetable-tanned leather. The slim 2 cm profile and adjustable gold-tone buckle complement both tailored and casual looks.',
    additionalInformation: 'Material: Vegetable-tanned leather. Width: 2 cm. Length: adjustable S/M/L.',
    selectSize: ['S', 'M', 'L'],
    selectColor: [{ color: 'Midnight Black', code: '#0D0D0D' }, { color: 'Burgundy', code: '#7B1E2A' }],
    selectAccessoryType: ['Belts'],
    accessorySKU: 'BL-001',
    url: 'premium-leather-belt',
    colorImages: [
      { color: 'Midnight Black', code: '#0D0D0D', accessoryThumbnail: img('belt-black'), additionalThumbnail: [], isDefault: true  },
      { color: 'Burgundy',       code: '#7B1E2A', accessoryThumbnail: img('belt-burg'),  additionalThumbnail: [], isDefault: false },
    ],
    status: 'active',
  },
  {
    accessoryName: 'Gold Statement Necklace',
    shortDescription: 'Bold geometric necklace in 22k gold plating.',
    detailedDescription: 'Intricately designed geometric pendant in 22k gold-plated brass. The layered structure catches the light beautifully, making any outfit stand out.',
    additionalInformation: 'Material: 22k gold-plated brass. Chain length: 45 cm. Nickel-free.',
    selectSize: ['Free Size'],
    selectColor: [{ color: 'Rose Gold', code: '#C9956C' }],
    selectAccessoryType: ['Jewellery'],
    accessorySKU: 'JW-001',
    url: 'gold-statement-necklace',
    colorImages: [
      { color: 'Rose Gold', code: '#C9956C', accessoryThumbnail: img('jewel-gold'), additionalThumbnail: [img('jewel-gold2')], isDefault: true },
    ],
    status: 'active',
  },
  {
    accessoryName: 'Block Heel Suede Sandals',
    shortDescription: 'Comfortable block-heel sandals in premium suede.',
    detailedDescription: 'Combines comfort and elegance with a 5 cm block heel. Premium suede upper with a leather-lined insole for all-day wear.',
    additionalInformation: 'Material: Premium suede upper, leather sole. Heel height: 5 cm.',
    selectSize: ['S', 'M', 'L', 'XL'],
    selectColor: [{ color: 'Ivory Cream', code: '#FFF8E7' }, { color: 'Midnight Black', code: '#0D0D0D' }],
    selectAccessoryType: ['Footwear'],
    accessorySKU: 'FW-001',
    url: 'block-heel-suede-sandals',
    colorImages: [
      { color: 'Ivory Cream',   code: '#FFF8E7', accessoryThumbnail: img('shoe-ivory'), additionalThumbnail: [], isDefault: true  },
      { color: 'Midnight Black',code: '#0D0D0D', accessoryThumbnail: img('shoe-black'), additionalThumbnail: [], isDefault: false },
    ],
    status: 'active',
  },
];

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    productName: 'Floral Summer Maxi Dress',
    shortDescription: 'A flowing floral maxi dress perfect for summer occasions.',
    detailedDescription: 'Elegant maxi dress in vibrant floral print on lightweight chiffon. Flattering wrap silhouette with an adjustable tie waist — ideal for beach holidays, garden parties, or casual summer evenings.',
    additionalInformation: 'Material: 100% Chiffon. Care: Hand wash cold, line dry.',
    selectCollection: ['Summer Collection', 'Casual Wear'],
    selectColor: [{ color: 'Blush Pink', code: '#F4A7B9' }, { color: 'Mustard Yellow', code: '#D4AA3A' }],
    selectSize: ['XS', 'S', 'M', 'L', 'XL'],
    productSKU: 'PRD-001',
    url: 'floral-summer-maxi-dress',
    colorImages: [
      { color: 'Blush Pink',     code: '#F4A7B9', thumbnail: img('dress-pink'),   additionalThumbnail: [img('dress-pink2')], isDefault: true  },
      { color: 'Mustard Yellow', code: '#D4AA3A', thumbnail: img('dress-yellow'), additionalThumbnail: [],                   isDefault: false },
    ],
    status: 'active',
  },
  {
    productName: 'Classic Tailored Blazer',
    shortDescription: 'A sharp tailored blazer for office and evening wear.',
    detailedDescription: 'Premium wool-blend blazer with a single-button closure, structured shoulders, and two front pockets. Transitions seamlessly from office to after-work occasions.',
    additionalInformation: 'Material: 70% Wool, 30% Polyester. Dry clean only.',
    selectCollection: ['Office Wear', 'Evening Wear'],
    selectColor: [{ color: 'Midnight Black', code: '#0D0D0D' }, { color: 'Charcoal Grey', code: '#4A4A4A' }, { color: 'Ivory Cream', code: '#FFF8E7' }],
    selectSize: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    productSKU: 'PRD-002',
    url: 'classic-tailored-blazer',
    colorImages: [
      { color: 'Midnight Black', code: '#0D0D0D', thumbnail: img('blazer-black'), additionalThumbnail: [img('blazer-black2')], isDefault: true  },
      { color: 'Charcoal Grey',  code: '#4A4A4A', thumbnail: img('blazer-grey'),  additionalThumbnail: [],                     isDefault: false },
      { color: 'Ivory Cream',    code: '#FFF8E7', thumbnail: img('blazer-ivory'), additionalThumbnail: [],                     isDefault: false },
    ],
    status: 'active',
  },
  {
    productName: 'Cashmere Wrap Coat',
    shortDescription: 'Luxurious Mongolian cashmere wrap coat for the winter season.',
    detailedDescription: 'Crafted from the finest Mongolian cashmere, this generously cut wrap coat delivers warmth without sacrificing elegance. A signature piece from the AuraMart Winter Collection.',
    additionalInformation: 'Material: 100% Mongolian Cashmere. Dry clean only.',
    selectCollection: ['Winter Collection'],
    selectColor: [{ color: 'Ivory Cream', code: '#FFF8E7' }, { color: 'Midnight Black', code: '#0D0D0D' }],
    selectSize: ['S', 'M', 'L', 'XL'],
    productSKU: 'PRD-003',
    url: 'cashmere-wrap-coat',
    colorImages: [
      { color: 'Ivory Cream',   code: '#FFF8E7', thumbnail: img('coat-ivory'), additionalThumbnail: [img('coat-ivory2')], isDefault: true  },
      { color: 'Midnight Black',code: '#0D0D0D', thumbnail: img('coat-black'), additionalThumbnail: [],                   isDefault: false },
    ],
    status: 'active',
  },
  {
    productName: 'Silk Evening Gown',
    shortDescription: 'An elegant floor-length silk gown for special evenings.',
    detailedDescription: 'Timeless floor-length gown in duchess satin with a deep V-neckline, fitted bodice, and a flowing A-line skirt. Moves beautifully with every step.',
    additionalInformation: 'Material: 100% Duchess Satin. Dry clean recommended.',
    selectCollection: ['Evening Wear', 'Bridal Collection'],
    selectColor: [{ color: 'Midnight Black', code: '#0D0D0D' }, { color: 'Burgundy', code: '#7B1E2A' }, { color: 'Navy Blue', code: '#1B3A6B' }],
    selectSize: ['XS', 'S', 'M', 'L', 'XL'],
    productSKU: 'PRD-004',
    url: 'silk-evening-gown',
    colorImages: [
      { color: 'Midnight Black', code: '#0D0D0D', thumbnail: img('gown-black'), additionalThumbnail: [img('gown-black2')], isDefault: true  },
      { color: 'Burgundy',       code: '#7B1E2A', thumbnail: img('gown-burg'),  additionalThumbnail: [],                   isDefault: false },
      { color: 'Navy Blue',      code: '#1B3A6B', thumbnail: img('gown-navy'),  additionalThumbnail: [],                   isDefault: false },
    ],
    status: 'active',
  },
  {
    productName: 'Linen Shirt Dress',
    shortDescription: 'A relaxed linen shirt dress for effortless everyday style.',
    detailedDescription: 'Relaxed-fit 100% Irish linen shirt dress with a classic button-front, chest pockets, and a half-belt at the back for an optional fitted silhouette.',
    additionalInformation: 'Material: 100% Irish Linen. Machine wash cold.',
    selectCollection: ['Casual Wear', 'Summer Collection'],
    selectColor: [{ color: 'Olive Green', code: '#4A5240' }, { color: 'Ivory Cream', code: '#FFF8E7' }, { color: 'Navy Blue', code: '#1B3A6B' }],
    selectSize: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    productSKU: 'PRD-005',
    url: 'linen-shirt-dress',
    colorImages: [
      { color: 'Olive Green', code: '#4A5240', thumbnail: img('linen-olive'), additionalThumbnail: [img('linen-olive2')], isDefault: true  },
      { color: 'Ivory Cream', code: '#FFF8E7', thumbnail: img('linen-ivory'), additionalThumbnail: [],                   isDefault: false },
      { color: 'Navy Blue',   code: '#1B3A6B', thumbnail: img('linen-navy'),  additionalThumbnail: [],                   isDefault: false },
    ],
    status: 'active',
  },
  {
    productName: 'Structured Pencil Skirt',
    shortDescription: 'A classic pencil skirt for the modern professional.',
    detailedDescription: 'Premium stretch-wool blend pencil skirt, sitting at the natural waist with a mid-knee hem that flatters every silhouette. An office wardrobe essential.',
    additionalInformation: 'Material: 90% Wool, 10% Elastane. Dry clean only.',
    selectCollection: ['Office Wear'],
    selectColor: [{ color: 'Midnight Black', code: '#0D0D0D' }, { color: 'Charcoal Grey', code: '#4A4A4A' }, { color: 'Navy Blue', code: '#1B3A6B' }],
    selectSize: ['XS', 'S', 'M', 'L', 'XL'],
    productSKU: 'PRD-006',
    url: 'structured-pencil-skirt',
    colorImages: [
      { color: 'Midnight Black', code: '#0D0D0D', thumbnail: img('skirt-black'), additionalThumbnail: [img('skirt-black2')], isDefault: true  },
      { color: 'Charcoal Grey',  code: '#4A4A4A', thumbnail: img('skirt-grey'),  additionalThumbnail: [],                    isDefault: false },
      { color: 'Navy Blue',      code: '#1B3A6B', thumbnail: img('skirt-navy'),  additionalThumbnail: [],                    isDefault: false },
    ],
    status: 'active',
  },
  {
    productName: 'Bridal Lehenga Set',
    shortDescription: 'Intricately embroidered bridal lehenga in ivory and blush.',
    detailedDescription: 'Show-stopping bridal lehenga hand-embroidered with zari and sequin work. Includes matching choli and dupatta. A masterpiece from the AuraMart Bridal Collection 2026.',
    additionalInformation: 'Material: Raw silk with zari embroidery. Dry clean only. Made to order — allow 6–8 weeks.',
    selectCollection: ['Bridal Collection', 'Evening Wear'],
    selectColor: [{ color: 'Ivory Cream', code: '#FFF8E7' }, { color: 'Blush Pink', code: '#F4A7B9' }],
    selectSize: ['XS', 'S', 'M', 'L', 'XL'],
    productSKU: 'PRD-007',
    url: 'bridal-lehenga-set',
    colorImages: [
      { color: 'Ivory Cream', code: '#FFF8E7', thumbnail: img('lehenga-ivory'), additionalThumbnail: [img('lehenga-ivory2'), img('lehenga-ivory3')], isDefault: true  },
      { color: 'Blush Pink',  code: '#F4A7B9', thumbnail: img('lehenga-pink'),  additionalThumbnail: [],                                            isDefault: false },
    ],
    status: 'active',
  },
  {
    productName: 'Casual Knit Co-ord Set',
    shortDescription: 'Matching ribbed knit top and wide-leg trousers for weekends.',
    detailedDescription: 'Coordinated knit set in a soft cotton-modal blend — cropped ribbed top with matching wide-leg trouser. Effortlessly stylish for weekend outings.',
    additionalInformation: 'Material: 60% Cotton, 40% Modal. Machine wash gentle.',
    selectCollection: ['Casual Wear'],
    selectColor: [{ color: 'Blush Pink', code: '#F4A7B9' }, { color: 'Olive Green', code: '#4A5240' }, { color: 'Ivory Cream', code: '#FFF8E7' }],
    selectSize: ['XS', 'S', 'M', 'L', 'XL'],
    productSKU: 'PRD-008',
    url: 'casual-knit-coord-set',
    colorImages: [
      { color: 'Blush Pink',  code: '#F4A7B9', thumbnail: img('coord-pink'),  additionalThumbnail: [img('coord-pink2')], isDefault: true  },
      { color: 'Olive Green', code: '#4A5240', thumbnail: img('coord-olive'), additionalThumbnail: [],                   isDefault: false },
      { color: 'Ivory Cream', code: '#FFF8E7', thumbnail: img('coord-ivory'), additionalThumbnail: [],                   isDefault: false },
    ],
    status: 'active',
  },
];

// ── STOCKISTS ─────────────────────────────────────────────────────────────────
const STOCKISTS = [
  { name: 'Priya Sharma',    email: 'priya.sharma@luxefashions.in',   website: 'https://luxefashions.in',    shopName: 'Luxe Fashions',         country: 'India', Address: '14, Hill Road, Bandra West', city: 'Mumbai',    status: 'active'   },
  { name: 'Rahul Mehta',     email: 'rahul@trendspotdelhi.in',        website: 'https://trendspotdelhi.in',  shopName: 'TrendSpot Delhi',       country: 'India', Address: '27, Connaught Place',        city: 'New Delhi', status: 'active'   },
  { name: 'Ananya Krishnan', email: 'ananya@silkroutebengaluru.com',  website: 'https://silkroutebengaluru.com', shopName: 'Silk Route',        country: 'India', Address: '8, Brigade Road',            city: 'Bengaluru', status: 'active'   },
  { name: 'Vikram Joshi',    email: 'vikram@ethnikPune.in',           website: 'https://ethnikpune.in',      shopName: 'Ethnik Pune',           country: 'India', Address: '33, FC Road, Deccan',        city: 'Pune',      status: 'active'   },
  { name: 'Sneha Agarwal',   email: 'sneha@voguevaultjaipur.in',      website: 'https://voguevaultjaipur.in',shopName: 'Vogue Vault',           country: 'India', Address: '5, MI Road, C-Scheme',       city: 'Jaipur',    status: 'active'   },
  { name: 'Karthik Nair',    email: 'karthik@coastalchiccochin.in',   website: 'https://coastalchic.in',     shopName: 'Coastal Chic',          country: 'India', Address: '12, MG Road, Ernakulam',     city: 'Kochi',     status: 'inactive' },
];

// ── SEED RUNNER ───────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🔌 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  // Skip if data already exists
  const existingCount = await productModel.countDocuments();
  if (existingCount > 0) {
    console.log(`ℹ️  Database already has ${existingCount} products — skipping seed to avoid duplicates.`);
    console.log('   Delete existing data manually in Atlas if you want to re-seed.\n');
    await mongoose.disconnect();
    process.exit(0);
  }

  // Insert base reference data
  const [collections, colours, sizes, accessoryTypes, coupons, events, banners, stockists] = await Promise.all([
    collectionModel.insertMany(COLLECTIONS),
    colourModel.insertMany(COLOURS),
    sizeModel.insertMany(SIZES),
    accessoryTypeModel.insertMany(ACCESSORY_TYPES),
    couponModel.insertMany(COUPONS),
    eventModel.insertMany(EVENTS),
    bannerModel.insertMany(BANNERS),
    stockKistModel.insertMany(STOCKISTS),
  ]);

  // Insert accessories
  const accessories = await accessoryModel.insertMany(ACCESSORIES);

  // Insert products
  const products = await productModel.insertMany(PRODUCTS);

  // Insert prices for products
  const productPrices = [
    { productId: products[0]._id, buyingPrice:  1800, sellingPrice:  3499, stockQuantity: 50, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { productId: products[1]._id, buyingPrice:  4200, sellingPrice:  7999, stockQuantity: 35, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { productId: products[2]._id, buyingPrice:  8500, sellingPrice: 15999, stockQuantity: 20, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { productId: products[3]._id, buyingPrice:  5500, sellingPrice: 10999, stockQuantity: 25, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { productId: products[4]._id, buyingPrice:  1400, sellingPrice:  2799, stockQuantity: 60, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { productId: products[5]._id, buyingPrice:  2800, sellingPrice:  5499, stockQuantity: 40, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { productId: products[6]._id, buyingPrice: 12000, sellingPrice: 24999, stockQuantity: 10, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { productId: products[7]._id, buyingPrice:  1200, sellingPrice:  2299, stockQuantity: 80, minimumQuantity: 1, country: 'IND', currency: 'INR' },
  ];

  // Insert prices for accessories
  const accessoryPrices = [
    { accessoryId: accessories[0]._id, buyingPrice: 3500, sellingPrice: 6999, stockQuantity: 30, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { accessoryId: accessories[1]._id, buyingPrice:  800, sellingPrice: 1799, stockQuantity: 50, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { accessoryId: accessories[2]._id, buyingPrice:  600, sellingPrice: 1299, stockQuantity: 40, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { accessoryId: accessories[3]._id, buyingPrice: 1200, sellingPrice: 2499, stockQuantity: 35, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { accessoryId: accessories[4]._id, buyingPrice: 1500, sellingPrice: 3299, stockQuantity: 25, minimumQuantity: 1, country: 'IND', currency: 'INR' },
    { accessoryId: accessories[5]._id, buyingPrice: 2500, sellingPrice: 4999, stockQuantity: 20, minimumQuantity: 1, country: 'IND', currency: 'INR' },
  ];

  const prices = await priceModel.insertMany([...productPrices, ...accessoryPrices]);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('🎉 Seed complete!\n');
  console.log('┌─────────────────────────────────┐');
  console.log('│         DATA SUMMARY            │');
  console.log('├─────────────────────────────────┤');
  console.log(`│  Collections (Categories)   ${String(collections.length).padStart(2)}  │`);
  console.log(`│  Colours                    ${String(colours.length).padStart(2)}  │`);
  console.log(`│  Sizes                       ${String(sizes.length).padStart(2)}  │`);
  console.log(`│  Accessory Types             ${String(accessoryTypes.length).padStart(2)}  │`);
  console.log(`│  Accessories                 ${String(accessories.length).padStart(2)}  │`);
  console.log(`│  Products                    ${String(products.length).padStart(2)}  │`);
  console.log(`│  Price Entries              ${String(prices.length).padStart(2)}  │`);
  console.log(`│  Coupons                     ${String(coupons.length).padStart(2)}  │`);
  console.log(`│  Events                      ${String(events.length).padStart(2)}  │`);
  console.log(`│  Banners                     ${String(banners.length).padStart(2)}  │`);
  console.log(`│  Stockists                   ${String(stockists.length).padStart(2)}  │`);
  console.log('└─────────────────────────────────┘');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
