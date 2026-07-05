import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
    name: { type: String, },
    allowed: { type: Boolean, default: false },
}, { _id: false });
const moduleSchema = new mongoose.Schema(
    {
        name: { type: String, },
        isVisible: { type: Boolean, default: false },
        actions: [actionSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Module", moduleSchema);