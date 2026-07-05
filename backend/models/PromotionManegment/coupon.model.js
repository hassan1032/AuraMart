import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const couponSchema = new Schema({
    couponCode: { type: String, default: '' },
    discountType: { type: String, default: '' },
    discount: { type: String, default: '' },
    minimumOrderAmount: { type: String, default: '' },
    limitSingleUser: { type: String, default: '' },
    maximumDiscountAmount: { type: String, default: '' },
    startDate: { type: String, default: '' },
    expiredDate: { type: String, default: '' },
    startTime: { type: String, default: '' },
    expiredTime: { type: String, default: '' },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });

export default model('couponSchema', couponSchema);
