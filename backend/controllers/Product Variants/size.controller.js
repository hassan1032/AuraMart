import sizeModel from "../../models/Product Variants/size.model.js";
import { IncomingForm } from 'formidable';
// Add size
export const addSize = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form data parsing error.", error: error.message });
        }
        const requiredFields = ['name'];
        for (const field of requiredFields) {
            if (!fields[field] || !fields[field][0]) {
                return res.status(400).json({ success: false, message: `${field} is required.` });
            }
        }
        const name = fields.name?.[0]?.trim();
        try {
            const newSize = new sizeModel({ name });
            const savedsize = await newSize.save();
            return res.status(201).json({ success: true, message: "Size add successfully.", data: savedsize });
        } catch (err) {
            console.error("Add Brand Error:", err);
            return res.status(500).json({ success: false, message: " Size add failed.", error: err.message });
        }
    });
};
// Update size
export const updateSize = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: "Size ID is required." });
    }
    const form = new IncomingForm();
    form.parse(req, async (error, fields) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parsing error.", error: error.message });
        }
        const name = fields.name?.[0]?.trim();
        try {
            const sizeDoc = await sizeModel.findById(id);
            if (!sizeDoc) {
                return res.status(404).json({ success: false, message: "sizeId not found." });
            }
            if (name) sizeDoc.name = name;
            const updated = await sizeDoc.save();
            return res.status(200).json({ success: true, message: "size updated successfully.", data: updated });
        } catch (err) {
            console.error("Update Colour Error:", err);
            return res.status(500).json({ success: false, message: "Update failed.", error: err.message });
        }
    });
};
// update Status size
export const updatesizeStatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "size ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const size = await sizeModel.findById(id);
        if (!size) {
            return res.status(404).json({ success: false, message: " size not found." });
        }
        size.status = status;
        const updatedsize = await size.save();
        return res.status(200).json({ success: true, message: "size status updated successfully.", data: updatedsize });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// Get All Brand 
export const getAllsize = async (req, res) => {
    try {
        const size = await sizeModel.find().sort({ createdAt: -1 });
        const count = await sizeModel.countDocuments();
        return res.status(200).json({ success: true, message: " size fetched successfully.", count: count, data: size });
    } catch (err) {
        console.error("Get size Error:", err); return res.status(500).json({ success: false, message: "Server error while fetching size.", error: err.message });
    }
};
// Delete size
export const deletesize = async (req, res) => {
    const { id } = req.params;
    try {
        const size = await sizeModel.findByIdAndDelete(id);
        if (!size) {
            return res.status(404).json({ success: false, message: "size not found." });
        }
        return res.status(200).json({ success: true, message: " size deleted successfully." });
    } catch (err) {
        console.error("Delete unit Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting" })
    }
};