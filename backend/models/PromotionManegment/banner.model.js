import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bannerSchema = new Schema({
    columnName: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    Heading: { type: String, default: '' },
    description: { type: String, default: '' },
    buttonName: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });

export default model('bannerSchema', bannerSchema);
