import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "auth" },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "productSchema" },
                addedAt: { type: Date, default: Date.now },
                _id: false
            },

        ],
        accessories: [
            {
                accessoryId: { type: mongoose.Schema.Types.ObjectId, ref: "accessorySchema" },
                addedAt: { type: Date, default: Date.now },
                _id: false
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("wishlistSchema", wishlistSchema);
