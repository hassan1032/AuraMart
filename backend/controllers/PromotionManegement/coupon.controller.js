import couponModel from "../../models/PromotionManegment/coupon.model.js";
import { IncomingForm } from 'formidable';

// Add Coupon
export const addCoupon = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const requiredFields = ['couponCode', 'discountType', 'discount', 'minimumOrderAmount', 'limitSingleUser', 'maximumDiscountAmount', 'startDate', 'expiredDate', 'startTime', 'expiredTime'];
        for (const field of requiredFields) {
            if (!fields[field] || fields[field][0].trim() === '') {
                return res.status(400).json({ success: false, message: `${field} is required.` });
            }
        }
        const couponCode = fields.couponCode?.[0]?.trim();
        const discountType = fields.discountType?.[0]?.trim();
        const discount = fields.discount?.[0].trim()
        const minimumOrderAmount = fields.minimumOrderAmount?.[0]?.trim()
        const limitSingleUser = fields.limitSingleUser?.[0]?.trim()
        const maximumDiscountAmount = fields.maximumDiscountAmount?.[0]?.trim()
        const startDate = fields.startDate?.[0]?.trim()
        const expiredDate = fields.expiredDate?.[0]?.trim()
        const startTime = fields.startTime?.[0]?.trim()
        const expiredTime = fields.expiredTime?.[0]?.trim()
        try {
            const newCoupon = new couponModel({
                couponCode,
                discountType,
                discount,
                minimumOrderAmount,
                limitSingleUser,
                maximumDiscountAmount,
                startDate,
                expiredDate,
                startTime,
                expiredTime

            });
            const savedCoupon = await newCoupon.save();
            return res.status(201).json({ success: true, message: "coupon created successfully.", data: savedCoupon });
        } catch (err) {
            console.error("Add banner Error:", err);
            return res.status(500).json({ success: false, message: "Failed to coupon category.", error: err.message });
        }
    });
};
// Update Coupon::
export const updatedCoupon = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Form parse error.", error: error.message });
        }
        const couponId = req.params.id;
        if (!couponId) {
            return res.status(400).json({ success: false, message: "coupon ID is required." });
        }
        const couponCode = fields.couponCode?.[0]?.trim();
        const discountType = fields.discountType?.[0].trim();
        const discount = fields.discount?.[0].trim();
        const minimumOrderAmount = fields.minimumOrderAmount?.[0]?.trim();
        const limitSingleUser = fields.limitSingleUser?.[0]?.trim();
        const maximumDiscountAmount = fields.maximumDiscountAmount?.[0]?.trim();
        const startDate = fields.startDate?.[0]?.trim();
        const expiredDate = fields.expiredDate?.[0]?.trim();
        const startTime = fields.startTime?.[0]?.trim();
        const expiredTime = fields.expiredTime?.[0]?.trim();
        try {
            const coupon = await couponModel.findById(couponId);
            if (!coupon) {
                return res.status(404).json({ success: false, message: "coupon not found." });
            }
            if (couponCode) coupon.couponCode = couponCode;
            if (discountType) coupon.discountType = discountType;
            if (discount) coupon.discount = discount
            if (minimumOrderAmount) coupon.minimumOrderAmount = minimumOrderAmount;
            if (limitSingleUser) coupon.limitSingleUser = limitSingleUser;
            if (maximumDiscountAmount) coupon.maximumDiscountAmount = maximumDiscountAmount;
            if (startDate) coupon.startDate = startDate;
            if (expiredDate) coupon.expiredDate = expiredDate;
            if (startTime) coupon.startTime = startTime;
            if (expiredTime) coupon.expiredTime = expiredTime;
            const updatedCoupon = await coupon.save();
            return res.status(200).json({ success: true, message: "coupon updated successfully.", data: updatedCoupon });

        } catch (err) {
            console.error("Update coupon Error:", err);
            return res.status(500).json({ success: false, message: "coupon update failed.", error: err.message });
        }
    });
};
// Get All Coupons
export const getAllcoupon = async (req, res) => {
    try {
        const coupon = await couponModel.find().sort({ createdAt: -1 });
        const count = await couponModel.countDocuments();
        return res.status(200).json({ success: true, message: "All coupon fetched successfully.", count: count, data: coupon });
    } catch (err) {
        console.error("Get banner Error:", err); return res.status(500).json({ success: false, message: "Server error while fetching coupon.", error: err.message });
    }
};
// update coupon status
export const updatedcouponstatus = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "coupon ID and status are required." });
    }
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value. Must be 'active' or 'inactive'." });
    }
    try {
        const coupon = await couponModel.findById(id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: "coupon not found." });
        }
        coupon.status = status;
        const updatedcoupon = await coupon.save();
        return res.status(200).json({ success: true, message: "coupon status updated successfully.", data: updatedcoupon });
    } catch (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// Delete coupon
export const deletecoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await couponModel.findByIdAndDelete(id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: "coupon not found." });
        }
        return res.status(200).json({
            success: true, message: "coupon deleted successfully."
        });
    } catch (err) {
        console.error("Delete coupon Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting" })
    }
};
