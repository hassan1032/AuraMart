import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ProductCustomization = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'productSchema' },
    name: { type: String, default1: '' },
    email: { type: String, default: '' },
    contact: { type: String, default: '' },
    countryCode: { type: String, default: '' },
    message: { type: String, default: '' },
}, { versionKey: false, timestamps: true });

export default model('ProductCustomization', ProductCustomization);
