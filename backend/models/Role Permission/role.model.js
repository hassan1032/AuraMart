import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const roleSchema = new Schema(
    {
        roleName: { type: String, unique: true },
        role: { type: Types.ObjectId, ref: "role" },
        permissions: [
            {
                _id: false,

                module: { type: Types.ObjectId, ref: "Module" },
                name: { type: String },
                isVisible: { type: Boolean },
                actions: [
                    {
                        name: { type: String },
                        allowed: { type: Boolean },
                        _id: false
                    }
                ]
            }
        ]
    },
    { timestamps: true, versionKey: false }
);

export default model("Role", roleSchema);
