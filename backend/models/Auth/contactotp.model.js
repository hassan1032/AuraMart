import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const contactVerification = new Schema({
    contact: { type: String, trim: true },
    OTP: { type: String },
    otpExpiry: { type: Date },
    contactVerified: { type: Boolean, default: false },
},
    { versionKey: false, timestamps: true });

export default model('contactVerification', contactVerification);
