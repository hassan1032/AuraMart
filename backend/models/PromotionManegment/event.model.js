import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const eventSchema = new Schema({
    title: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    description: { type: String, default: '' },
    date: { type: Date },
    location: { type: String, default: '' },
    url: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });

export default model('eventSchema', eventSchema);
