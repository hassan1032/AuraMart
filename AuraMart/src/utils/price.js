/** Format a number as Indian Rupee — e.g. ₹1,25,999 */
export const formatINR = (value) => {
  const num = parseFloat(String(value).replace(/[₹£$,]/g, "")) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

/** Extract numeric price from any string/number */
export const parsePrice = (price) =>
  parseFloat(String(price).replace(/[₹£$,]/g, "")) || 0;

/** Get formatted price from a normalized product */
export const productPrice = (product) => {
  const raw =
    product?.price ??
    product?.priceInfo?.sellingPrice ??
    product?.priceInfo?.mrp ??
    product?.sellingPrice ??
    product?.mrp ??
    0;
  return formatINR(raw);
};

/** Normalize a raw DB product into the consistent shape the UI expects */
export const normalizeProduct = (p) => {
  if (!p) return p;

  // Colors from selectColor [{color, code}] or colorImages [{color, code, thumbnail}]
  const colorCodes = (p.selectColor || p.colorImages || [])
    .map(c => c.code || c.color).filter(Boolean);

  // Sizes — DB stores as plain strings or {sizeName}
  const sizeNames = (p.selectSize || []).map(s => s.sizeName || s).filter(Boolean);

  // Images: pick default colorImage first, then fall back
  const defaultColorImg =
    p.colorImages?.find(c => c.isDefault) || p.colorImages?.[0];
  const mainThumb =
    defaultColorImg?.thumbnail || p.thumbnail || p.image || p.images?.[0] || "";
  const extraThumbs = defaultColorImg?.additionalThumbnail?.filter(Boolean) || [];
  const gallery =
    p.gallery || p.images || [mainThumb, ...extraThumbs].filter(Boolean);

  // Extract India selling price from prices array (country: 'IND')
  const indiaPrice = (p.prices || []).find(x => x.country === 'IND');
  // priceInfo is a single price object returned by the product-list API
  // (getFiltered removes the prices[] array and keeps only priceInfo)
  const priceDoc   = indiaPrice || (p.prices || [])[0] || p.priceInfo;
  const sellingPrice =
    priceDoc?.sellingPrice ??
    p.price ??
    p.priceInfo?.sellingPrice ??
    p.sellingPrice ??
    p.mrp ??
    0;

  return {
    ...p,
    title:       p.title || p.name || p.productName || "",
    name:        p.name  || p.title || p.productName || "",
    description: p.description || p.shortDescription || p.detailedDescription || "",
    image:      mainThumb,
    mainImage:  mainThumb,
    gallery,
    images:     gallery,
    colors:     p.colors || p.colorOptions || colorCodes,
    sizes:      p.sizes  || p.sizeOptions  || sizeNames,
    price:      sellingPrice,
    // priceId unified — works whether API returns prices[] or priceInfo
    priceId:    p.priceId || priceDoc?._id,
    category:
      p.category ||
      p.collectionName ||
      (Array.isArray(p.selectCollection)
        ? p.selectCollection[0]?.collectionName || p.selectCollection[0] || ""
        : ""),
  };
};

/** Normalize a raw DB accessory into the consistent shape the UI expects */
export const normalizeAccessory = (a) => {
  if (!a) return a;
  const defaultImg   = a.colorImages?.find(c => c.isDefault) || a.colorImages?.[0];
  // accessory model uses `accessoryThumbnail` (not `thumbnail`) in colorImages
  const mainThumb    =
    defaultImg?.accessoryThumbnail ||
    a.accessoryThumbnail ||
    defaultImg?.thumbnail ||
    a.thumbnail || a.image || "";
  const extraThumbs = defaultImg?.additionalThumbnail?.filter(Boolean) || [];
  const gallery     = [mainThumb, ...extraThumbs].filter(Boolean);

  // prices array has at most 1 entry from getAllaccessory (pre-filtered by country)
  const indiaPrice   = (a.prices || []).find(x => x.country === 'IND');
  const anyPrice     = (a.prices || [])[0];
  const priceDoc     = indiaPrice || anyPrice || a.priceInfo;
  const sellingPrice = priceDoc?.sellingPrice ?? a.price ?? 0;
  const minQty       = priceDoc?.minimumQuantity ?? 1;
  const stockQty     = priceDoc?.stockQuantity ?? 0;

  const colorCodes = (a.selectColor || a.colorImages || [])
    .map(c => c.code || c.color).filter(Boolean);
  const sizeNames  = (a.selectSize || []).map(s => s.sizeName || s).filter(Boolean);
  return {
    ...a,
    isAccessory: true,
    title:       a.accessoryName || a.name || "",
    name:        a.accessoryName || a.name || "",
    image:       mainThumb,
    gallery,
    price:       sellingPrice,
    priceId:     a.priceId || priceDoc?._id,
    minQty,
    stockQty,
    colors:      colorCodes,
    colorImages: a.colorImages || [],
    sizes:       sizeNames,
    description: a.shortDescription || a.description || "",
  };
};
