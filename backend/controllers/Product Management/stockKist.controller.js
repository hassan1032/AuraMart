import stockKistModel from '../../models/Product Management/stockKist.model.js'
import { IncomingForm } from 'formidable';

// Add Stock list :::
export const addStockKist = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const name = fields.name?.[0]?.trim();
        const email = fields.email?.[0]?.trim();
        const website = fields.website?.[0]?.trim();
        const shopName = fields.shopName?.[0]?.trim();
        const country = fields.country?.[0]?.trim();
        const address = fields.Address?.[0]?.trim();
        const city = fields.city?.[0]?.trim();
        try {
            const newStock = new stockKistModel({ name, email, website, shopName, country, address, city });
            const savedStock = await newStock.save();
            return res.status(201).json({ success: true, message: "StockKist added successfully.", data: savedStock });
        } catch (err) {
            console.error("Add StockKist Error:", err);
            return res.status(500).json({ success: false, message: "Failed to add stockKist.", error: err.message });
        }
    });
};
// update Stock list ::
export const updateStockKist = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const stockId = req.params.id;
        if (!stockId) {
            return res.status(400).json({ success: false, message: "Stock ID is required." });
        }
        try {
            const existingStock = await stockKistModel.findById(stockId);
            if (!existingStock) {
                return res.status(404).json({ success: false, message: "StockKist not found." });
            }
            const updateData = {};
            const fieldNames = ["name", "email", "website", "shopName", "county", "Address", "city"];
            fieldNames.forEach(field => {
                if (fields[field] && fields[field][0]?.trim() !== "") {
                    updateData[field.toLowerCase()] = fields[field][0].trim();
                }
            });
            const updatedStock = await stockKistModel.findByIdAndUpdate(stockId, { $set: updateData }, { new: true, runValidators: true });
            return res.status(200).json({ success: true, message: "StockKist updated successfully.", data: updatedStock });
        } catch (err) {
            console.error("Update Stocklist Error:", err);
            return res.status(500).json({ success: false, message: "Failed to update stockKist.", error: err.message });
        }
    });
};
// Get All stock list ::
export const getAllStockKist = async (req, res) => {
    try {
        const stockKist = await stockKistModel.find().sort({ createdAt: -1 });
        const count = await stockKistModel.countDocuments();
        return res.status(200).json({ success: true, message: "All stockKist fetched successfully.", count: count, data: stockKist });
    } catch (err) {
        console.error("Get Product Error:", err); return res.status(500).json({ success: false, message: "Server error while fetching Stckkist.", error: err.message });
    }
};
// Delete Stock List ::
export const deletestockKist = async (req, res) => {
    const { id } = req.params;
    try {
        const stockKist = await stockKistModel.findByIdAndDelete(id);
        if (!stockKist) {
            return res.status(404).json({ success: false, message: " stockKist not found." });
        }
        return res.status(200).json({ success: true, message: " stockKist deleted successfully.", });
    } catch (err) {
        console.error("Delete unit Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting" })
    }
};
// update stock List Status ::
export const updatedstockKiststatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: " stock list ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const stockKist = await stockKistModel.findById(id);
        if (!stockKist) {
            return res.status(404).json({ success: false, message: " stock Kist not found." });
        }
        stockKist.status = status;
        const updatedStockist = await stockKist.save();
        return res.status(200).json({ success: true, message: "stock Kist status updated successfully.", data: updatedStockist });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};