import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const productSchema = new Schema({
    productName: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    detailedDescription: { type: String, default: '' },
    selectCollection: { type: [String], default: [] },
    additionalInformation: { type: String, default: '' },
    selectColor: [{ color: { type: String, }, code: { type: String }, _id: false }],
    selectSize: { type: [String], default: [] },
    productSKU: { type: String, default: '' },
    url: { type: String, },
    colorImages: [
        {
            color: { type: String, default: "" },
            code: { type: String, default: "" },
            thumbnail: { type: String, default: "" },
            additionalThumbnail: { type: [String], default: [] },
            isDefault: { type: Boolean, default: false },
            video: { type: String, default: "" },
            _id: false
        }
    ],
    accessories: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "accessorySchema" },
            name: { type: String },
            _id: false
        }
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });

export default model('productSchema', productSchema);
