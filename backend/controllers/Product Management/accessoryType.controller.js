import accessorytypeModel from "../../models/Product Management/accessoryType.model.js";
import { IncomingForm } from 'formidable';
import { upload } from '../../helpers/aws.helpers.js'

// Add accessory type
export const addAccessoryType = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const requiredFields = ['name', 'description'];
        for (const field of requiredFields) {
            if (!fields[field] || fields[field][0].trim() === '') {
                return res.status(400).json({ success: false, message: `${field} is required.` });
            }
        }
        const name = fields.name?.[0]?.trim();
        const description = fields.description?.[0]?.trim()
        if (!files.thumbnail) {
            return res.status(400).json({ success: false, message: "Thumbnail is required." });
        }
        if (!files.accessorybanner) {
            return res.status(400).json({ success: false, message: " Accessory banner is required." });
        }
        try {
            const thumbnailUrl = await upload({ image: [files.thumbnail[0]] });
            const accessorybannerURl = await upload({ image: [files.accessorybanner[0]] });
            const newAccessory = new accessorytypeModel({
                name,
                description: description,
                accessorybanner: accessorybannerURl,
                thumbnail: thumbnailUrl,
            });
            const savednewAccessory = await newAccessory.save();
            return res.status(201).json({ success: true, message: "Accessory add successfully.", data: savednewAccessory });
        } catch (err) {
            console.error("Add Collection Error:", err);
            return res.status(500).json({ success: false, message: "Failed to add Accessory.", error: err.message });
        }
    });
};
// Update accessory type
export const updateAccessoryType = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const accessoryId = req.params.id;
        if (!accessoryId) {
            return res.status(400).json({ success: false, message: " Accessory ID is required." });
        }
        const name = fields.name?.[0]?.trim();
        const description = fields.description?.[0]?.trim();
        try {
            const accessory = await accessorytypeModel.findById(accessoryId);
            if (!accessory) {
                return res.status(404).json({ success: false, message: "accessory not found." });
            }
            if (name) accessory.name = name;
            if (description) accessory.description = description;
            if (files.thumbnail) { files.image = files.thumbnail; const thumbnailUrl = await upload(files); accessory.thumbnail = thumbnailUrl; }
            if (files.accessorybanner) { files.image = files.accessorybanner; const accessorybannerURl = await upload(files); accessory.accessorybanner = accessorybannerURl; }
            const updatedaccessory = await accessory.save();
            return res.status(200).json({ success: true, message: "accessory updated successfully.", data: updatedaccessory });

        } catch (err) {
            console.error("Update collection Error:", err);
            return res.status(500).json({ success: false, message: "Failed to update accessory.", error: err.message });
        }
    });
};
// Get All Accessories
export const getAllaccessoryType = async (req, res) => {
    try {
        const accessory = await accessorytypeModel.find().sort({ createdAt: -1 });
        const count = await accessorytypeModel.countDocuments();
        return res.status(200).json({ success: true, message: "All accessory fetched successfully.", count: count, data: accessory });
    } catch (err) {
        console.error("Get Brands Error:", err); return res.status(500).json({ success: false, message: "Server error while fetching brands.", error: err.message });
    }
};
// Delete accessory
export const deleteAccessoryType = async (req, res) => {
    const { id } = req.params;
    try {
        const accessory = await accessorytypeModel.findByIdAndDelete(id);
        if (!accessory) {
            return res.status(404).json({ success: false, message: " accessory not found." });
        }
        return res.status(200).json({ success: true, message: " accessory deleted successfully.", });
    } catch (err) {
        console.error("Delete unit Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting" })
    }
};
// Update accessory Status
export const updateAccessoryTypeStatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "accessory ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const accessory = await accessorytypeModel.findById(id);
        if (!accessory) {
            return res.status(404).json({ success: false, message: "accessory not found." });
        }
        accessory.status = status;
        const updatedaccessory = await accessory.save();
        return res.status(200).json({ success: true, message: "accessory status updated successfully.", data: updatedaccessory });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// Get accessoriesType with Accessory ::
export const getAllAccessoryTypeWithAccessory = async (req, res) => {
    try {
        const accessoryType = await accessorytypeModel.aggregate([
            {
                $lookup: {
                    from: "accessoryschemas",
                    localField: "name",
                    foreignField: "selectAccessoryType",
                    as: "accessoryschemas"
                }
            },
            {
                $lookup: {
                    from: "priceschemas",
                    localField: "accessoryschemas._id",
                    foreignField: "accessoryId",
                    as: "allPrices"
                }
            },
            {
                $addFields: {
                    accessoryschemas: {
                        $map: {
                            input: "$accessoryschemas",
                            as: "acc",
                            in: {
                                $mergeObjects: [
                                    "$$acc",
                                    {
                                        prices: {
                                            $filter: {
                                                input: "$allPrices",
                                                as: "p",
                                                cond: { $eq: ["$$p.accessoryId", "$$acc._id"] }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    productCount: { $size: "$accessoryschemas" }
                }
            },
            {
                $project: { allPrices: 0 }
            },
            { $sort: { createdAt: -1 } }
        ]);
        return res.status(200).json({ success: true, message: "Accessory type fetched successfully", data: accessoryType });
    } catch (err) {
        console.error("Get Accessory Type Error:", err);
        return res.status(500).json({ success: false, message: "Server error while fetching accessory types.", error: err.message });
    }
};

