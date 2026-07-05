import mongoose from 'mongoose';
const { Schema, Types, model } = mongoose;

const accessorySchema = new Schema({
    accessoryName: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    detailedDescription: { type: String, default: '' },
    additionalInformation: { type: String, default: '' },
    selectSize: { type: [String], default: [] },
    selectColor: [{ color: { type: String, }, code: { type: String }, _id: false }],
    selectAccessoryType: { type: [String], default: [] },
    accessorySKU: { type: String, default: '' },
    url: { type: String, },
    colorImages: [
        {
            color: { type: String, default: "" },
            code: { type: String, default: "" },
            accessoryThumbnail: { type: String, default: "" },
            additionalThumbnail: { type: [String], default: [] },
            isDefault: { type: Boolean, default: false },
            video: { type: String, default: "" },
            _id: false
        }
    ],
    product: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "productSchemas" },
            name: { type: String },
            _id: false
        }
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" }
},
    { versionKey: false, timestamps: true });

export default model('accessorySchema', accessorySchema);
