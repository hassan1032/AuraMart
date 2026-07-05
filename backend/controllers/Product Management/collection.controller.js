import { IncomingForm } from 'formidable';
import collectionModel from '../../models/Product Management/collection.model.js';
import { upload } from '../../helpers/aws.helpers.js'

// add collection
export const addCollection = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const name = fields.name?.[0]?.trim();
        const description = fields.description?.[0]?.trim() || '';
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required." });
        }
        const thumbnailFile = Array.isArray(files.thumbnail) ? files.thumbnail[0] : files.thumbnail;
        const bannerFile    = Array.isArray(files.bannerThumnail) ? files.bannerThumnail[0] : files.bannerThumnail;
        if (!bannerFile) {
            return res.status(400).json({ success: false, message: "Banner Thumbnail is required." });
        }
        if (!thumbnailFile) {
            return res.status(400).json({ success: false, message: "Thumbnail is required." });
        }
        try {
            const thumbnailUrl    = await upload({ image: [thumbnailFile] });
            const bannerThumnailURl = await upload({ image: [bannerFile] });
            const newCollection = new collectionModel({
                name,
                description,
                thumbnail: thumbnailUrl,
                bannerThumnail: bannerThumnailURl
            });
            const savedCollection = await newCollection.save();
            return res.status(201).json({ success: true, message: "Collection add successfully.", data: savedCollection });
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            console.error("Add Collection Error:", errMsg);
            return res.status(500).json({ success: false, message: "Failed to add collection.", error: errMsg });
        }
    });
};
// update collection
export const updateCollection = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const collectionId = req.params.id;
        if (!collectionId) {
            return res.status(400).json({ success: false, message: "collection ID is required." });
        }
        const name = fields.name?.[0]?.trim();
        const description = fields.description?.[0]?.trim();
        try {
            const collection = await collectionModel.findById(collectionId);
            if (!collection) {
                return res.status(404).json({ success: false, message: "collection not found." });
            }
            if (name) collection.name = name;
            if (description) collection.description = description;
            if (files.thumbnail) {
                const thumbFile = Array.isArray(files.thumbnail) ? files.thumbnail[0] : files.thumbnail;
                const thumbnailUrl = await upload({ image: [thumbFile] });
                collection.thumbnail = thumbnailUrl;
            }
            if (files.bannerThumnail) {
                const bannerFile = Array.isArray(files.bannerThumnail) ? files.bannerThumnail[0] : files.bannerThumnail;
                const bannerUrl = await upload({ image: [bannerFile] });
                collection.bannerThumnail = bannerUrl;
            }
            const updatedcollection = await collection.save();
            return res.status(200).json({ success: true, message: "collection updated successfully.", data: updatedcollection });
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            console.error("Update collection Error:", errMsg);
            return res.status(500).json({ success: false, message: "Failed to update collection.", error: errMsg });
        }
    });
};
// Get all collection
export const getAllCollection = async (req, res) => {
    try {
        const collection = await collectionModel.find().sort({ createdAt: -1 });
        const count = await collectionModel.countDocuments();
        return res.status(200).json({ success: true, message: "All collection fetched successfully.", count: count, data: collection });
    } catch (err) {
        console.error("Get Product Error:", err); return res.status(500).json({ success: false, message: "Server error while fetching Product.", error: err.message });
    }
};
// update collection status
export const updatedcollectionstatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "collection ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const collection = await collectionModel.findById(id);
        if (!collection) {
            return res.status(404).json({ success: false, message: "collection not found." });
        }
        collection.status = status;
        const updatedCollection = await collection.save();
        return res.status(200).json({ success: true, message: "collection status updated successfully.", data: updatedCollection });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// Delete collection
export const deleteCollection = async (req, res) => {
    const { id } = req.params;
    try {
        const collection = await collectionModel.findByIdAndDelete(id);
        if (!collection) {
            return res.status(404).json({ success: false, message: " collection not found." });
        }
        return res.status(200).json({ success: true, message: " collection deleted successfully.", });
    } catch (err) {
        console.error("Delete unit Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting" })
    }
};
// Get collection with product ::: 
export const getAllCollectionWithProductCount = async (req, res) => {
    try {
        const collections = await collectionModel.aggregate([
            {
                $lookup: {
                    from: "productschemas",
                    localField: "name",
                    foreignField: "selectCollection",
                    as: "productschemas"
                }
            },
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "productschemas._id",
                    foreignField: "productId",
                    as: "allPrices"
                }
            },
            {
                $addFields: {
                    products: {
                        $map: {
                            input: "$productschemas",
                            as: "prod",
                            in: {
                                $mergeObjects: [
                                    "$$prod",
                                    {
                                        prices: {
                                            $filter: {
                                                input: "$allPrices",
                                                as: "p",
                                                cond: { $eq: ["$$p.productId", "$$prod._id"] }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    productCount: { $size: "$productschemas" }
                }
            },
            {
                $project: {
                    products: 1,
                    productCount: 1,
                    name: 1,
                    thumbnail: 1,
                    bannerThumnail: 1,
                    description: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        return res.status(200).json({ success: true, message: " Collections fetched successfully.", data: collections });
    } catch (err) {
        console.error("Get Collection Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching collections.",
            error: err.message
        });
    }
};


