import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "productSchema" },
    accessoryId: { type: mongoose.Schema.Types.ObjectId, ref: "accessorySchema" },
    priceId: { type: mongoose.Schema.Types.ObjectId, ref: "priceSchema", required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, },
    totalPrice: { type: Number, },
    selectedSize: { type: String, },
    selectedColor: { type: String, },
    trackingNumber: { type: String, default: null, },
    productSnapshot: {
        name:     { type: String, default: '' },
        image:    { type: String, default: '' },
        slug:     { type: String, default: '' },
        category: { type: String, default: '' },
    },
    _id: false
});

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
        orderCode: { type: String, unique: true, },
        orderUrl: { type: String, unique: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, },
        shippingAddress: {
            name: { type: String, },
            phone: { type: String, },
            email: { type: String },
            addressLine: { type: String, },
            countryCode: { type: String },
            city: { type: String, },
            state: { type: String },
            postalCode: { type: String },
            country: { type: String },
            addressType: { type: String }
        },
        detectedCountry: { type: String },
        status: {
            type: String,
            enum: ["pending", "confirmed", "processing", "pickup", "on_the_way", "delivered", "cancelled"], default: "pending"
        },
        paymentStatus:     { type: String, enum: ["notPaid", "paid", "failed"], default: "notPaid" },
        paymentMethod:     { type: String, enum: ["cod", "razorpay"], default: "cod" },
        razorpayPaymentId: { type: String, default: null },
    },
    { timestamps: true }
);

export default mongoose.model("orderSchema", orderSchema);
