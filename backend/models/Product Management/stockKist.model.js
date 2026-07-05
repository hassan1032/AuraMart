import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const stockKist = new Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    shopName: { type: String, default: '' },
    country: { type: String, default: '' },
    Address: { type: String, default: '' },
    city: { type: String, default: '' },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });
export default model('stockKist', stockKist);
