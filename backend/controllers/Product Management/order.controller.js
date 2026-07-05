import orderModel from "../../models/Product Management/order.model.js";
import productModel from "../../models/Product Management/product.model.js";
import accessoryModel from "../../models/Product Management/accessory.model.js";
import priceModel from "../../models/Product Management/price.model.js";
import { generateUniqueSlug } from '../../helpers/genrateSlug.helper.js';
import authModel from "../../models/Auth/user.model.js";
import getCountryFromLatLon from "../../helpers/location.helper.js";
import generateOrderCode from "../../helpers/genrateOrderCode.helper.js";
import cartModel from "../../models/Product Management/addToCart.model.js";
import mongoose from "mongoose";

// ─── shared: build order items array from an items list ──────────────────
export async function buildOrderItems(items) {
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
        const { productId, accessoryId, priceId, quantity = 1, selectedSize, selectedColor } = item;
        const priceData = await priceModel.findById(priceId);
        if (!priceData) throw { status: 400, message: `Invalid priceId: ${priceId}` };

        const unitPrice  = priceData.sellingPrice;
        const totalPrice = unitPrice * quantity;
        totalAmount += totalPrice;

        // Save a snapshot so orders display correctly even if product is later changed/deleted
        const productSnapshot = { name: '', image: '', slug: '', category: '' };
        if (productId) {
            const prod = await productModel.findById(productId)
                .select('productName colorImages slug category').lean();
            if (prod) {
                productSnapshot.name     = prod.productName || '';
                productSnapshot.image    = prod.colorImages?.[0]?.thumbnail || '';
                productSnapshot.slug     = prod.slug || '';
                productSnapshot.category = prod.category || '';
            }
        } else if (accessoryId) {
            const acc = await accessoryModel.findById(accessoryId)
                .select('accessoryName colorImages').lean();
            if (acc) {
                productSnapshot.name  = acc.accessoryName || '';
                productSnapshot.image = acc.colorImages?.[0]?.accessoryThumbnail || '';
            }
        }

        orderItems.push({ productId, accessoryId, priceId, quantity, unitPrice, totalPrice, selectedSize, selectedColor, trackingNumber: null, productSnapshot });
    }
    return { orderItems, totalAmount };
}

// ─── Create Order (Buy Now — requires auth) ───────────────────────────────
export const createOrder = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required to place an order.' });

        const { items, shippingAddress } = req.body;
        if (!items || items.length === 0)
            return res.status(400).json({ success: false, message: 'No items in order.' });
        if (!shippingAddress)
            return res.status(400).json({ success: false, message: 'shippingAddress is required.' });

        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        const detectedCountry = (!isNaN(lat) && !isNaN(lon)) ? getCountryFromLatLon(lat, lon) : null;

        const { orderItems, totalAmount } = await buildOrderItems(items);
        const orderCode = await generateOrderCode();
        const orderUrl  = await generateUniqueSlug(orderCode, orderModel, 'orderUrl');

        const newOrder = await orderModel.create({
            userId, items: orderItems, totalAmount, shippingAddress,
            orderCode, orderUrl, detectedCountry,
            status: 'confirmed',       // direct success — no payment gateway
            paymentStatus: 'notPaid',
        });

        return res.status(201).json({ success: true, message: 'Order placed successfully.', data: newOrder });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        console.error('Create Order Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Create Order from Cart (Place Order — requires auth) ─────────────────
export const createOrderFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required to place an order.' });

        const { shippingAddress } = req.body;
        if (!shippingAddress)
            return res.status(400).json({ success: false, message: 'shippingAddress is required.' });

        const cart = await cartModel.findOne({ userId });
        if (!cart || cart.items.length === 0)
            return res.status(400).json({ success: false, message: 'Cart is empty.' });

        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        const detectedCountry = (!isNaN(lat) && !isNaN(lon)) ? getCountryFromLatLon(lat, lon) : null;

        const { orderItems, totalAmount } = await buildOrderItems(cart.items);
        const orderCode = await generateOrderCode();
        const orderUrl  = await generateUniqueSlug(orderCode, orderModel, 'orderUrl');

        const newOrder = await orderModel.create({
            userId, items: orderItems, totalAmount, shippingAddress,
            orderCode, orderUrl, detectedCountry,
            status: 'confirmed',       // direct success — no payment gateway
            paymentStatus: 'notPaid',
        });

        // Clear cart after successful order
        cart.items = [];
        await cart.save();

        return res.status(201).json({ success: true, message: 'Order placed successfully from cart.', data: newOrder });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        console.error('Create Order From Cart Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Get User's Own Orders (requires auth) ────────────────────────────────
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const user = await authModel.findById(userId).lean();
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        const orders = await orderModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            // Primary lookups
            { $lookup: { from: 'productschemas',  localField: 'items.productId',   foreignField: '_id', as: 'productDetails'   } },
            { $lookup: { from: 'accessoryschemas', localField: 'items.accessoryId', foreignField: '_id', as: 'accessoryDetails' } },
            { $lookup: { from: 'priceschemas',     localField: 'items.priceId',     foreignField: '_id', as: 'priceDetails'     } },
            // Fallback: look up productschemas by accessoryId (handles old orders where productId
            // was incorrectly stored in the accessoryId field due to a legacy frontend bug)
            { $lookup: { from: 'productschemas', localField: 'items.accessoryId', foreignField: '_id', as: 'productFallback' } },
            {
                $addFields: {
                    items: {
                        $map: {
                            input: '$items', as: 'item',
                            in: {
                                $mergeObjects: ['$$item', {
                                    // Primary product match by productId; fall back to checking
                                    // productFallback (by accessoryId) for legacy broken records
                                    product: {
                                        $ifNull: [
                                            { $arrayElemAt: [{ $filter: { input: '$productDetails',  as: 'p', cond: { $eq: ['$$p._id', '$$item.productId']   } } }, 0] },
                                            { $arrayElemAt: [{ $filter: { input: '$productFallback', as: 'p', cond: { $eq: ['$$p._id', '$$item.accessoryId'] } } }, 0] },
                                        ],
                                    },
                                    accessory: { $arrayElemAt: [{ $filter: { input: '$accessoryDetails', as: 'a', cond: { $eq: ['$$a._id', '$$item.accessoryId'] } } }, 0] },
                                    price:     { $arrayElemAt: [{ $filter: { input: '$priceDetails',     as: 'r', cond: { $eq: ['$$r._id', '$$item.priceId']   } } }, 0] },
                                }],
                            },
                        },
                    },
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    _id: 1, orderCode: 1, orderUrl: 1, userId: 1,
                    items: 1, totalAmount: 1, shippingAddress: 1,
                    detectedCountry: 1, status: 1, paymentStatus: 1,
                    createdAt: 1, updatedAt: 1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            message: orders.length ? 'Orders fetched.' : 'No orders found.',
            user: { _id: user._id, name: user.name || '', email: user.email || '' },
            data: orders,
        });
    } catch (err) {
        console.error('GetUserOrders Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Cancel Order (user — requires auth + ownership) ─────────────────────
export const cancelOrder = async (req, res) => {
    try {
        const userId  = req.userId;
        const { orderId } = req.params;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const order = await orderModel.findOne({ _id: orderId, userId });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

        const cancellable = ['pending', 'confirmed'];
        if (!cancellable.includes((order.status || '').toLowerCase()))
            return res.status(400).json({ success: false, message: 'This order cannot be cancelled.' });

        order.status = 'cancelled';
        await order.save();
        return res.status(200).json({ success: true, message: 'Order cancelled successfully.', data: order });
    } catch (err) {
        console.error('cancelOrder Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Get All Orders — Admin (requires auth + adminAuth) ──────────────────
export const getAllOrders = async (req, res) => {
    try {
        const { status, search } = req.query;
        const matchStage = {};
        if (status) matchStage.status = status;
        if (search) matchStage.orderCode = { $regex: search, $options: 'i' };

        const orders = await orderModel.aggregate([
            { $match: matchStage },
            { $lookup: { from: 'auths', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'productschemas',  localField: 'items.productId',   foreignField: '_id', as: 'products' } },
            { $lookup: { from: 'accessoryschemas', localField: 'items.accessoryId', foreignField: '_id', as: 'accessories' } },
            { $lookup: { from: 'priceschemas',     localField: 'items.priceId',     foreignField: '_id', as: 'prices' } },
            {
                $project: {
                    orderCode: 1, orderUrl: 1, totalAmount: 1, shippingAddress: 1,
                    detectedCountry: 1, status: 1, paymentStatus: 1,
                    createdAt: 1, updatedAt: 1, items: 1,
                    products: 1, accessories: 1, prices: 1,
                    user: { name: 1, email: 1, contact: 1 },
                },
            },
            { $sort: { createdAt: -1 } },
        ]);

        return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        console.error('Get All Orders Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Get Single Order — Admin (requires auth + adminAuth) ─────────────────
export const getOrderById = async (req, res) => {
    try {
        const { idOrSlug } = req.body;
        if (!idOrSlug) return res.status(400).json({ success: false, message: 'Order ID or slug required.' });

        const matchCondition = mongoose.Types.ObjectId.isValid(idOrSlug)
            ? { _id: new mongoose.Types.ObjectId(idOrSlug) }
            : { orderUrl: idOrSlug };

        const order = await orderModel.aggregate([
            { $match: matchCondition },
            { $lookup: { from: 'auths', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'productschemas',  localField: 'items.productId',   foreignField: '_id', as: 'products' } },
            { $lookup: { from: 'accessoryschemas', localField: 'items.accessoryId', foreignField: '_id', as: 'accessories' } },
            { $lookup: { from: 'priceschemas',     localField: 'items.priceId',     foreignField: '_id', as: 'prices' } },
            {
                $addFields: {
                    items: {
                        $map: {
                            input: '$items', as: 'item',
                            in: {
                                $mergeObjects: ['$$item', {
                                    productData:   { $arrayElemAt: [{ $filter: { input: '$products',     as: 'p', cond: { $eq: ['$$p._id', '$$item.productId']   } } }, 0] },
                                    accessoryData: { $arrayElemAt: [{ $filter: { input: '$accessories',  as: 'a', cond: { $eq: ['$$a._id', '$$item.accessoryId'] } } }, 0] },
                                    priceData:     { $arrayElemAt: [{ $filter: { input: '$prices',       as: 'r', cond: { $eq: ['$$r._id', '$$item.priceId']     } } }, 0] },
                                }],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    orderCode: 1, orderUrl: 1, totalAmount: 1, shippingAddress: 1,
                    detectedCountry: 1, status: 1, paymentStatus: 1, createdAt: 1, items: 1,
                    user: { name: 1, email: 1, contact: 1 },
                },
            },
        ]);

        if (!order.length) return res.status(404).json({ success: false, message: 'Order not found.' });
        return res.status(200).json({ success: true, data: order[0] });
    } catch (err) {
        console.error('Get Order By ID Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};
