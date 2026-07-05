import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// ─── Models ──────────────────────────────────────────────────────────────────
import collectionModel    from '../models/Product Management/collection.model.js';
import accessoryTypeModel from '../models/Product Management/accessoryType.model.js';
import productModel       from '../models/Product Management/product.model.js';
import accessoryModel     from '../models/Product Management/accessory.model.js';
import priceModel         from '../models/Product Management/price.model.js';
import bannerModel        from '../models/PromotionManegment/banner.model.js';
import eventModel         from '../models/PromotionManegment/event.model.js';
import stockKistModel     from '../models/Product Management/stockKist.model.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const img = (id, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

const slug = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const price = (productId, accessoryId, selling, stock = 50) => ({
  ...(productId  ? { productId }   : {}),
  ...(accessoryId ? { accessoryId } : {}),
  buyingPrice:     Math.round(selling * 0.6),
  sellingPrice:    selling,
  stockQuantity:   stock,
  minimumQuantity: 1,
  reservedQuantity: 0,
  country:  'IND',
  currency: 'INR',
});

// ─── Collections (Categories) ─────────────────────────────────────────────────
const COLLECTIONS = [
  {
    name: 'Fashion',
    thumbnail:     img('1483985988355-763728e1935b'),
    bannerThumnail: img('1490481651871-ab68de25d43d', 1600, 600),
    description:   'Trendy ethnic and western wear for every occasion. Explore kurtas, sarees, suits, and more from India\'s top fashion brands.',
    status: 'active',
  },
  {
    name: 'Beauty',
    thumbnail:     img('1631730486784-74757d38e27f'),
    bannerThumnail: img('1522338140262-f46f5913618a', 1600, 600),
    description:   'Premium skincare, makeup, and haircare products. Discover the best beauty brands trusted by millions across India.',
    status: 'active',
  },
  {
    name: 'Footwear',
    thumbnail:     img('1542291026-7eec264c27ff'),
    bannerThumnail: img('1460353581641-37baddab0fa2', 1600, 600),
    description:   'Step out in style with our curated collection of sneakers, heels, sandals, and formal shoes from global and Indian brands.',
    status: 'active',
  },
  {
    name: 'Electronics',
    thumbnail:     img('1505740420928-5e560c06d30e'),
    bannerThumnail: img('1518770660439-4636190af475', 1600, 600),
    description:   'Cutting-edge gadgets, audio, cameras, and smart home devices. Get the latest tech at unbeatable prices.',
    status: 'active',
  },
  {
    name: 'Laptops',
    thumbnail:     img('1517336714731-489689fd1ca8'),
    bannerThumnail: img('1496181133206-80ce9b88a853', 1600, 600),
    description:   'Powerful laptops for work, gaming, and creativity. MacBooks, Dell, HP, Lenovo, ASUS — all in one place.',
    status: 'active',
  },
  {
    name: 'Mobiles',
    thumbnail:     img('1511707171634-5f897ff02aa9'),
    bannerThumnail: img('1598327105666-5b89351aff97', 1600, 600),
    description:   'Latest smartphones from Apple, Samsung, OnePlus, Google, and more. Explore flagship to budget options.',
    status: 'active',
  },
  {
    name: 'Books',
    thumbnail:     img('1512820790803-83ca734da794'),
    bannerThumnail: img('1524995997946-a1c2e315a42f', 1600, 600),
    description:   'Bestselling fiction, non-fiction, self-help, and business books. Fuel your mind with India\'s widest book collection.',
    status: 'active',
  },
  {
    name: 'Accessories',
    thumbnail:     img('1553062407-98eeb64c6a62'),
    bannerThumnail: img('1492707892479-7bc8d5a4ee93', 1600, 600),
    description:   'Complete your look with premium bags, jewellery, watches, sunglasses, and more. Curated accessories for every style.',
    status: 'active',
  },
];

// ─── Accessory Types ──────────────────────────────────────────────────────────
const ACCESSORY_TYPES = [
  {
    name: 'Jewellery',
    thumbnail:      img('1535632787350-4e68ef0ac584'),
    accessorybanner: img('1515562141207-7a88fb7ce338', 1600, 500),
    description: 'Fine gold, silver, and diamond jewellery — earrings, necklaces, rings, bracelets and more.',
    status: 'active',
  },
  {
    name: 'Bags',
    thumbnail:      img('1548036161-18b4f794dece'),
    accessorybanner: img('1548036161-18b4f794dece', 1600, 500),
    description: 'Handbags, totes, sling bags, backpacks, and shoulder bags from India\'s top brands.',
    status: 'active',
  },
  {
    name: 'Apparel Accessories',
    thumbnail:      img('1624378439575-d8705ad7ae80'),
    accessorybanner: img('1608042314765-c7c27f4a1dfe', 1600, 500),
    description: 'Belts, scarves, caps, hair accessories and other essentials to complete your look.',
    status: 'active',
  },
  {
    name: 'Eyewear',
    thumbnail:      img('1572635148818-ef6fd45eb394'),
    accessorybanner: img('1511499767150-a7a1371514e5', 1600, 500),
    description: 'Sunglasses, blue light glasses and reading glasses from premium eyewear brands.',
    status: 'active',
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
// Returns product doc (no _id — let Mongo generate)
const makeProduct = (name, collection, selling, imageId, opts = {}) => ({
  productName:        name,
  shortDescription:   opts.short || `Premium quality ${name} — loved by thousands across India.`,
  detailedDescription: opts.detail || `Experience unmatched quality with ${name}. Crafted for the modern Indian consumer, this product combines style, comfort, and durability. Perfect for everyday use or special occasions.`,
  selectCollection:   [collection],
  selectColor:        opts.colors || [{ color: 'Default', code: '#888888' }],
  selectSize:         opts.sizes  || [],
  productSKU:         opts.sku    || slug(name).toUpperCase().slice(0, 12),
  url:                slug(name),
  colorImages: [{
    color:     opts.colors?.[0]?.color || 'Default',
    code:      opts.colors?.[0]?.code  || '#888888',
    thumbnail: img(imageId),
    additionalThumbnail: (opts.extra || []).map(id => img(id)),
    isDefault: true,
  }],
  status: 'active',
});

const PRODUCTS = [
  // ── Fashion ──────────────────────────────────────────────────────────────
  makeProduct('Biba Cotton Kurta Set', 'Fashion', 1499, '1583391733956-6c78276477e2', {
    short: 'Vibrant ethnic kurta set with palazzo — perfect for festive occasions.',
    colors: [{ color: 'Red', code: '#E63946' }, { color: 'Blue', code: '#1D3557' }],
    sizes: ['XS','S','M','L','XL','XXL'], sku: 'BIBA-KURTA-01',
  }),
  makeProduct('Manyavar Bandhgala Suit', 'Fashion', 5999, '1621072691003-e77703b92e94', {
    short: 'Classic Bandhgala suit for weddings and formal occasions.',
    colors: [{ color: 'Navy', code: '#001F3F' }, { color: 'Maroon', code: '#800000' }],
    sizes: ['S','M','L','XL','XXL'], sku: 'MANYAVAR-BG-01',
  }),
  makeProduct('Libas Anarkali Kurta', 'Fashion', 1299, '1610030469983-98e550d6193c', {
    short: 'Flowy anarkali kurta for a graceful ethnic look.',
    colors: [{ color: 'Green', code: '#2D6A4F' }, { color: 'Pink', code: '#FFB7C5' }],
    sizes: ['XS','S','M','L','XL'], sku: 'LIBAS-ANK-01',
  }),
  makeProduct('FabIndia Cotton Saree', 'Fashion', 2999, '1617137984306-028188f89612', {
    short: 'Handwoven cotton saree with traditional block print motifs.',
    colors: [{ color: 'Beige', code: '#F5F5DC' }, { color: 'Mustard', code: '#FFDB58' }],
    sizes: ['Free Size'], sku: 'FABINDIA-SAR-01',
  }),
  makeProduct('Van Heusen Formal Shirt', 'Fashion', 999, '1620012253295-c15cc3e65df4', {
    short: 'Slim-fit wrinkle-free formal shirt for office and events.',
    colors: [{ color: 'White', code: '#FFFFFF' }, { color: 'Light Blue', code: '#ADD8E6' }],
    sizes: ['38','40','42','44','46'], sku: 'VH-SHIRT-01',
  }),
  makeProduct('AND Denim Jacket', 'Fashion', 1799, '1551537482-f2075a1d41f2', {
    short: 'Classic denim jacket — the perfect layering piece for any outfit.',
    colors: [{ color: 'Blue', code: '#1560BD' }, { color: 'Black', code: '#000000' }],
    sizes: ['XS','S','M','L','XL'], sku: 'AND-DEN-01',
  }),

  // ── Beauty ────────────────────────────────────────────────────────────────
  makeProduct('Lakmé 9 to 5 Lipstick', 'Beauty', 649, '1631730486784-74757d38e27f', {
    short: 'Long-lasting matte lipstick with intense colour payoff.',
    colors: [{ color: 'Nude Twist', code: '#C4847A' }, { color: 'Red Rush', code: '#C0392B' }],
    sizes: ['3.6g'], sku: 'LAKME-LIP-01',
  }),
  makeProduct('Neutrogena Hydro Boost Moisturizer', 'Beauty', 999, '1556228578-8c89e6adf883', {
    short: 'Lightweight water-gel moisturizer with hyaluronic acid.',
    colors: [{ color: 'Default', code: '#F5F5F5' }],
    sizes: ['50ml'], sku: 'NEUTRO-MOIST-01',
  }),
  makeProduct('Maybelline Fit Me Foundation', 'Beauty', 549, '1522338140262-f46f5913618a', {
    short: 'Natural coverage foundation that matches your skin tone seamlessly.',
    colors: [{ color: 'Ivory', code: '#FFFFF0' }, { color: 'Sand', code: '#C2B280' }, { color: 'Honey', code: '#F9C74F' }],
    sizes: ['30ml'], sku: 'MAYBEL-FND-01',
  }),
  makeProduct('Forest Essentials Facial Serum', 'Beauty', 1750, '1620916566398-39f1143ab7be', {
    short: 'Ayurvedic brightening serum with saffron and turmeric extract.',
    colors: [{ color: 'Default', code: '#F5DEB3' }],
    sizes: ['15ml','30ml'], sku: 'FOREST-SER-01',
  }),
  makeProduct('Biotique Bio Honey Face Wash', 'Beauty', 119, '1608248543803-ba4f8c70ae0b', {
    short: 'Gentle nourishing face wash with pure honey and basil extract.',
    colors: [{ color: 'Default', code: '#FFF9C4' }],
    sizes: ['100ml','200ml'], sku: 'BIO-FW-01',
  }),
  makeProduct('Plum Body Love Light Lotion', 'Beauty', 449, '1601304791216-b6e9a1a0c25a', {
    short: 'Non-greasy body lotion with glycerine and vitamin E.',
    colors: [{ color: 'Default', code: '#FFF3E0' }],
    sizes: ['200ml','400ml'], sku: 'PLUM-BL-01',
  }),

  // ── Footwear ──────────────────────────────────────────────────────────────
  makeProduct('Nike Air Max 270', 'Footwear', 9995, '1542291026-7eec264c27ff', {
    short: 'Maximum cushioning meets bold street-ready style.',
    colors: [{ color: 'Black/White', code: '#000000' }, { color: 'University Red', code: '#CC0000' }],
    sizes: ['UK 6','UK 7','UK 8','UK 9','UK 10','UK 11'], sku: 'NIKE-AM270-01',
  }),
  makeProduct('Clarks Derby Formal Shoes', 'Footwear', 4999, '1614252235316-8c857d38b5f4', {
    short: 'Classic leather derby shoes for boardroom to boardwalk.',
    colors: [{ color: 'Tan', code: '#D2B48C' }, { color: 'Black', code: '#000000' }],
    sizes: ['UK 6','UK 7','UK 8','UK 9','UK 10'], sku: 'CLARKS-DB-01',
  }),
  makeProduct('Steve Madden Block Heels', 'Footwear', 3499, '1543163521-1bf539c55dd2', {
    short: 'Trendy block heels that balance comfort and elegance.',
    colors: [{ color: 'Nude', code: '#E3CBAA' }, { color: 'Black', code: '#000000' }],
    sizes: ['UK 3','UK 4','UK 5','UK 6','UK 7'], sku: 'SM-BH-01',
  }),
  makeProduct('Adidas Ultraboost 22', 'Footwear', 14999, '1608231387042-66d1773d3028', {
    short: 'Record-breaking energy return running shoe with Boost midsole.',
    colors: [{ color: 'Core Black', code: '#000000' }, { color: 'Cloud White', code: '#F5F5F5' }],
    sizes: ['UK 6','UK 7','UK 8','UK 9','UK 10','UK 11'], sku: 'ADIDAS-UB22-01',
  }),
  makeProduct('Puma RS-X3 Sneakers', 'Footwear', 6999, '1606107557195-0e29a4b5b4aa', {
    short: 'Retro-inspired chunky sneakers with bold RS design.',
    colors: [{ color: 'Puma White', code: '#FFFFFF' }, { color: 'Dark Shadow', code: '#4A4A4A' }],
    sizes: ['UK 6','UK 7','UK 8','UK 9','UK 10'], sku: 'PUMA-RSX-01',
  }),
  makeProduct('Liberty Ballet Flats', 'Footwear', 899, '1560343090-f0409e92791a', {
    short: 'Comfortable everyday ballet flats with cushioned insole.',
    colors: [{ color: 'Black', code: '#000000' }, { color: 'Beige', code: '#F5F5DC' }, { color: 'Navy', code: '#001F3F' }],
    sizes: ['UK 3','UK 4','UK 5','UK 6','UK 7','UK 8'], sku: 'LIB-BF-01',
  }),

  // ── Electronics ───────────────────────────────────────────────────────────
  makeProduct('Sony WH-1000XM5 Headphones', 'Electronics', 24990, '1505740420928-5e560c06d30e', {
    short: 'Industry-leading noise cancellation with 30-hour battery life.',
    colors: [{ color: 'Black', code: '#000000' }, { color: 'Platinum Silver', code: '#C0C0C0' }],
    sizes: ['One Size'], sku: 'SONY-WH5-01',
  }),
  makeProduct('JBL Charge 5 Bluetooth Speaker', 'Electronics', 13499, '1608043152269-423dbba4e7e1', {
    short: 'Portable waterproof speaker with 20 hours of playtime and USB charging.',
    colors: [{ color: 'Black', code: '#000000' }, { color: 'Blue', code: '#0047AB' }, { color: 'Red', code: '#E63946' }],
    sizes: ['One Size'], sku: 'JBL-CH5-01',
  }),
  makeProduct('Apple AirPods Pro 2nd Gen', 'Electronics', 24900, '1600294037681-c80b4cb5b434', {
    short: 'Adaptive Transparency, Personalized Spatial Audio with MagSafe Charging Case.',
    colors: [{ color: 'White', code: '#FFFFFF' }],
    sizes: ['One Size'], sku: 'APPLE-APP2-01',
  }),
  makeProduct('Samsung 55" QLED 4K TV', 'Electronics', 104990, '1593359677879-a4bb92f829d1', {
    short: '100% Colour Volume with Quantum Dot technology for stunning 4K picture.',
    colors: [{ color: 'Black', code: '#000000' }],
    sizes: ['55 inch'], sku: 'SAM-QLED55-01',
  }),
  makeProduct('Canon EOS R50 Mirrorless Camera', 'Electronics', 49999, '1516035069371-29a1b244cc32', {
    short: 'Compact mirrorless camera with 24.2MP sensor and 4K video.',
    colors: [{ color: 'Black', code: '#000000' }, { color: 'White', code: '#FFFFFF' }],
    sizes: ['Body Only'], sku: 'CANON-R50-01',
  }),
  makeProduct('Logitech MX Master 3S Mouse', 'Electronics', 8495, '1527864550417-7fd91fc51a46', {
    short: 'Advanced wireless mouse with MagSpeed scrolling and 8K DPI.',
    colors: [{ color: 'Graphite', code: '#383838' }, { color: 'Pale Grey', code: '#C8C8C8' }],
    sizes: ['One Size'], sku: 'LOG-MXM3S-01',
  }),

  // ── Laptops ───────────────────────────────────────────────────────────────
  makeProduct('Apple MacBook Air M3 15"', 'Laptops', 134900, '1517336714731-489689fd1ca8', {
    short: '15-inch MacBook Air with M3 chip — thin, light, and incredibly powerful.',
    colors: [{ color: 'Midnight', code: '#1C1C1E' }, { color: 'Starlight', code: '#E8E0D5' }],
    sizes: ['8GB/256GB','16GB/512GB'], sku: 'APPLE-MBA-M3-01',
  }),
  makeProduct('Dell XPS 15 Laptop', 'Laptops', 199990, '1593642632559-0c6d3fc62b89', {
    short: 'Ultra-thin InfinityEdge display laptop with Intel Core i9 and RTX 4060.',
    colors: [{ color: 'Platinum Silver', code: '#C0C0C0' }, { color: 'Graphite', code: '#383838' }],
    sizes: ['16GB/512GB','32GB/1TB'], sku: 'DELL-XPS15-01',
  }),
  makeProduct('HP Spectre x360 14"', 'Laptops', 159990, '1525547719571-a2d4ac8945e2', {
    short: '2-in-1 convertible laptop with OLED display and Intel Evo platform.',
    colors: [{ color: 'Nightfall Black', code: '#1C1C1C' }, { color: 'Poseidon Blue', code: '#1B3A6B' }],
    sizes: ['16GB/512GB','32GB/1TB'], sku: 'HP-SPEC-X360-01',
  }),
  makeProduct('Lenovo ThinkPad X1 Carbon Gen 11', 'Laptops', 184990, '1588702547919-26089e690ecc', {
    short: 'Business ultrabook with MIL-SPEC durability and Intel vPro.',
    colors: [{ color: 'Black', code: '#000000' }],
    sizes: ['16GB/512GB','32GB/1TB'], sku: 'LEN-X1C-G11-01',
  }),
  makeProduct('ASUS ROG Strix G16 Gaming Laptop', 'Laptops', 139990, '1593642634315-48f5414c3ad9', {
    short: 'AMD Ryzen 9 + RTX 4070 gaming laptop with 165Hz QHD display.',
    colors: [{ color: 'Eclipse Gray', code: '#3B3B3B' }],
    sizes: ['16GB/512GB','32GB/1TB'], sku: 'ASUS-ROG-G16-01',
  }),
  makeProduct('Acer Swift Edge 16 Laptop', 'Laptops', 89990, '1496181133206-80ce9b88a853', {
    short: 'Ultra-lightweight 16" OLED laptop with AMD Ryzen 7 processor.',
    colors: [{ color: 'Olivine Black', code: '#2E2E2E' }],
    sizes: ['16GB/512GB'], sku: 'ACER-SE16-01',
  }),

  // ── Mobiles ───────────────────────────────────────────────────────────────
  makeProduct('Samsung Galaxy S25 Ultra', 'Mobiles', 129999, '1610945415295-d9bbf067e59c', {
    short: 'Galaxy AI on the most powerful S series phone — with built-in S Pen.',
    colors: [{ color: 'Titanium Black', code: '#1C1C1C' }, { color: 'Titanium Silver', code: '#C0C0C0' }],
    sizes: ['12GB/256GB','12GB/512GB','12GB/1TB'], sku: 'SAM-S25U-01',
  }),
  makeProduct('Apple iPhone 16 Pro', 'Mobiles', 134900, '1511707171634-5f897ff02aa9', {
    short: 'A18 Pro chip, Camera Control, ProRes video — in titanium design.',
    colors: [{ color: 'Black Titanium', code: '#3B3B3B' }, { color: 'White Titanium', code: '#F2F0EB' }],
    sizes: ['128GB','256GB','512GB','1TB'], sku: 'APPLE-IP16P-01',
  }),
  makeProduct('OnePlus 13 5G', 'Mobiles', 69999, '1592899677977-9c10ca588bbd', {
    short: 'Snapdragon 8 Elite with Hasselblad camera and 100W SUPERVOOC charging.',
    colors: [{ color: 'Black Eclipse', code: '#1A1A2E' }, { color: 'Arctic Dawn', code: '#E0E5EC' }],
    sizes: ['12GB/256GB','16GB/512GB'], sku: 'OP-13-01',
  }),
  makeProduct('Google Pixel 9 Pro', 'Mobiles', 109999, '1598327105666-5b89351aff97', {
    short: 'Google\'s most advanced AI camera phone with Gemini built in.',
    colors: [{ color: 'Obsidian', code: '#1C1C1C' }, { color: 'Porcelain', code: '#F5F0EB' }],
    sizes: ['12GB/128GB','16GB/256GB','16GB/512GB'], sku: 'GOOG-P9P-01',
  }),
  makeProduct('Vivo V40 Pro 5G', 'Mobiles', 49999, '1580910051074-3eb694886505', {
    short: 'ZEISS co-engineered camera system with AI portrait capabilities.',
    colors: [{ color: 'Titanium Gray', code: '#808080' }, { color: 'Lotus Purple', code: '#7B5EA7' }],
    sizes: ['8GB/256GB','12GB/256GB'], sku: 'VIVO-V40P-01',
  }),
  makeProduct('Nothing Phone 2a Plus', 'Mobiles', 29999, '1574920162043-b872873f19bc', {
    short: 'Iconic Glyph Interface with Dimensity 7350 Pro and 50MP dual camera.',
    colors: [{ color: 'Black', code: '#000000' }, { color: 'White', code: '#FFFFFF' }],
    sizes: ['8GB/128GB','12GB/256GB'], sku: 'NOTH-2AP-01',
  }),

  // ── Books ─────────────────────────────────────────────────────────────────
  makeProduct('Atomic Habits — James Clear', 'Books', 398, '1544947950-fa07a98d237f', {
    short: 'An easy and proven way to build good habits and break bad ones.',
    colors: [{ color: 'Default', code: '#F5F5F5' }],
    sizes: ['Paperback','Hardcover'], sku: 'BOOK-AH-01',
  }),
  makeProduct('The Psychology of Money — Morgan Housel', 'Books', 350, '1554284126-aa88f22d8b74', {
    short: 'Timeless lessons on wealth, greed, and happiness.',
    colors: [{ color: 'Default', code: '#F5F5F5' }],
    sizes: ['Paperback','Hardcover'], sku: 'BOOK-POM-01',
  }),
  makeProduct('Rich Dad Poor Dad — Robert Kiyosaki', 'Books', 295, '1589998059171-988d887df646', {
    short: 'What the rich teach their kids about money that the poor do not.',
    colors: [{ color: 'Default', code: '#F5F5F5' }],
    sizes: ['Paperback'], sku: 'BOOK-RDPD-01',
  }),
  makeProduct('The Alchemist — Paulo Coelho', 'Books', 195, '1512820790803-83ca734da794', {
    short: 'A magical story about following your dreams — #1 international bestseller.',
    colors: [{ color: 'Default', code: '#F5F5F5' }],
    sizes: ['Paperback','Hardcover'], sku: 'BOOK-ALC-01',
  }),
  makeProduct('Sapiens — Yuval Noah Harari', 'Books', 499, '1513475382585-d06e58bcb0e0', {
    short: 'A brief history of humankind from Stone Age to Silicon Age.',
    colors: [{ color: 'Default', code: '#F5F5F5' }],
    sizes: ['Paperback','Hardcover'], sku: 'BOOK-SAP-01',
  }),
  makeProduct('The 48 Laws of Power — Robert Greene', 'Books', 399, '1541963463532-d68292c34b19', {
    short: 'Distilled wisdom of 3,000 years of power history in 48 laws.',
    colors: [{ color: 'Default', code: '#F5F5F5' }],
    sizes: ['Paperback','Hardcover'], sku: 'BOOK-48L-01',
  }),
];

// ─── Accessories ──────────────────────────────────────────────────────────────
const makeAcc = (name, type, selling, imageId, opts = {}) => ({
  accessoryName: name,
  shortDescription:    opts.short || `Premium ${name} — a must-have style essential.`,
  detailedDescription: opts.detail || `Elevate your look with the ${name}. Crafted with quality materials, this piece blends fashion and function for the modern Indian lifestyle.`,
  selectAccessoryType: [type],
  selectColor: opts.colors || [{ color: 'Default', code: '#888888' }],
  selectSize:  opts.sizes  || [],
  url:   slug(name),
  colorImages: [{
    color:              opts.colors?.[0]?.color || 'Default',
    code:               opts.colors?.[0]?.code  || '#888888',
    accessoryThumbnail: img(imageId),
    additionalThumbnail: (opts.extra || []).map(id => img(id)),
    isDefault: true,
  }],
  status: 'active',
});

const ACCESSORIES = [

  // ── 💍 JEWELLERY ──────────────────────────────────────────────────────────
  makeAcc('Tanishq Gold Hoop Earrings', 'Jewellery', 4500, '1535632787350-4e68ef0ac584', {
    short: '22KT gold hoop earrings with a classic round design — timeless everyday wear.',
    detail: 'Crafted in 22KT hallmarked gold, these hoop earrings from Tanishq offer a lightweight yet luxurious feel. The smooth polished finish gives them a premium look perfect for casual outings, festive occasions, and gifting. Each pair comes in a signature Tanishq box. Certified BIS hallmarked for purity assurance.',
    colors: [{ color: 'Yellow Gold', code: '#FFD700' }],
    extra: ['1515562141207-7a88fb7ce338', '1510797215324-721d6e6ebe89'],
  }),
  makeAcc('Malabar Silver Chain Necklace', 'Jewellery', 3200, '1515562141207-7a88fb7ce338', {
    short: 'Elegant 925 sterling silver chain necklace — perfect for layering or solo styling.',
    detail: 'This 925 sterling silver link chain necklace from Malabar Gold is a versatile everyday accessory. Features a lobster-claw clasp for secure wear. The slim interlocking links catch light beautifully. Comes in an 18-inch length and is nickel-free and hypoallergenic, making it ideal for sensitive skin.',
    colors: [{ color: 'Silver', code: '#C0C0C0' }],
    extra: ['1535632787350-4e68ef0ac584', '1510797215324-721d6e6ebe89'],
  }),
  makeAcc('CaratLane Pearl Bracelet', 'Jewellery', 2800, '1510797215324-721d6e6ebe89', {
    short: 'Delicate pearl and gold bracelet — the perfect bridal or gifting accessory.',
    detail: 'A beautifully crafted pearl bracelet from CaratLane featuring lustrous freshwater pearls set in 18KT yellow gold. The bracelet has a secure push-clasp mechanism for safe wear. Designed for women who love understated elegance. Suitable for bridal wear, anniversaries, or as a premium gift. BIS hallmarked.',
    colors: [{ color: 'White/Gold', code: '#F8F0E3' }],
    extra: ['1515562141207-7a88fb7ce338', '1535632787350-4e68ef0ac584'],
  }),
  makeAcc('BlueStone Solitaire Diamond Ring', 'Jewellery', 12500, '1510797215324-721d6e6ebe89', {
    short: 'Classic solitaire diamond ring in 18KT white gold — a symbol of love and luxury.',
    detail: 'This solitaire diamond ring from BlueStone features a 0.15-carat certified round brilliant-cut diamond set in 18KT white gold. The four-prong setti maximises brilliance and fire. Comes with a GIA-certified diamond grading report. Perfect for engagements, anniversaries, or as a milestone gift. Available in ring sizes 6 to 22 (Indian sizing).',
    colors: [{ color: 'White Gold', code: '#E8E8E8' }],
    extra: ['1510797215324-721d6e6ebe89', '1515562141207-7a88fb7ce338'],
  }),
  makeAcc('Pipa Bella Gold Pendant Necklace', 'Jewellery', 1299, '1599643477877-530eb83abc8e', {
    short: 'Dainty gold-plated pendant necklace with a delicate chain — everyday minimalist jewellery.',
    detail: 'A charming minimalist pendant necklace from Pipa Bella, plated in 18KT gold. Features an adjustable chain (16–18 inches) with a lobster clasp. The pendant is lightweight, tarnish-resistant, and nickel-free. Perfect for layering with other necklaces or wearing solo for a subtle, chic look. Gift-boxed.',
    colors: [{ color: 'Gold', code: '#FFD700' }, { color: 'Rose Gold', code: '#B76E79' }],
    extra: ['1535632787350-4e68ef0ac584', '1510797215324-721d6e6ebe89'],
  }),

  // ── 👜 BAGS ───────────────────────────────────────────────────────────────
  makeAcc('Hidesign Cognac Leather Handbag', 'Bags', 4999, '1548036161-18b4f794dece', {
    short: 'Premium full-grain vegetable-tanned leather handbag with spacious twin compartments.',
    detail: 'Crafted from 100% genuine vegetable-tanned leather, this Hidesign handbag ages beautifully with use — developing a unique patina over time. Features twin main compartments, an inner zipped pocket, and a detachable shoulder strap. Solid brass hardware. Hand-stitched edges. A statement piece for the modern Indian woman.',
    colors: [{ color: 'Cognac', code: '#9A4B2D' }, { color: 'Black', code: '#000000' }],
    extra: ['1525966222134-fcec03ece2cf', '1566150905458-1bf1dad5501e'],
  }),
  makeAcc('Baggit Canvas Tote Bag', 'Bags', 1299, '1590874103328-eac038rc4e78', {
    short: 'Roomy canvas tote bag with zipper closure — your go-to daily carry bag.',
    detail: 'This Baggit tote bag is made from durable water-resistant canvas with a cotton lining. It features a top-zip closure for security, an inner organizer pocket, and comfortable cotton handles. Large enough to carry a 14-inch laptop, documents, and daily essentials. A sustainable alternative to plastic bags — eco-friendly and stylish.',
    colors: [{ color: 'Olive', code: '#808000' }, { color: 'Beige', code: '#F5F5DC' }, { color: 'Black', code: '#000000' }],
    extra: ['1548036161-18b4f794dece', '1553062407-98eeb64c6a62'],
  }),
  makeAcc('Caprese Structured Sling Bag', 'Bags', 2499, '1525966222134-fcec03ece2cf', {
    short: 'Chic structured sling bag in faux leather — compact, stylish, and versatile.',
    detail: 'The Caprese structured sling bag is crafted from premium faux leather with a clean silhouette that transitions effortlessly from day to evening. Features an adjustable crossbody strap, a secure magnetic snap closure, and organised inner pockets for your phone, cards, and keys. Available in rich seasonal colours.',
    colors: [{ color: 'Maroon', code: '#800000' }, { color: 'Navy', code: '#001F3F' }, { color: 'Blush', code: '#FFB7C5' }],
    extra: ['1548036161-18b4f794dece', '1566150905458-1bf1dad5501e'],
  }),
  makeAcc('Wildcraft 30L Laptop Backpack', 'Bags', 2499, '1553062407-98eeb64c6a62', {
    short: '30-litre laptop backpack with dedicated 15.6" laptop sleeve and rain cover.',
    detail: 'The Wildcraft 30L backpack is designed for daily commuters and weekend travellers alike. It features a padded laptop sleeve that fits up to a 15.6-inch laptop, a spacious main compartment, quick-access front pockets, and a sternum strap for load distribution. The back panel features mesh padding for breathability. Includes a packable rain cover. Made from 900D polyester with PU coating for water resistance.',
    colors: [{ color: 'Black', code: '#000000' }, { color: 'Blue', code: '#0047AB' }, { color: 'Olive', code: '#808000' }],
    extra: ['1548036161-18b4f794dece', '1590874103328-eac038rc4e78'],
  }),
  makeAcc('Lavie Quilted Shoulder Bag', 'Bags', 1799, '1566150905458-1bf1dad5501e', {
    short: 'Trendy quilted pattern shoulder bag with gold-tone chain strap — party-ready style.',
    detail: 'The Lavie quilted shoulder bag features a classic diamond quilt pattern with gold-tone chain shoulder strap and top handle. Made from faux leather with a satin lining, magnetic snap closure, and inner zip pocket. Compact yet functional — fits your phone, wallet, keys, and makeup. Available in versatile solid colours suitable for both casual outings and evening events.',
    colors: [{ color: 'Black', code: '#000000' }, { color: 'Gold', code: '#FFD700' }, { color: 'Wine', code: '#722F37' }],
    extra: ['1548036161-18b4f794dece', '1525966222134-fcec03ece2cf'],
  }),

  // ── 👗 APPAREL ACCESSORIES ────────────────────────────────────────────────
  makeAcc('Da Milano Genuine Leather Belt', 'Apparel Accessories', 1799, '1624378439575-d8705ad7ae80', {
    short: 'Full-grain genuine leather belt with brushed-silver pin buckle — boardroom to weekend.',
    detail: 'Crafted from premium full-grain cowhide leather, this Da Milano belt develops a rich patina with use. The brushed-silver pin buckle has a sturdy construction and the belt has evenly spaced holes for a comfortable fit. Includes stitched edges for durability. Available in waist sizes 28–40. A wardrobe staple that pairs perfectly with both formal trousers and casual denim.',
    colors: [{ color: 'Black', code: '#000000' }, { color: 'Tan Brown', code: '#D2B48C' }],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    extra: ['1608042314765-c7c27f4a1dfe'],
  }),
  makeAcc('FabIndia Pure Silk Scarf', 'Apparel Accessories', 1499, '1608042314765-c7c27f4a1dfe', {
    short: 'Handcrafted pure silk scarf with traditional Indian block-print motifs — elegant and lightweight.',
    detail: 'Woven from 100% pure silk, this FabIndia scarf features intricate block-print patterns inspired by traditional Indian art. The smooth, lightweight fabric drapes beautifully and can be worn as a neck scarf, head wrap, or bag accessory. Machine-wash cold on delicate cycle. Size: 70 × 180 cm. A perfect blend of heritage craft and contemporary style.',
    colors: [{ color: 'Indigo Blue', code: '#4B0082' }, { color: 'Rust Orange', code: '#B7410E' }, { color: 'Forest Green', code: '#228B22' }],
    extra: ['1624378439575-d8705ad7ae80'],
  }),
  makeAcc('Levi\'s Classic Baseball Cap', 'Apparel Accessories', 899, '1521369909029-2afed882baee', {
    short: 'Iconic Levi\'s red-tab baseball cap in 100% cotton twill — the everyday essential.',
    detail: 'The Levi\'s classic baseball cap is made from 100% cotton twill with a pre-curved 6-panel structured design. Features an embroidered Levi\'s logo patch on the front, a sweatband lining for comfort, and an adjustable strap at the back for a universal fit. Lightweight and breathable — ideal for commutes, workouts, or weekend outings.',
    colors: [{ color: 'Navy Blue', code: '#001F3F' }, { color: 'Black', code: '#000000' }, { color: 'Khaki', code: '#C3B091' }],
    extra: ['1608042314765-c7c27f4a1dfe'],
  }),
  makeAcc('Kitsch Satin Scrunchie Set', 'Apparel Accessories', 599, '1522764861347-9ebe3e3f2ab4', {
    short: 'Set of 5 satin scrunchies in pastel shades — gentle on hair, no creases or breakage.',
    detail: 'The Kitsch Satin Scrunchie Set includes 5 large scrunchies made from premium smooth satin fabric. Satin is proven to cause less friction than cotton, reducing hair breakage and preserving blowouts and natural curls. Gentle elastic core, over-sized design. Suitable for all hair types. A chic, practical accessory for everyday wear, gym sessions, and overnight use.',
    colors: [{ color: 'Pastel Mix', code: '#FFB7C5' }, { color: 'Neutral Set', code: '#C3B091' }],
    extra: ['1535632787350-4e68ef0ac584'],
  }),

  // ── 🕶️ EYEWEAR ────────────────────────────────────────────────────────────
  makeAcc('Ray-Ban Classic Aviator Sunglasses', 'Eyewear', 6990, '1572635148818-ef6fd45eb394', {
    short: 'Iconic Ray-Ban Aviator with gold metal frame and classic G-15 green lenses — UV400 protected.',
    detail: 'The Ray-Ban Aviator is the original American aviator sunglass, first designed for US military pilots in 1936. Features a slim gold-tone metal frame, classic teardrop shape, and G-15 dark green lenses that absorb 85% of light while transmitting natural colour perception. 100% UV400 protection. Nose pads for adjustable comfort. Includes Ray-Ban case, cleaning cloth, and authenticity certificate.',
    colors: [{ color: 'Gold/Green', code: '#FFD700' }, { color: 'Silver/Blue', code: '#C0C0C0' }],
    extra: ['1511499767150-a7a1371514e5'],
  }),
  makeAcc('Fastrack Round UV400 Sunglasses', 'Eyewear', 1299, '1511499767150-a7a1371514e5', {
    short: 'Retro round-frame sunglasses with full UV400 protection — casual cool for everyday wear.',
    detail: 'Fastrack\'s round-frame sunglasses are crafted with a lightweight TR90 frame for durability and comfort. The lenses provide 100% UV400 protection, blocking both UVA and UVB rays. Anti-scratch coating on lenses. Flexible spring hinges for a secure fit on all face shapes. Polycarbonate lenses are impact-resistant. Comes with a hard case and cleaning cloth.',
    colors: [{ color: 'Matte Black', code: '#28282B' }, { color: 'Tortoise', code: '#8B4513' }],
    extra: ['1572635148818-ef6fd45eb394'],
  }),
  makeAcc('Titan Cat Eye Sunglasses', 'Eyewear', 1999, '1572635148818-ef6fd45eb394', {
    short: 'Glamorous cat-eye frame sunglasses with gradient lenses — bold, feminine, and UV protected.',
    detail: 'The Titan cat-eye sunglasses feature an upswept frame that flatters oval, square, and heart-shaped faces. Gradient brown-to-clear polycarbonate lenses offer UV400 protection while creating a stylish tinted effect. Lightweight acetate frame with integrated nose pads. Spring-loaded hinges for easy wear. Suitable for both fashion styling and outdoor UV protection.',
    colors: [{ color: 'Black/Gradient', code: '#1C1C1C' }, { color: 'Tortoise/Brown', code: '#8B4513' }],
    extra: ['1572635148818-ef6fd45eb394', '1511499767150-a7a1371514e5'],
  }),
  makeAcc('Lenskart Blue Light Blocking Glasses', 'Eyewear', 2999, '1511499767150-a7a1371514e5', {
    short: 'Anti-blue light glasses with clear lenses — protect eyes from screen glare and digital eye strain.',
    detail: 'Lenskart\'s blue light blocking glasses feature a thin acetate frame with zero-power clear lenses that filter 40% of harmful high-energy blue light emitted by phones, laptops, and monitors. Reduces digital eye strain, headaches, and improves sleep quality. Lightweight at just 18g. Suitable for men and women. Anti-reflective and scratch-resistant coating. Comes with a hard case and cleaning cloth.',
    colors: [{ color: 'Clear/Black', code: '#000000' }, { color: 'Clear/Tortoise', code: '#8B4513' }],
    extra: ['1572635148818-ef6fd45eb394', '1511499767150-a7a1371514e5'],
  }),
];

// ─── Banners ──────────────────────────────────────────────────────────────────
const BANNERS = [
  {
    columnName:  'Fashion Sale',
    thumbnail:   img('1490481651871-ab68de25d43d', 1600, 600),
    Heading:     'Ethnic Elegance Awaits',
    description: 'Up to 60% off on kurtas, sarees, and designer suits from Biba, Manyavar, FabIndia & more.',
    buttonName:  'Shop Fashion',
    buttonLink:  '/collections',
    status:      'active',
  },
  {
    columnName:  'Electronics Festival',
    thumbnail:   img('1518770660439-4636190af475', 1600, 600),
    Heading:     'Tech Mela — Massive Savings!',
    description: 'Best deals on headphones, speakers, cameras, and smart TVs. Starting from ₹599.',
    buttonName:  'Explore Electronics',
    buttonLink:  '/collections',
    status:      'active',
  },
  {
    columnName:  'Beauty Collection',
    thumbnail:   img('1522338140262-f46f5913618a', 1600, 600),
    Heading:     'Glow Up This Season',
    description: 'Premium skincare, makeup, and haircare from Lakmé, Neutrogena, Forest Essentials & more.',
    buttonName:  'Shop Beauty',
    buttonLink:  '/collections',
    status:      'active',
  },
  {
    columnName:  'Laptop Deals',
    thumbnail:   img('1496181133206-80ce9b88a853', 1600, 600),
    Heading:     'Power Your Productivity',
    description: 'MacBook, Dell XPS, HP Spectre — the best laptops at unbeatable prices.',
    buttonName:  'Shop Laptops',
    buttonLink:  '/collections',
    status:      'active',
  },
  {
    columnName:  'Mobile Offers',
    thumbnail:   img('1598327105666-5b89351aff97', 1600, 600),
    Heading:     'New Phones. Big Savings.',
    description: 'iPhone 16 Pro, Galaxy S25 Ultra, OnePlus 13 — latest flagships at exclusive prices.',
    buttonName:  'Shop Mobiles',
    buttonLink:  '/collections',
    status:      'active',
  },
  {
    columnName:  'Accessories Sale',
    thumbnail:   img('1492707892479-7bc8d5a4ee93', 1600, 600),
    Heading:     'Accessorise in Style',
    description: 'Handbags, watches, jewellery, and more — up to 50% off on premium accessories.',
    buttonName:  'Shop Accessories',
    buttonLink:  '/accessories',
    status:      'active',
  },
  {
    columnName:  'Books Collection',
    thumbnail:   img('1524995997946-a1c2e315a42f', 1600, 600),
    Heading:     'Feed Your Curiosity',
    description: 'Bestselling books on finance, self-help, fiction, and more — starting at ₹195.',
    buttonName:  'Shop Books',
    buttonLink:  '/collections',
    status:      'active',
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────
const EVENTS = [
  // ── Past Events (dates before 2026-07-03) ────────────────────────────────
  {
    title:       'Republic Day Mega Sale',
    thumbnail:   img('1611347343388-d3b33e3ef8d0', 1200, 600),
    description: 'Celebrating 77 years of India! Flat 26% off sitewide — one day only. Over 1 lakh orders placed in 6 hours. Thank you, India!',
    date:        '2026-01-26',
    location:    'Online — AuraMart.in',
    url:         'republic-day-sale-2026',
    status:      'active',
  },
  {
    title:       'Valentine\'s Day Style Edit',
    thumbnail:   img('1518199452218-47a65de5a5b3', 1200, 600),
    description: 'Gift something they\'ll love! Curated Valentine\'s picks across fashion, jewellery, beauty, and electronics. Gift wrapping available on all orders.',
    date:        '2026-02-14',
    location:    'Online — AuraMart.in',
    url:         'valentines-style-edit-2026',
    status:      'active',
  },
  {
    title:       'Holi Colour Festival Sale',
    thumbnail:   img('1506905925346-21bda4d32df4', 1200, 600),
    description: 'Celebrate Holi with vibrant fashion! Up to 55% off on ethnic wear, beauty, and home. Free colour kits with orders above ₹999.',
    date:        '2026-03-25',
    location:    'Online — AuraMart.in',
    url:         'holi-sale-2026',
    status:      'active',
  },
  // ── Upcoming Events ────────────────────────────────────────────────────────
  {
    title:       'AuraMart Summer Sale 2026',
    thumbnail:   img('1483985988355-763728e1935b', 1200, 600),
    description: 'The biggest sale of the year! Flat 40–70% off across all categories — fashion, electronics, books, beauty, and more. Limited time, limited stock.',
    date:        '2026-07-15',
    location:    'Online — AuraMart.in',
    url:         'summer-sale-2026',
    status:      'active',
  },
  {
    title:       'Electronics Fest — Mega Tech Carnival',
    thumbnail:   img('1518770660439-4636190af475', 1200, 600),
    description: 'Exchange offers, zero-cost EMI, and no-cost upgrades on all electronics. Laptops, mobiles, headphones, cameras — grab the best tech deals.',
    date:        '2026-07-20',
    location:    'Online — AuraMart.in',
    url:         'electronics-fest-2026',
    status:      'active',
  },
  {
    title:       'Fashion Week Extravaganza',
    thumbnail:   img('1490481651871-ab68de25d43d', 1200, 600),
    description: 'Celebrate Indian fashion with curated collections from top brands. New arrivals daily. Ethnic, western, and fusion — all under one roof.',
    date:        '2026-08-01',
    location:    'Online — AuraMart.in',
    url:         'fashion-week-2026',
    status:      'active',
  },
  {
    title:       'Beauty Carnival — Glow & Shine',
    thumbnail:   img('1596462502278-27bfdc403347', 1200, 600),
    description: 'Free samples with every beauty order, exclusive gift sets, and up to 60% off on skincare and makeup. Pamper yourself this season.',
    date:        '2026-08-10',
    location:    'Online — AuraMart.in',
    url:         'beauty-carnival-2026',
    status:      'active',
  },
  {
    title:       'Back to Campus Sale',
    thumbnail:   img('1553062407-98eeb64c6a62', 1200, 600),
    description: 'Everything a student needs — laptops, backpacks, books, headphones, and stationery at student-friendly prices. Don\'t miss out!',
    date:        '2026-08-20',
    location:    'Online — AuraMart.in',
    url:         'back-to-campus-2026',
    status:      'active',
  },
  {
    title:       'Festive Season Grand Sale',
    thumbnail:   img('1524995997946-a1c2e315a42f', 1200, 600),
    description: 'Celebrate Navratri, Diwali, and Bhai Dooj with special festive offers. Gifts, decor, fashion, and more at celebratory prices.',
    date:        '2026-10-01',
    location:    'Online — AuraMart.in',
    url:         'festive-sale-2026',
    status:      'active',
  },
];

// ─── Stockists ────────────────────────────────────────────────────────────────
const STOCKISTS = [
  { name: 'AuraMart Delhi Flagship', email: 'delhi@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart Delhi', country: 'India', Address: 'Shop 12, Select City Walk Mall, Saket', city: 'New Delhi', status: 'active' },
  { name: 'AuraMart Connaught Place', email: 'cp@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart CP', country: 'India', Address: 'N-Block, Connaught Place, Central Delhi', city: 'New Delhi', status: 'active' },
  { name: 'AuraMart Mumbai BKC', email: 'mumbai@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart BKC', country: 'India', Address: 'Unit 204, Maker Maxity, Bandra Kurla Complex', city: 'Mumbai', status: 'active' },
  { name: 'AuraMart Powai', email: 'powai@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart Powai', country: 'India', Address: 'Shop 8, Galleria Mall, Hiranandani Gardens, Powai', city: 'Mumbai', status: 'active' },
  { name: 'AuraMart Bangalore Indiranagar', email: 'blr@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart Indiranagar', country: 'India', Address: '12th Main Road, HAL 2nd Stage, Indiranagar', city: 'Bangalore', status: 'active' },
  { name: 'AuraMart Koramangala', email: 'koramangala@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart Koramangala', country: 'India', Address: '80 Feet Road, 4th Block, Koramangala', city: 'Bangalore', status: 'active' },
  { name: 'AuraMart Hyderabad Jubilee Hills', email: 'hyd@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart Jubilee Hills', country: 'India', Address: 'Road No. 36, Jubilee Hills', city: 'Hyderabad', status: 'active' },
  { name: 'AuraMart Pune Koregaon Park', email: 'pune@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart Koregaon Park', country: 'India', Address: 'Lane 7, Koregaon Park, North Main Road', city: 'Pune', status: 'active' },
  { name: 'AuraMart Jaipur Pink City', email: 'jaipur@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart Pink City', country: 'India', Address: 'Shop 22, World Trade Park, JLN Marg', city: 'Jaipur', status: 'active' },
  { name: 'AuraMart Ahmedabad SG Road', email: 'ahmedabad@auramart.in', website: 'https://auramart.in', shopName: 'AuraMart Ahmedabad', country: 'India', Address: 'Ground Floor, Alpha One Mall, Vastrapur', city: 'Ahmedabad', status: 'active' },
];

// ─── Main Seeder ──────────────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found in .env');

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.\n');

  // ── 1. Clear existing data ─────────────────────────────────────────────────
  console.log('Clearing existing data...');
  await Promise.all([
    collectionModel.deleteMany({}),
    accessoryTypeModel.deleteMany({}),
    productModel.deleteMany({}),
    accessoryModel.deleteMany({}),
    priceModel.deleteMany({}),
    bannerModel.deleteMany({}),
    eventModel.deleteMany({}),
    stockKistModel.deleteMany({}),
  ]);
  console.log('Cleared: Collections, AccessoryTypes, Products, Accessories, Prices, Banners, Events, Stockists.\n');

  // ── 2. Seed Collections ────────────────────────────────────────────────────
  console.log('Seeding 8 Collections...');
  const collections = await collectionModel.insertMany(COLLECTIONS);
  console.log(`  Created ${collections.length} collections.\n`);

  // ── 3. Seed AccessoryTypes ─────────────────────────────────────────────────
  console.log('Seeding 4 Accessory Types (Jewellery, Bags, Apparel Accessories, Eyewear)...');
  const accTypes = await accessoryTypeModel.insertMany(ACCESSORY_TYPES);
  console.log(`  Created ${accTypes.length} accessory types.\n`);

  // ── 4. Seed Products + Prices ──────────────────────────────────────────────
  console.log(`Seeding ${PRODUCTS.length} Products...`);
  const products = await productModel.insertMany(PRODUCTS);

  const productPriceDocs = products.map((p, i) => {
    // Map product index to selling price from original data
    const sellingPrices = [
      1499, 5999, 1299, 2999, 999, 1799,   // Fashion
      649, 999, 549, 1750, 119, 449,         // Beauty
      9995, 4999, 3499, 14999, 6999, 899,    // Footwear
      24990, 13499, 24900, 104990, 49999, 8495, // Electronics
      134900, 199990, 159990, 184990, 139990, 89990, // Laptops
      129999, 134900, 69999, 109999, 49999, 29999,   // Mobiles
      398, 350, 295, 195, 499, 399,           // Books
    ];
    return price(p._id, null, sellingPrices[i] || 999);
  });
  const productPrices = await priceModel.insertMany(productPriceDocs);
  console.log(`  Created ${products.length} products + ${productPrices.length} price docs.\n`);

  // ── 5. Seed Accessories + Prices ───────────────────────────────────────────
  console.log(`Seeding ${ACCESSORIES.length} Accessories...`);
  const accessories = await accessoryModel.insertMany(ACCESSORIES);

  const accSellingPrices = [
    // Jewellery (5)
    4500, 3200, 2800, 12500, 1299,
    // Bags (5)
    4999, 1299, 2499, 2499, 1799,
    // Apparel Accessories (4)
    1799, 1499, 899, 599,
    // Eyewear (4)
    6990, 1299, 1999, 2999,
  ];

  const accPriceDocs = accessories.map((a, i) =>
    price(null, a._id, accSellingPrices[i] || 499)
  );
  const accPrices = await priceModel.insertMany(accPriceDocs);
  console.log(`  Created ${accessories.length} accessories + ${accPrices.length} price docs.\n`);

  // ── 6. Seed Banners ────────────────────────────────────────────────────────
  console.log('Seeding 7 Banners...');
  const banners = await bannerModel.insertMany(BANNERS);
  console.log(`  Created ${banners.length} banners.\n`);

  // ── 7. Seed Events ─────────────────────────────────────────────────────────
  console.log('Seeding 9 Events (3 past + 6 upcoming)...');
  const events = await eventModel.insertMany(EVENTS);
  console.log(`  Created ${events.length} events.\n`);

  // ── 8. Seed Stockists ──────────────────────────────────────────────────────
  console.log('Seeding 10 Indian Stockists...');
  const stockists = await stockKistModel.insertMany(STOCKISTS);
  console.log(`  Created ${stockists.length} stockists.\n`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════');
  console.log('  DATABASE SEEDED SUCCESSFULLY!');
  console.log('═══════════════════════════════════════════');
  console.log(`  Collections:    ${collections.length}`);
  console.log(`  Accessory Types:${accTypes.length}`);
  console.log(`  Products:       ${products.length} (+ ${productPrices.length} prices)`);
  console.log(`  Accessories:    ${accessories.length} (+ ${accPrices.length} prices)`);
  console.log(`  Banners:        ${banners.length}`);
  console.log(`  Events:         ${events.length}`);
  console.log(`  Stockists:      ${stockists.length}`);
  console.log('═══════════════════════════════════════════\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeder failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
