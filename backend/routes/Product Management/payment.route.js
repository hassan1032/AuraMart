import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../controllers/Product Management/payment.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';

export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        next();
    });

    // Razorpay: step 1 — create Razorpay order (returns orderId + amount to frontend)
    app.post('/api/razorpay/create/order',   express.json(), auth, createRazorpayOrder);
    // Razorpay: step 2 — verify payment signature + create DB order
    app.post('/api/razorpay/verify/payment', express.json(), auth, verifyRazorpayPayment);
};
