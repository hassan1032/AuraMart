import colourModel from "../../models/Product Variants/colour.model.js";
import { IncomingForm } from 'formidable';
// Add colour
export const addColour = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form data parsing error.", error: error.message });
        }
        const requiredFields = ['name', 'colour'];
        for (const field of requiredFields) {
            if (!fields[field] || !fields[field][0]) {
                return res.status(400).json({ success: false, message: `${field} is required.` });
            }
        }
        const name = fields.name?.[0]?.trim();
        const colour = fields.colour?.[0]?.trim();
        try {
            const newcolour = new colourModel({ name, colour });
            const savedcolour = await newcolour.save();
            return res.status(201).json({ success: true, message: "colour add successfully.", data: savedcolour });
        } catch (err) {
            console.error("Add Brand Error:", err);
            return res.status(500).json({ success: false, message: "colour add failed.", error: err.message });
        }
    });
};
// Update colour
export const updatecolour = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: "Colour ID is required." });
    }
    const form = new IncomingForm();
    form.parse(req, async (error, fields) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parsing error.", error: error.message });
        }
        const name = fields.name?.[0]?.trim();
        const colour = fields.colour?.[0]?.trim();
        try {
            const colourDoc = await colourModel.findById(id);
            if (!colourDoc) {
                return res.status(404).json({ success: false, message: "ColourId not found." });
            }
            if (name) colourDoc.name = name;
            if (colour) colourDoc.colour = colour;
            const updated = await colourDoc.save();
            return res.status(200).json({ success: true, message: "Colour updated successfully.", data: updated });
        } catch (err) {
            console.error("Update Colour Error:", err);
            return res.status(500).json({ success: false, message: "Update failed.", error: err.message });
        }
    });
};
// update Status colour
export const updatecolourStatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "colour ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const colour = await colourModel.findById(id);
        if (!colour) {
            return res.status(404).json({ success: false, message: "colour not found." });
        }
        colour.status = status;
        const updatedColour = await colour.save();
        return res.status(200).json({ success: true, message: "colour status updated successfully.", data: updatedColour });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// Get All colour 
export const getAllcolour = async (req, res) => {
    try {
        const colour = await colourModel.find().sort({ createdAt: -1 });
        const count = await colourModel.countDocuments();
        return res.status(200).json({ success: true, message: "colour fetched successfully.", count: count, data: colour });
    } catch (err) {
        console.error("Get Brands Error:", err); return res.status(500).json({ success: false, message: "Server error while fetching brands.", error: err.message });
    }
};
// Delete colour
export const deleteColour = async (req, res) => {
    const { id } = req.params;
    try {
        const colour = await colourModel.findByIdAndDelete(id);
        if (!colour) {
            return res.status(404).json({ success: false, message: " colour not found." });
        }
        return res.status(200).json({ success: true, message: " colour deleted successfully." });
    } catch (err) {
        console.error("Delete unit Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting" })
    }
};