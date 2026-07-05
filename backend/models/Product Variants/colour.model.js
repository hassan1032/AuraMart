import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const colourSchema = new Schema({
    name: { type: String, },
    colour: { type: String, },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });

export default model('colourSchema', colourSchema);
