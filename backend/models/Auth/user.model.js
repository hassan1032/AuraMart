import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    userId:        { type: String, default: '' },
    name:          { type: String, default: '', trim: true },
    firstName:     { type: String, default: '', trim: true },
    lastName:      { type: String, default: '', trim: true },
    dob:           { type: String, default: '' },
    gender:        { type: String, enum: ['male', 'female', 'other', 'prefer_not', ''], default: '' },
    email:         { type: String, lowercase: true, trim: true, default: '' },
    contact:       { type: String, trim: true, default: '' },
    countryCode:   { type: String, default: '+91' },
    // password is optional (OTP-only users won't have one)
    password:      { type: String, select: false },
    profilePic:    { type: String, default: '' },
    url:           { type: String, default: '' },
    provider:      { type: String, enum: ['google', 'facebook', 'apple', 'manual'], default: 'manual' },
    providerId:    { type: String, default: '' },
    role:          { type: String, enum: ['User', 'Admin'], default: 'User' },
    OTP:           { type: String, default: null },
    otpExpiry:     { type: Date,   default: null },
    isVerified:    { type: Boolean, default: false },
}, { versionKey: false, timestamps: true });

// Sparse indexes: allow multiple docs with empty string / null without unique conflicts
userSchema.index({ email:   1 }, { sparse: true });
userSchema.index({ contact: 1 }, { sparse: true });

// Hash password only when it has been set / changed
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance helper — compare plaintext vs stored hash
userSchema.methods.comparePassword = function (plaintext) {
    return bcrypt.compare(plaintext, this.password);
};

export default model('auth', userSchema);
