import bannerModel from "../../models/PromotionManegment/banner.model.js";
import { IncomingForm } from 'formidable';
import { upload } from '../../helpers/aws.helpers.js'

// Add banner ::
export const addbanner = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const requiredFields = ['columnName', 'description', 'Heading', 'buttonName', 'buttonLink'];
        for (const field of requiredFields) {
            if (!fields[field] || fields[field][0].trim() === '') {
                return res.status(400).json({ success: false, message: `${field} is required.` });
            }
        }
        const columnName = fields.columnName?.[0]?.trim();
        const Heading = fields.Heading?.[0]?.trim();
        const buttonName = fields.buttonName?.[0]?.trim();
        const description = fields.description?.[0]?.trim();
        const buttonLink = fields.buttonLink?.[0]?.trim();
        files.image = files.thumbnail;
        if (!files.thumbnail) {
            return res.status(400).json({ success: false, message: "Thumbnail is required." });
        }
        try {
            const thumbnailUrl = await upload(files);
            const newbanner = new bannerModel({
                columnName,
                Heading,
                buttonName,
                buttonLink,
                description,
                thumbnail: thumbnailUrl
            });
            const savedbanner = await newbanner.save();
            return res.status(201).json({ success: true, message: "Banner created successfully.", data: savedbanner });

        } catch (err) {
            console.error("Add banner Error:", err);
            return res.status(500).json({ success: false, message: "Failed to create banner.", error: err.message });
        }
    });
};
// Update banner ::
export const updatebanner = async (req, res) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const bannerId = req.params.id;
        if (!bannerId) {
            return res.status(400).json({ success: false, message: "Banner ID is required." });
        }
        try {
            const banner = await bannerModel.findById(bannerId);
            if (!banner) {
                return res.status(404).json({ success: false, message: "Banner not found." });
            }
            const updatableFields = ["columnName", "buttonName", "buttonLink", "Heading", "description"];
            updatableFields.forEach(field => {
                if (fields[field] && fields[field][0]?.trim()) {
                    banner[field] = fields[field][0].trim();
                }
            });
            if (files.thumbnail) {
                files.image = files.thumbnail;
                const thumbnailUrl = await upload(files);
                banner.thumbnail = thumbnailUrl;
            }
            const updatedBanner = await banner.save();
            return res.status(200).json({ success: true, message: "Banner updated successfully.", data: updatedBanner });
        } catch (err) {
            console.error("Update Banner Error:", err);
            return res.status(500).json({ success: false, message: "Failed to update banner.", error: err.message });
        }
    });
};
// Get All banner ::
export const getAllbanner = async (req, res) => {
    try {
        const banner = await bannerModel.find().sort({ createdAt: -1 });
        const count = await bannerModel.countDocuments();
        return res.status(200).json({ success: true, message: "All banner fetched successfully.", count: count, data: banner });
    } catch (err) {
        console.error("Get coupon Error:", err); return res.status(500).json({ success: false, message: "Server error while fetching coupon.", error: err.message });
    }
};
// Delete banner ::
export const deletebanner = (req, res) => {
    const bannerId = req.params.id;
    bannerModel.findByIdAndDelete(bannerId).then((deletedbanner) => {
        if (!deletedbanner) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({ success: true, message: " banner Deleted Successfully!" });
    })
        .catch((error) => {
            console.error('Error while deleting user:', error);
            res.status(500).json({ success: false, message: "An unexpected error occurred." });
        });
};
// Update banner Status ::
export const updatedbannerstatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "banner ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const banner = await bannerModel.findById(id);
        if (!banner) {
            return res.status(404).json({ success: false, message: "banner not found." });
        }
        banner.status = status;
        const updatedbanner = await banner.save();
        return res.status(200).json({ success: true, message: "banner status updated successfully.", data: updatedbanner });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
