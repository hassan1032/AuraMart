import { upload } from '../../helpers/aws.helpers.js'
import { IncomingForm } from 'formidable';
import mongoose from 'mongoose';
import productModel from '../../models/Product Management/product.model.js'
import productPriceModel from '../../models/Product Management/price.model.js'
import accessoryModel from '../../models/Product Management/accessory.model.js';
import { generateUniqueSlug } from '../../helpers/genrateSlug.helper.js'
import getCountryFromLatLon from '../../helpers/location.helper.js'


// Add Product ::
export const addProduct = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error", error: error.message });
        }
        try {
            const requiredFields = ["shortDescription", "productName", "detailedDescription", "productSKU", "additionalInformation"];
            for (const field of requiredFields) {
                if (!fields[field] || fields[field][0].trim() === "") {
                    return res.status(400).json({ success: false, message: `${field} is required.` });
                }
            }
            const shortDescription = fields.shortDescription[0].trim();
            const detailedDescription = fields.detailedDescription[0].trim();
            const productName = fields.productName[0].trim();
            const productSKU = fields.productSKU[0].trim();
            const additionalInformation = fields.additionalInformation[0].trim();
            let selectCollection, selectColor, selectSize;
            try {
                selectCollection = JSON.parse(fields.selectCollection[0]);
                selectColor = JSON.parse(fields.selectColor[0]);
                selectSize = JSON.parse(fields.selectSize[0]);
            } catch {
                return res.status(400).json({ success: false, message: "Collection, Color and Size must be valid JSON arrays." });
            }

            if (!Array.isArray(selectCollection) || selectCollection.length === 0) {
                return res.status(400).json({ success: false, message: "selectCollection is required!" });
            }
            if (!Array.isArray(selectColor) || selectColor.length === 0) {
                return res.status(400).json({ success: false, message: "selectColor is required!" });
            }
            if (!Array.isArray(selectSize) || selectSize.length === 0) {
                return res.status(400).json({ success: false, message: "selectSize is required!" });
            }
            const slug = await generateUniqueSlug(productName, productModel, "url");
            let thumbnailUrl = "";
            let additionalUrls = [];
            if (files.thumbnail) {
                thumbnailUrl = await upload({ image: [files.thumbnail[0]] });
            }
            if (files.additionalThumbnail) {
                additionalUrls = await Promise.all(files.additionalThumbnail.map(file => upload({ image: [file] })));
            }
            let accessoriesData = [];
            if (fields.accessories && fields.accessories[0]) {
                try {
                    const ids = JSON.parse(fields.accessories[0]);
                    if (!Array.isArray(ids)) {
                        return res.status(400).json({ success: false, message: "accessories must be an array of IDs." });
                    }
                    const accessories = await accessoryModel.find(
                        { _id: { $in: ids } },
                        { _id: 1, accessoryName: 1 }
                    );
                    accessoriesData = accessories.map(p => ({
                        id: p._id,
                        name: p.accessoryName
                    }));
                } catch {
                    return res.status(400).json({ success: false, message: "Invalid accessories format." });
                }
            }
            let colorImages = [];
            if (fields.colorImages && fields.colorImages[0]) {
                try {
                    const parsed = JSON.parse(fields.colorImages[0]);
                    for (const colorObj of parsed) {
                        const colorKey = colorObj.color;
                        let colorThumbUrl = "";
                        let colorAdditionalUrls = [];
                        let colorVideoUrl = "";
                        const hasThumbnail = files[`${colorKey}_thumbnail`] && files[`${colorKey}_thumbnail`].length > 0;
                        const hasAdditional = files[`${colorKey}_additional`] && files[`${colorKey}_additional`].length > 0;
                        const hasVideo = files[`${colorKey}_video`] && files[`${colorKey}_video`].length > 0;
                        if (hasThumbnail) {
                            colorThumbUrl = await upload({ image: [files[`${colorKey}_thumbnail`][0]] });
                        }
                        if (hasAdditional) {
                            colorAdditionalUrls = await Promise.all(
                                files[`${colorKey}_additional`].map(file => upload({ image: [file] }))
                            );
                        }
                        if (hasVideo) {
                            colorVideoUrl = await upload({ video: [files[`${colorKey}_video`][0]] });
                        }
                        if (hasThumbnail || hasAdditional || hasVideo) {
                            colorImages.push({ color: colorKey, code: colorObj.code, thumbnail: colorThumbUrl, additionalThumbnail: colorAdditionalUrls, video: colorVideoUrl, isDefault: colorObj.isDefault || false });
                        }
                    }
                } catch (err) {
                    console.error("Color Images Parse Error:", err);
                    return res.status(400).json({ success: false, message: "Invalid colorImages format." });
                }
            }
            const newProduct = new productModel({
                shortDescription,
                detailedDescription,
                additionalInformation,
                productName,
                productSKU,
                selectCollection,
                selectColor,
                selectSize,
                thumbnail: thumbnailUrl,
                additionalThumbnail: additionalUrls,
                accessories: accessoriesData,
                colorImages,
                url: slug
            });
            const savedProduct = await newProduct.save();
            if (fields.prices && fields.prices[0]) {
                let pricesArray;
                try {
                    pricesArray = JSON.parse(fields.prices[0]);
                } catch {
                    console.error("Invalid prices format, skipping...");
                    pricesArray = [];
                }
                const validPrices = pricesArray.filter(price => price.buyingPrice || price.sellingPrice);
                // for (const price of validPrices) {
                //     if (price.discountPrice && Number(price.discountPrice) > Number(price.sellingPrice)) {
                //         return res.status(400).json({
                //             success: false,
                //             message: `Discount price (${price.discountPrice}) cannot be greater than selling price (${price.sellingPrice}).`
                //         });
                //     }
                // }
                const priceDocs = validPrices.map(price => ({ ...price, productId: savedProduct._id }));
                if (priceDocs.length > 0) {
                    await productPriceModel.insertMany(priceDocs);
                }
            }
            res.status(201).json({ success: true, message: "Product added successfully!", data: savedProduct });
        } catch (err) {
            console.error("Add Product With Prices Error:", err);
            return res.status(500).json({ success: false, message: "Failed to add product.", error: err.message });
        }
    });
};
// Update product::
export const updateProduct = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required." });
        }
        try {
            const existingProduct = await productModel.findById(productId);
            if (!existingProduct) {
                return res.status(404).json({ success: false, message: "Product not found." });
            }

            const updateData = {};
            const stringFields = ["shortDescription", "detailedDescription", "additionalInformation", "productName", "productSKU"];
            stringFields.forEach(field => {
                if (fields[field]) {
                    updateData[field] = fields[field][0]?.trim() || "";
                }
            });
            const arrayFields = ["selectCollection", "selectColor", "selectSize", "accessories"];
            for (const field of arrayFields) {
                if (fields[field] && fields[field][0]) {
                    try {
                        const parsedArray = JSON.parse(fields[field][0]);
                        if (Array.isArray(parsedArray)) {
                            updateData[field] = parsedArray;
                        } else {
                            return res.status(400).json({ success: false, message: `${field} must be an array.` });
                        }
                    } catch {
                        return res.status(400).json({ success: false, message: `Invalid ${field} format.` });
                    }
                }
            }
            if (fields.colorImages && fields.colorImages[0]) {
                try {
                    const parsed = JSON.parse(fields.colorImages[0]);
                    let updatedColorImages = [];

                    for (const colorObj of parsed) {
                        const colorKey = colorObj.color;

                        let colorThumbUrl = "";
                        let colorAdditionalUrls = [];
                        let colorVideoUrl = "";

                        if (files[`${colorKey}_thumbnail`] && files[`${colorKey}_thumbnail`].length > 0) {
                            colorThumbUrl = await upload({ image: [files[`${colorKey}_thumbnail`][0]] });
                        } else {
                            colorThumbUrl = colorObj.thumbnail || "";
                        }

                        if (files[`${colorKey}_additional`] && files[`${colorKey}_additional`].length > 0) {
                            const newAdditionalUrls = await Promise.all(
                                files[`${colorKey}_additional`].map(file => upload({ image: [file] }))
                            );
                            colorAdditionalUrls = [
                                ...(colorObj.additionalThumbnail || []),
                                ...newAdditionalUrls
                            ];
                        } else {
                            colorAdditionalUrls = colorObj.additionalThumbnail || [];
                        }

                        if (files[`${colorKey}_video`] && files[`${colorKey}_video`].length > 0) {
                            colorVideoUrl = await upload({ video: [files[`${colorKey}_video`][0]] });
                        } else {
                            colorVideoUrl = colorObj.video || "";
                        }

                        updatedColorImages.push({
                            color: colorKey,
                            code: colorObj.code,
                            thumbnail: colorThumbUrl,
                            additionalThumbnail: colorAdditionalUrls,
                            video: colorVideoUrl,
                            isDefault: colorObj.isDefault || false
                        });
                    }

                    if (updatedColorImages.length > 0) {
                        let hasDefault = false;
                        updatedColorImages = updatedColorImages.map(img => {
                            if (img.isDefault && !hasDefault) {
                                hasDefault = true;
                                return img;
                            }
                            return { ...img, isDefault: false };
                        });
                        updateData.colorImages = updatedColorImages;
                    }
                } catch (err) {
                    console.error("Color Images Parse Error:", err);
                    return res.status(400).json({ success: false, message: "Invalid colorImages format." });
                }
            }
            if (fields.accessories && fields.accessories[0]) {
                try {
                    const ids = JSON.parse(fields.accessories[0]);
                    if (!Array.isArray(ids)) {
                        return res.status(400).json({ success: false, message: "accessories must be an array of IDs." });
                    }
                    const accessories = await accessoryModel.find(
                        { _id: { $in: ids } },
                        { _id: 1, accessoryName: 1 }
                    );

                    const newAccessories = accessories.map(p => ({ id: p._id, name: p.accessoryName }));
                    const existingAccessories = existingProduct.accessories || [];
                    const mergedAccessories = [
                        ...existingAccessories.filter(
                            ea => !newAccessories.some(na => na.id.toString() === ea.id.toString())
                        ),
                        ...newAccessories
                    ];

                    updateData.accessories = mergedAccessories;
                } catch {
                    return res.status(400).json({ success: false, message: "Invalid accessories format." });
                }
            }
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $set: updateData },
                { new: true, runValidators: true }
            );
            if (fields.prices && fields.prices[0]) {
                let pricesArray;
                try {
                    pricesArray = JSON.parse(fields.prices[0]);
                } catch {
                    return res.status(400).json({ success: false, message: "Invalid prices format." });
                }

                const validPrices = pricesArray.filter(price => price.buyingPrice || price.sellingPrice);
                if (validPrices.length > 0) {
                    for (const price of validPrices) {
                        await productPriceModel.findOneAndUpdate(
                            { productId, country: price.country },
                            { ...price, productId },
                            { new: true, upsert: true }
                        );
                    }
                }
            }

            const updatedPrices = await productPriceModel.find({ productId });
            return res.status(200).json({ success: true, message: "Product updated successfully.", data: { ...updatedProduct.toObject(), prices: updatedPrices } });

        } catch (err) {
            console.error("Update Product Error:", err);
            return res.status(500).json({ success: false, message: "Failed to update product.", error: err.message });
        }
    });
};
// Get All Products
export const getAllProduct = async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        const isAdmin = req.query.isAdmin === "true";
        let userCountry = null;
        if (!isNaN(lat) && !isNaN(lon)) {
            userCountry = getCountryFromLatLon(lat, lon);
        }
        const collection = await productModel.aggregate([
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "_id",
                    foreignField: "productId",
                    as: "prices"
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        const productsWithCountryPrice = collection.map(product => {
            if (isAdmin) {
                return product;
            }
            let selectedPrice;
            if (userCountry) {
                selectedPrice = product.prices.find(p => p.country === userCountry);
            }
            if (!selectedPrice) {
                selectedPrice = product.prices.find(p => p.country === "UK");
            }
            if (!selectedPrice && product.prices.length > 0) {
                selectedPrice = product.prices[0];
            }
            return {
                ...product,
                prices: selectedPrice ? [selectedPrice] : []
            };
        });
        const count = await productModel.countDocuments();
        return res.status(200).json({ success: true, message: "All products fetched successfully.", count, data: productsWithCountryPrice });

    } catch (err) {
        console.error("Get product Error:", err);
        return res.status(500).json({ success: false, message: "Server error while fetching products", error: err.message });
    }
};
// Get Single Product By ID
export const getproductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        const product = await productModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "_id",
                    foreignField: "productId",
                    as: "prices"
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        if (!product || product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, message: "Product retrieved successfully", data: product });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to retrieve Product", error: error.message });
    }
};
// Get Single Product By User
export const getProductByUser = async (req, res) => {
    try {
        const idOrSlug = req.query.id || req.query.idOrSlug || req.body.id || req.body.idOrSlug;
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        let matchCondition = {};
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            matchCondition = { _id: new mongoose.Types.ObjectId(idOrSlug) };
        } else {
            matchCondition = { url: idOrSlug };
        }

        const product = await productModel.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "_id",
                    foreignField: "productId",
                    as: "prices"
                }
            },
            {
                $lookup: {
                    from: "accessoryschemas",
                    localField: "accessories.id",
                    foreignField: "_id",
                    as: "accessories"
                },
            },
            { $unset: "accessories.product" },
            {
                $lookup: {
                    from: "priceschemas",
                    let: { accIds: "$accessories._id" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$accessoryId", "$$accIds"] } } }
                    ],
                    as: "accessoryPrices"
                },
            },
            {
                $addFields: {
                    accessories: {
                        $map: {
                            input: "$accessories",
                            as: "acc",
                            in: {
                                $mergeObjects: [
                                    "$$acc",
                                    {
                                        prices: {
                                            $filter: {
                                                input: "$accessoryPrices",
                                                as: "price",
                                                cond: { $eq: ["$$price.accessoryId", "$$acc._id"] }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    shortDescription: 1,
                    additionalInformation: 1,
                    detailedDescription: 1,
                    selectCollection: 1,
                    selectColor: 1,
                    selectSize: 1,
                    productSKU: 1,
                    thumbnail: 1,
                    additionalThumbnail: 1,
                    colorImages: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    prices: 1,
                    accessories: 1,
                }
            }
        ]);

        if (!product || product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        let finalProduct = product[0];
        let userCountry = null;
        if (!isNaN(lat) && !isNaN(lon)) {
            userCountry = getCountryFromLatLon(lat, lon);
        }
        let selectedProdPrice;
        if (userCountry) {
            selectedProdPrice = finalProduct.prices.find(p => p.country.toUpperCase() === userCountry.toUpperCase());
        }
        if (!selectedProdPrice) {
            selectedProdPrice = finalProduct.prices.find(p => p.country === "UK");
        }
        if (!selectedProdPrice && finalProduct.prices.length > 0) {
            selectedProdPrice = finalProduct.prices[0];
        }
        finalProduct.prices = selectedProdPrice ? [selectedProdPrice] : [];
        if (finalProduct.accessories && finalProduct.accessories.length > 0) {
            finalProduct.accessories = finalProduct.accessories.map(acc => {
                let selectedAccPrice;
                if (userCountry) {
                    selectedAccPrice = acc.prices.find(p => p.country.toUpperCase() === userCountry.toUpperCase());
                }
                if (!selectedAccPrice) {
                    selectedAccPrice = acc.prices.find(p => p.country === "UK");
                }
                if (!selectedAccPrice && acc.prices.length > 0) {
                    selectedAccPrice = acc.prices[0];
                }
                return {
                    ...acc,
                    prices: selectedAccPrice ? [selectedAccPrice] : []
                };
            });
        }
        return res.status(200).json({ success: true, message: "Product retrieved successfully", data: finalProduct });
    } catch (error) {
        console.log("Get product by ID error:", error);
        return res.status(500).json({ success: false, message: "Failed to retrieve product", error: error.message });
    }
};
// Delete Product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        await productPriceModel.deleteMany({ productId: id });
        return res.status(200).json({ success: true, message: "Product deleted successfully!" });
    } catch (err) {
        console.error("Delete Product Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting product", error: err.message });
    }
};
// update product status
export const updatedproductstatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "product ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "product not found." });
        }
        product.status = status;
        const updatedProduct = await product.save();
        return res.status(200).json({ success: true, message: "product status updated successfully.", data: updatedProduct });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// Genrate SKU Code For Product ::
export const generateSKU = async (req, res) => {
    try {
        const generateRandomNumber = (length = 5) => {
            const min = Math.pow(10, length - 1);
            const max = Math.pow(10, length) - 1;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const code = generateRandomNumber(6);
        res.status(200).json({ sku: `${code}` });
    } catch (err) {
        console.error("SKU Generation Error:", err);
        res.status(500).json({ message: "Failed to generate SKU" });
    }
};
// Genrate Barcode For Product ::
export const generateBarcodeLabels = async (req, res) => {
    try {
        const productId = req.params.id;
        const count = parseInt(req.query.count) || 1;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const labels = Array(count).fill(product.productSKU);
        res.status(200).json({ sku: product.productSKU, labels });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Filter Data Admin ::
export const getFilteredProducts = async (req, res) => {
    try {
        const { selectCollection, selectColor, selectSize, productName } = req.query;
        const filter = {};
        if (selectCollection) {
            filter.selectCollection = selectCollection;
        }
        if (selectColor) {
            filter["selectColor.color"] = { $regex: selectColor, $options: "i" };
        }
        if (selectSize) {
            filter.selectSize = selectSize;
        }
        if (productName) {
            filter.productName = { $regex: productName, $options: 'i' };
        }
        if (Object.keys(filter).length === 0) {
            return res.status(200).json({ success: true, message: "No Data Found!", count: 0, data: [] });
        }
        const products = await productModel.find(filter);
        if (!products || products.length === 0) {
            return res.status(200).json({ success: true, message: "No Data Found!", count: 0, data: [] });
        }
        res.status(200).json({ success: true, count: products.length, data: products });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// Make The Product Image Default :::
export const setDefaultColor = async (req, res) => {
    try {
        const { color } = req.body;
        const { id: productId } = req.params;

        if (!productId || !color) {
            return res.status(400).json({ success: false, message: "ProductId (in params) and color are required." });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        // reset all colors
        product.colorImages.forEach(img => { img.isDefault = false });

        // find selected color
        const selectedColor = product.colorImages.find(img => img.color === color);
        if (!selectedColor) {
            return res.status(400).json({ success: false, message: "Color not found in product." });
        }

        // make default
        selectedColor.isDefault = true;
        if (selectedColor.thumbnail) {
            product.thumbnail = selectedColor.thumbnail;
        }
        if (selectedColor.additionalThumbnail?.length > 0) {
            product.additionalThumbnail = selectedColor.additionalThumbnail;
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: `Default color set to ${color}`,
            data: product
        });
    } catch (err) {
        console.error("Set Default Color Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to set default color.",
            error: err.message
        });
    }
};
// Filter Product User ::
export const getFiltered = async (req, res) => {
    try {
        const { sort, price, color, size, search, limit } = req.query;
        let matchStage = {};

        if (color) matchStage["selectColor.color"] = { $regex: color, $options: "i" };
        if (size) matchStage["selectSize.sizeName"] = { $regex: size, $options: "i" };
        if (search) {
            matchStage.$or = [
                { productName: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
            ];
        }

        let pipeline = [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "_id",
                    foreignField: "productId",
                    as: "prices"
                }
            },
            {
                $addFields: {
                    // Use first available price entry regardless of country
                    priceInfo: { $arrayElemAt: ["$prices", 0] }
                }
            },
            { $project: { prices: 0 } }
        ];

        if (price === "low") {
            pipeline.push({ $sort: { "priceInfo.sellingPrice": 1 } });
        } else if (price === "high") {
            pipeline.push({ $sort: { "priceInfo.sellingPrice": -1 } });
        } else if (sort === "asc") {
            pipeline.push({ $sort: { productName: 1 } });
        } else if (sort === "desc") {
            pipeline.push({ $sort: { productName: -1 } });
        }

        const limitNum = parseInt(limit) || 50;
        pipeline.push({ $limit: limitNum });

        const products = await productModel.aggregate(pipeline);
        return res.status(200).json({ success: true, data: products || [] });

    } catch (err) {
        console.error("Filter API Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch products", error: err.message });
    }
};


















