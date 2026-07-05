import customizationModel from '../../models/Product Management/productCustomization.model.js'
import { IncomingForm } from 'formidable';
import mongoose from 'mongoose';

// Add Customization :::
export const addCustomization = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const name = fields.name?.[0]?.trim();
        const email = fields.email?.[0]?.trim()
        const contact = fields.contact?.[0]?.trim()
        const message = fields.contact?.[0]?.trim()
        const countryCode = fields.countryCode?.[0]?.trim()
        const productId = fields.productId?.[0].trim()
        try {
            const newCollection = new customizationModel({
                name,
                productId,
                email,
                contact,
                message,
                countryCode
            });
            const savedCollection = await newCollection.save();
            return res.status(201).json({ success: true, message: "Customization add successfully!", data: savedCollection });
        } catch (err) {
            console.error("Add Collection Error:", err);
            return res.status(500).json({ success: false, message: "Failed to add collection.", error: err.message });
        }
    });
};
// Get All Customization::
export const getAllCustomization = async (req, res) => {
    try {
        const customization = await customizationModel.find().sort({ createdAt: -1 });
        const count = await customizationModel.countDocuments();
        return res.status(200).json({ success: true, message: "All Customization fetched successfully.", count: count, data: customization });
    } catch (err) {
        console.error("Get customization Error:", err); return res.status(500).json({ success: false, message: "Server error while fetching Product.", error: err.message });
    }
};
// Get Single Customization ::
export const getSingleCustomization = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await customizationModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'productschemas',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'priceschemas',
                    let: { productId: "$productId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$productId", "$$productId"]
                                }
                            }
                        }
                    ],
                    as: 'prices'
                }
            }
        ]);
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Customization not found." });
        }
        return res.status(200).json({ success: true, message: "Customization fetched successfully.", data: data[0] });
    } catch (err) {
        console.error("Get single customization error:", err);
        return res.status(500).json({ success: false, message: "Server error while fetching customization.", error: err.message });
    }
};
// Delete Customization :::
export const deleteCustomization = async (req, res) => {
    const { id } = req.params;
    try {
        const customization = await customizationModel.findByIdAndDelete(id);
        if (!customization) {
            return res.status(404).json({ success: false, message: "customization not found." });
        }
        return res.status(200).json({ success: true, message: "Deleted successfully!" });
    } catch (err) {
        console.error("Delete Product Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting customization", error: err.message });
    }
};
