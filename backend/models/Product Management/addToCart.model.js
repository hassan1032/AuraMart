import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "productSchema" },
    accessoryId: { type: mongoose.Schema.Types.ObjectId, ref: "accessorySchema" },
    priceId: { type: mongoose.Schema.Types.ObjectId, ref: "PriceSchema", required: true },
    quantity: { type: Number, default: 1 },
    selectedSize: { type: String },
    selectedColor: { type: String },
}, { _id: true });
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
    items: [cartItemSchema],
}, { timestamps: true, versionKey: false });

export default mongoose.model("cartSchema", cartSchema);
