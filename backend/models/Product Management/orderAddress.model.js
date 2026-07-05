import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
    name: { type: String, default: "" },
    contact: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    addressLine: { type: String, default: "" },
    provinceState: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    addressType: {
        type: String,
        enum: ["Home", "Work", "Other"],
        default: "Home"
    },

    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("address", addressSchema);
