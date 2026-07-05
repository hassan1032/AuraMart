import mongoose from "mongoose";
const { Schema, model } = mongoose;

const paymentLogSchema = new Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orderSchema" },
    stripeSessionId: String,
    paymentIntentId: String,
    amount: Number,
    currency: String,
    status: String,
    rawEvent: Schema.Types.Mixed,
}, { timestamps: true });

export default model("paymentLog", paymentLogSchema);
