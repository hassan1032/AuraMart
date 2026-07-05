import Razorpay from 'razorpay';
import crypto from 'crypto';
import cartModel from '../../models/Product Management/addToCart.model.js';
import orderModel from '../../models/Product Management/order.model.js';
import { buildOrderItems } from './order.controller.js';
import { generateUniqueSlug } from '../../helpers/genrateSlug.helper.js';
import generateOrderCode from '../../helpers/genrateOrderCode.helper.js';
import getCountryFromLatLon from '../../helpers/location.helper.js';

const razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Create Razorpay Order (step 1 — requires auth) ──────────────────────
// Calculates the order amount server-side, creates a Razorpay order, and
// returns the order ID + amount so the frontend can open the checkout UI.
export const createRazorpayOrder = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const { type = 'cart', items: reqItems } = req.body;

        let itemsToPrice;
        if (type === 'buyNow') {
            if (!Array.isArray(reqItems) || reqItems.length === 0)
                return res.status(400).json({ success: false, message: 'items required for buyNow.' });
            itemsToPrice = reqItems;
        } else {
            const cart = await cartModel.findOne({ userId });
            if (!cart || cart.items.length === 0)
                return res.status(400).json({ success: false, message: 'Cart is empty.' });
            itemsToPrice = cart.items;
        }

        const { totalAmount } = await buildOrderItems(itemsToPrice);
        // Razorpay expects amount in paise (1 INR = 100 paise)
        const amountInPaise = Math.round(totalAmount * 100);

        const razorpayOrder = await razorpay.orders.create({
            amount:   amountInPaise,
            currency: 'INR',
            receipt:  `rcpt_${Date.now()}`,
        });

        return res.status(200).json({
            success:         true,
            razorpayOrderId: razorpayOrder.id,
            amount:          razorpayOrder.amount,
            currency:        razorpayOrder.currency,
            keyId:           process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        // Razorpay SDK throws plain objects (not Error instances) on API errors
        const msg = err?.error?.description || err?.message || 'Could not initiate payment.';
        const status = err?.statusCode || 500;
        console.error('createRazorpayOrder Error:', err);
        return res.status(status < 200 || status > 599 ? 500 : status).json({ success: false, message: msg });
    }
};

// ─── Verify Payment + Create DB Order (step 2 — requires auth) ───────────
// Verifies the HMAC-SHA256 signature from Razorpay, then creates the actual
// order document in MongoDB with paymentStatus: 'paid'.
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress,
            type = 'cart',
            items: reqItems,
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
            return res.status(400).json({ success: false, message: 'Missing Razorpay payment details.' });
        if (!shippingAddress)
            return res.status(400).json({ success: false, message: 'shippingAddress is required.' });

        // Prevent duplicate order creation for the same payment
        const duplicate = await orderModel.findOne({ razorpayPaymentId: razorpay_payment_id });
        if (duplicate)
            return res.status(200).json({ success: true, message: 'Order already created.', data: duplicate });

        // Verify signature: HMAC-SHA256 of "orderId|paymentId" using key_secret
        const expected = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expected !== razorpay_signature)
            return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });

        // Signature valid — build and persist the order
        let itemsToOrder;
        let clearCartAfter = false;

        if (type === 'buyNow') {
            if (!Array.isArray(reqItems) || reqItems.length === 0)
                return res.status(400).json({ success: false, message: 'items required for buyNow.' });
            itemsToOrder = reqItems;
        } else {
            const cart = await cartModel.findOne({ userId });
            if (!cart || cart.items.length === 0)
                return res.status(400).json({ success: false, message: 'Cart is empty.' });
            itemsToOrder = cart.items;
            clearCartAfter = true;
        }

        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        const detectedCountry = (!isNaN(lat) && !isNaN(lon)) ? getCountryFromLatLon(lat, lon) : null;

        const { orderItems, totalAmount } = await buildOrderItems(itemsToOrder);
        const orderCode = await generateOrderCode();
        const orderUrl  = await generateUniqueSlug(orderCode, orderModel, 'orderUrl');

        const newOrder = await orderModel.create({
            userId, items: orderItems, totalAmount, shippingAddress,
            orderCode, orderUrl, detectedCountry,
            status:            'confirmed',
            paymentStatus:     'paid',
            paymentMethod:     'razorpay',
            razorpayPaymentId: razorpay_payment_id,
        });

        if (clearCartAfter) {
            const cart = await cartModel.findOne({ userId });
            if (cart) { cart.items = []; await cart.save(); }
        }

        return res.status(201).json({ success: true, message: 'Payment verified. Order placed!', data: newOrder });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        const msg = err?.error?.description || err?.message || 'Server error.';
        console.error('verifyRazorpayPayment Error:', err);
        return res.status(500).json({ success: false, message: msg });
    }
};
