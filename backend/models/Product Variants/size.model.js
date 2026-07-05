import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const sizeSchema = new Schema({
    name: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });

export default model('sizeSchema', sizeSchema);
