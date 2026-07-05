
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema, model } = mongoose;
const employee = new Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    contact: { type: String, trim: true, default: '' },
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    password: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    OTP: { type: String, default: '' },
    otpExpiry: { type: Date, default: null },
},
    { versionKey: false, timestamps: true });
employee.index();
employee.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
employee.methods.comparePassword = function (confirmPassword) {
    return bcrypt.compare(confirmPassword, this.password);
};
employee.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
};

export default model('employee', employee);