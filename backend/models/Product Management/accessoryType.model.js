import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AccessoryTypeSchema = new Schema({
    name: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    accessorybanner: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });

export default model('AccessoryTypeSchema', AccessoryTypeSchema);
