import accessoryModel from "../../models/Product Management/accessory.model.js";
import AccessorypriceModel from "../../models/Product Management/price.model.js";
import productModel from "../../models/Product Management/product.model.js"
import mongoose from "mongoose";
import { upload } from '../../helpers/aws.helpers.js'
import { IncomingForm } from 'formidable';
import { generateUniqueSlug } from '../../helpers/genrateSlug.helper.js'
import getCountryFromLatLon from '../../helpers/location.helper.js'

// add Accessory ::
export const addAccessory = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error", error: error.message });
        }
        try {
            const requiredFields = ['shortDescription', 'accessoryName', 'detailedDescription', 'selectColor', 'selectSize', 'accessorySKU', 'additionalInformation'];
            for (const field of requiredFields) {
                if (!fields[field] || fields[field][0].trim() === '') {
                    return res.status(400).json({ success: false, message: `${field} is required.` });
                }
            }
            const shortDescription = fields.shortDescription[0].trim();
            const detailedDescription = fields.detailedDescription[0].trim();
            const additionalInformation = fields.additionalInformation[0].trim()
            const accessoryName = fields.accessoryName[0].trim();
            const accessorySKU = fields.accessorySKU[0].trim();
            let selectColor, selectAccessoryType, selectSize;
            try {
                selectColor = JSON.parse(fields.selectColor[0]);
                selectSize = JSON.parse(fields.selectSize[0]);
                selectAccessoryType = JSON.parse(fields.selectAccessoryType[0])
            } catch {
                return res.status(400).json({ success: false, message: "Color and Size and accessory must be valid JSON arrays." });
            }
            if (!Array.isArray(selectColor) || selectColor.length === 0) {
                return res.status(400).json({ success: false, message: "selectColor is required!" });
            }
            if (!Array.isArray(selectAccessoryType) || selectAccessoryType.length === 0) {
                return res.status(400).json({ success: false, message: "selectAccessoryType is required!" });
            }
            if (!Array.isArray(selectSize) || selectSize.length === 0) {
                return res.status(400).json({ success: false, message: "selectSize is required!" });
            }
            const slug = await generateUniqueSlug(accessoryName, accessoryModel, "url");
            let accessoryThumbnailUrl = "";
            let additionalUrls = [];
            if (files.accessoryThumbnail) {
                accessoryThumbnailUrl = await upload({ image: [files.accessoryThumbnail[0]] });
            }
            if (files.additionalThumbnail) {
                additionalUrls = await Promise.all(files.additionalThumbnail.map(file => upload({ image: [file] })));
            }
            let colorImages = [];
            if (fields.colorImages && fields.colorImages[0]) {
                try {
                    const parsed = JSON.parse(fields.colorImages[0]);
                    for (const colorObj of parsed) {
                        const colorKey = colorObj.color;
                        let accessoryThumbUrl = "";
                        let colorAdditionalUrls = [];
                        let colorVideoUrl = "";

                        const hasAccessoryThumbnail = files[`${colorKey}_accessoryThumbnail`] && files[`${colorKey}_accessoryThumbnail`].length > 0;
                        const hasAdditional = files[`${colorKey}_additional`] && files[`${colorKey}_additional`].length > 0;
                        const hasVideo = files[`${colorKey}_video`] && files[`${colorKey}_video`].length > 0;

                        if (hasAccessoryThumbnail) {
                            accessoryThumbUrl = await upload({ image: [files[`${colorKey}_accessoryThumbnail`][0]] });
                        }

                        if (hasAdditional) {
                            colorAdditionalUrls = await Promise.all(
                                files[`${colorKey}_additional`].map(file => upload({ image: [file] }))
                            );
                        }

                        if (hasVideo) {
                            colorVideoUrl = await upload({ video: [files[`${colorKey}_video`][0]] });
                        }
                        colorImages.push({ color: colorKey, code: colorObj.code, accessoryThumbnail: accessoryThumbUrl, additionalThumbnail: colorAdditionalUrls, video: colorVideoUrl, isDefault: colorObj.isDefault || false, });
                    }
                } catch (err) {
                    console.error("Color Images Parse Error:", err);
                    return res.status(400).json({ success: false, message: "Invalid colorImages format." });
                }
            }
            let productData = [];
            if (fields.product && fields.product[0]) {
                try {
                    const ids = JSON.parse(fields.product[0]);
                    if (!Array.isArray(ids)) {
                        return res.status(400).json({ success: false, message: "Product must be an array of IDs." });
                    }
                    const products = await productModel.find(
                        { _id: { $in: ids } },
                        { _id: 1, productName: 1 }
                    );
                    productData = products.map(p => ({ id: p._id, name: p.productName }));
                } catch {
                    return res.status(400).json({ success: false, message: "Invalid Product format." });
                }
            }
            const newAccessory = new accessoryModel({
                shortDescription,
                detailedDescription,
                accessoryName,
                accessorySKU,
                selectAccessoryType,
                additionalInformation,
                selectColor,
                selectSize,
                accessoryThumbnail: accessoryThumbnailUrl,
                additionalThumbnail: additionalUrls,
                product: productData,
                colorImages,
                url: slug
            });
            const savedAccessory = await newAccessory.save();
            res.status(201).json({ success: true, message: "Accessory added successfully!", data: savedAccessory });
            if (fields.prices && fields.prices[0]) {
                let pricesArray;
                try {
                    pricesArray = JSON.parse(fields.prices[0]);
                } catch {
                    console.error("Invalid prices format, skipping..."); 1``
                    return;
                }
                const validPrices = pricesArray.filter(price => price.buyingPrice || price.sellingPrice);
                const priceDocs = validPrices.map(price => ({ ...price, accessoryId: savedAccessory._id }));
                if (priceDocs.length > 0) { await AccessorypriceModel.insertMany(priceDocs); }
            }
        } catch (err) {
            console.error("Add accessory With Prices Error:", err);
            return res.status(500).json({ success: false, message: "Failed to add accessory.", error: err.message });
        }
    });
};
// Update Accessory 
export const updateAccessory = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const accessoryId = req.params.id;
        if (!accessoryId) {
            return res.status(400).json({ success: false, message: "Accessory ID is required." });
        }
        try {
            const existingAccessory = await accessoryModel.findById(accessoryId);
            if (!existingAccessory) {
                return res.status(404).json({ success: false, message: "Accessory not found." });
            }
            const updateData = {};
            const stringFields = ["shortDescription", "detailedDescription", "additionalInformation", "accessoryName", "productSKU"];
            stringFields.forEach(field => {
                if (fields[field]) {
                    updateData[field] = fields[field][0]?.trim() || "";
                }
            });
            const arrayFields = ["selectAccessoryType", "selectColor", "selectSize"];
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
            if (fields.product && fields.product[0]) {
                try {
                    const ids = JSON.parse(fields.product[0]);
                    if (!Array.isArray(ids)) {
                        return res.status(400).json({ success: false, message: "product must be an array of IDs." });
                    }
                    const products = await productModel.find(
                        { _id: { $in: ids } },
                        { _id: 1, productName: 1 }
                    );
                    updateData.product = products.map(p => ({
                        id: p._id,
                        name: p.productName
                    }));
                } catch {
                    return res.status(400).json({ success: false, message: "Invalid product format." });
                }
            }
            if (fields.colorImages && fields.colorImages[0]) {
                try {
                    const parsed = JSON.parse(fields.colorImages[0]);
                    let updatedColorImages = [];

                    for (const colorObj of parsed) {
                        const colorKey = colorObj.color;

                        let accessoryThumbnailUrl = "";
                        let colorAdditionalUrls = [];
                        let colorVideoUrl = "";

                        if (files[`${colorKey}_accessoryThumbnail`] && files[`${colorKey}_accessoryThumbnail`].length > 0) {
                            accessoryThumbnailUrl = await upload({ image: [files[`${colorKey}_accessoryThumbnail`][0]] });
                        } else {
                            accessoryThumbnailUrl = colorObj.accessoryThumbnail || "";
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
                            accessoryThumbnail: accessoryThumbnailUrl,
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
            if (fields.product && fields.product[0]) {
                try {
                    const ids = JSON.parse(fields.product[0]);
                    if (!Array.isArray(ids)) {
                        return res.status(400).json({ success: false, message: "product must be an array of IDs." });
                    }
                    const products = await productModel.find(
                        { _id: { $in: ids } },
                        { _id: 1, productName: 1 }
                    );
                    const newProducts = products.map(p => ({ id: p._id, name: p.productName }));
                    const existingProducts = existingAccessory.product || [];
                    const mergedProducts = [
                        ...existingProducts.filter(
                            ep => !newProducts.some(np => np.id.toString() === ep.id.toString())
                        ),
                        ...newProducts
                    ];
                    updateData.product = mergedProducts;
                } catch {
                    return res.status(400).json({ success: false, message: "Invalid product format." });
                }
            }
            const updatedProduct = await accessoryModel.findByIdAndUpdate(
                accessoryId,
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
                        await AccessorypriceModel.findOneAndUpdate(
                            { accessoryId, country: price.country },
                            { ...price, accessoryId },
                            { new: true, upsert: true }
                        );
                    }
                }
            }
            const updatedPrices = await AccessorypriceModel.find({ accessoryId });
            return res.status(200).json({ success: true, message: "Accessory updated successfully.", data: { ...updatedProduct.toObject(), prices: updatedPrices } });
        } catch (err) {
            console.error("Update Product Error:", err);
            return res.status(500).json({ success: false, message: "Failed to update product.", error: err.message });
        }
    });
};
// Get All Accessory ::
export const getAllaccessory = async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        const isAdmin = req.query.isAdmin === "true";
        let userCountry = null;
        if (!isNaN(lat) && !isNaN(lon)) {
            userCountry = getCountryFromLatLon(lat, lon);
        }
        const collection = await accessoryModel.aggregate([
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "_id",
                    foreignField: "accessoryId",
                    as: "prices"
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        const accessoriesWithCountryPrice = collection.map(accessories => {
            if (isAdmin) {
                return accessories;
            }
            let selectedPrice;
            if (userCountry) {
                selectedPrice = accessories.prices.find(p => p.country === userCountry);
            }
            if (!selectedPrice) {
                selectedPrice = accessories.prices.find(p => p.country === "UK");
            }
            if (!selectedPrice && accessories.prices.length > 0) {
                selectedPrice = accessories.prices[0];
            }
            return {
                ...accessories,
                prices: selectedPrice ? [selectedPrice] : []
            };
        });
        const count = await accessoryModel.countDocuments();
        return res.status(200).json({ success: true, message: "All accessory fetched successfully.", count, data: accessoriesWithCountryPrice });

    } catch (err) {
        console.error("Get product Error:", err);
        return res.status(500).json({ success: false, message: "Server error while fetching products", error: err.message });
    }
};
// Get Single Accessory By User
export const getAccessoryByUser = async (req, res) => {
    try {
        const { idOrSlug } = req.body;
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        let matchCondition = {};
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            matchCondition = { _id: new mongoose.Types.ObjectId(idOrSlug) };
        } else {
            matchCondition = { url: idOrSlug };
        }
        const accessory = await accessoryModel.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "_id",
                    foreignField: "accessoryId",
                    as: "prices"
                }
            },
            {
                $lookup: {
                    from: "productschemas",
                    localField: "product.id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unset: "product.accessories" },
            {
                $lookup: {
                    from: "priceschemas",
                    let: { prodIds: "$product._id" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$productId", "$$prodIds"] } } }
                    ],
                    as: "productPrices"
                }
            },
            {
                $addFields: {
                    product: {
                        $map: {
                            input: "$product",
                            as: "prod",
                            in: {
                                $mergeObjects: [
                                    "$$prod",
                                    {
                                        prices: {
                                            $filter: {
                                                input: "$productPrices",
                                                as: "price",
                                                cond: { $eq: ["$$price.productId", "$$prod._id"] }
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
                    accessoryName: 1,
                    shortDescription: 1,
                    detailedDescription: 1,
                    additionalInformation: 1,
                    colorImages: 1,
                    selectCollection: 1,
                    selectColor: 1,
                    selectSize: 1,
                    accessorySKU: 1,
                    accessoryThumbnail: 1,
                    additionalThumbnail: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    prices: 1,
                    product: 1
                }
            }
        ]);
        if (!accessory || accessory.length === 0) {
            return res.status(404).json({ success: false, message: "Accessory not found" });
        }
        let finalAccessory = accessory[0];
        let userCountry = null;
        if (!isNaN(lat) && !isNaN(lon)) {
            userCountry = getCountryFromLatLon(lat, lon);
        }
        let selectedAccPrice;
        if (userCountry) {
            selectedAccPrice = finalAccessory.prices.find(
                p => p.country.toUpperCase() === userCountry.toUpperCase()
            );
        }
        if (!selectedAccPrice) {
            selectedAccPrice = finalAccessory.prices.find(p => p.country === "UK");
        }
        if (!selectedAccPrice && finalAccessory.prices.length > 0) {
            selectedAccPrice = finalAccessory.prices[0];
        }
        finalAccessory.prices = selectedAccPrice ? [selectedAccPrice] : [];
        if (finalAccessory.product && finalAccessory.product.length > 0) {
            finalAccessory.product = finalAccessory.product.map(prod => {
                let selectedProdPrice;
                if (userCountry) {
                    selectedProdPrice = prod.prices.find(
                        p => p.country.toUpperCase() === userCountry.toUpperCase()
                    );
                }
                if (!selectedProdPrice) {
                    selectedProdPrice = prod.prices.find(p => p.country === "UK");
                }
                if (!selectedProdPrice && prod.prices.length > 0) {
                    selectedProdPrice = prod.prices[0];
                }
                return {
                    ...prod,
                    prices: selectedProdPrice ? [selectedProdPrice] : []
                };
            });
        }
        return res.status(200).json({ success: true, message: "Accessory retrieved successfully", data: finalAccessory });

    } catch (error) {
        console.log("Get accessory by ID error:", error);
        return res.status(500).json({ success: false, message: "Failed to retrieve accessory", error: error.message });
    }
};
// Get Single Accessory By ID
export const getaccessoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        const acceesory = await accessoryModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "_id",
                    foreignField: "accessoryId",
                    as: "prices"
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        if (!acceesory || acceesory.length === 0) {
            return res.status(404).json({ success: false, message: "Accessory not found" });
        }
        return res.status(200).json({ success: true, message: "Accessory retrieved successfully", data: acceesory });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to retrieve Accessory", error: error.message });
    }
};
// Delete Accessory
export const deleteAccessory = async (req, res) => {
    const { id } = req.params;
    try {
        const accessory = await accessoryModel.findByIdAndDelete(id);
        if (!accessory) {
            return res.status(404).json({ success: false, message: "Accessory not found." });
        }
        await AccessorypriceModel.deleteMany({ accessoryId: id });
        return res.status(200).json({ success: true, message: "Accessory deleted successfully!" });
    } catch (err) {
        console.error("Delete accessory Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting accessory", error: err.message });
    }
};
// update Accessory status
export const updatedaccesorystatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "accessory ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const accessory = await accessoryModel.findById(id);
        if (!accessory) {
            return res.status(404).json({ success: false, message: "accessory not found." });
        }
        accessory.status = status;
        const updatedAccessory = await accessory.save();
        return res.status(200).json({ success: true, message: "accessory status updated successfully.", data: updatedAccessory });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// Genrate Barcode Accessory
export const generateBarcodeAccescory = async (req, res) => {
    try {
        const accesoryId = req.params.id;
        const count = parseInt(req.query.count) || 1;
        const accessory = await accessoryModel.findById(accesoryId);
        if (!accessory) {
            return res.status(404).json({ message: 'Accessory not found' });
        }
        const labels = Array(count).fill(accessory.accessorySKU);
        res.status(200).json({ sku: accessory.accessorySKU, labels });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Fiter Accessory Admin
export const getFilteredAccessory = async (req, res) => {
    try {
        const { selectAccessoryType, selectColor, selectSize, accessoryName } = req.query;
        const filter = {};
        if (selectAccessoryType) {
            filter.selectAccessoryType = selectAccessoryType;
        }
        if (selectColor) {
            filter["selectColor.color"] = { $regex: selectColor, $options: "i" };
        }
        if (selectSize) {
            filter.selectSize = selectSize;
        }
        if (accessoryName) {
            filter.accessoryName = { $regex: accessoryName, $options: 'i' };
        }
        if (Object.keys(filter).length === 0) {
            return res.status(200).json({ success: true, message: "No Data Found!", count: 0, data: [] });
        }
        const accessory = await accessoryModel.find(filter);
        if (!accessory || accessory.length === 0) {
            return res.status(200).json({ success: true, message: "No Data Found!", count: 0, data: [] });
        }
        res.status(200).json({ success: true, count: accessory.length, data: accessory });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// Filter Aceessory by User
export const getFilter = async (req, res) => {
    try {
        const { sort, price, color, size, country } = req.query;
        let matchStage = {};
        if (color) {
            matchStage["selectColor.color"] = color;
        }
        if (size) {
            matchStage.selectSize = size;
        }
        let pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "_id",
                    foreignField: "accessoryId",
                    as: "prices"
                }
            },
            {
                $addFields: {
                    prices: {
                        $filter: {
                            input: "$prices",
                            as: "price",
                            cond: { $eq: ["$$price.country", country?.toUpperCase() || ""] }
                        }
                    }
                }
            },
            {
                $match: {
                    "prices.0": { $exists: true }
                }
            },
            {
                $addFields: {
                    price: { $arrayElemAt: ["$prices", 0] }
                }
            },
            {
                $project: {
                    prices: 0
                }
            }
        ];
        if (price === "low" || price === "high") {
            pipeline.push({
                $sort: {
                    "price.sellingPrice": price === "low" ? 1 : -1
                }
            });
        } else if (sort === "asc") {
            pipeline.push({ $sort: { productName: 1 } });
        } else if (sort === "desc") {
            pipeline.push({ $sort: { productName: -1 } });
        }
        const accessories = await accessoryModel.aggregate(pipeline);
        if (!accessories || accessories.length === 0) {
            return res.status(404).json({ success: false, message: "No Accessories found matching the filter" });
        }
        return res.status(200).json({ success: true, data: accessories });
    } catch (err) {
        console.error("Filter API Error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch accessories", error: err.message });
    }
};
