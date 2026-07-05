import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PriceSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'productSchema' },
    accessoryId: { type: Schema.Types.ObjectId, ref: 'accessorySchema', },
    buyingPrice: { type: Number, default1: 0 },
    sellingPrice: { type: Number, default: 0 },
    // discountPrice: { type: Number, default: 0 },
    stockQuantity: { type: Number, default: 0 },
    minimumQuantity: { type: Number, default: 1 },
    reservedQuantity: { type: Number, default: 0 },
    country: {
        type: String,
        enum: ["IND", "ITALY", "UK", "DUBAI"],
    },
    currency: { type: String, required: true }
}, {
    versionKey: false,
    timestamps: true
});

export default model('PriceSchema', PriceSchema);
