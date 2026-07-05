import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const appConfig = new Schema({
    userSr: { type: Number, default: 11000 },
    adminSr: { type: Number, default: 100000 },
},
    { versionKey: false, timestamps: true });

export default model('appConfig', appConfig);
