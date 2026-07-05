import orderModel from "../../models/Product Management/order.model.js";
import mongoose from "mongoose";

const VALID_STATUSES = ['pending', 'confirmed', 'processing', 'pickup', 'on_the_way', 'delivered', 'cancelled'];

// ─── Get All Orders with Filters (admin) ─────────────────────────────────
// Query params: status, search (orderCode), page, limit
export const getAdminOrders = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const matchStage = {};
        if (status && VALID_STATUSES.includes(status)) matchStage.status = status;
        if (search) matchStage.orderCode = { $regex: search.trim(), $options: 'i' };

        const [orders, total] = await Promise.all([
            orderModel.aggregate([
                { $match: matchStage },
                { $lookup: { from: 'auths', localField: 'userId', foreignField: '_id', as: 'user' } },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                { $lookup: { from: 'productschemas',   localField: 'items.productId',   foreignField: '_id', as: 'products' } },
                { $lookup: { from: 'accessoryschemas', localField: 'items.accessoryId', foreignField: '_id', as: 'accessories' } },
                {
                    $project: {
                        orderCode: 1, orderUrl: 1, totalAmount: 1,
                        shippingAddress: 1, status: 1, paymentStatus: 1,
                        createdAt: 1, itemCount: { $size: '$items' },
                        user: { name: 1, email: 1, contact: 1 },
                        products: { productName: 1 },
                        accessories: { accessoryName: 1 },
                    },
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: parseInt(limit) },
            ]),
            orderModel.countDocuments(matchStage),
        ]);

        return res.status(200).json({
            success: true, total, page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: orders,
        });
    } catch (err) {
        console.error('getAdminOrders Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Get Single Order Detail (admin) ─────────────────────────────────────
export const getAdminOrderDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const matchCondition = mongoose.Types.ObjectId.isValid(id)
            ? { _id: new mongoose.Types.ObjectId(id) }
            : { orderUrl: id };

        const result = await orderModel.aggregate([
            { $match: matchCondition },
            { $lookup: { from: 'auths',            localField: 'userId',            foreignField: '_id', as: 'user' } },
            { $lookup: { from: 'productschemas',   localField: 'items.productId',   foreignField: '_id', as: 'products' } },
            { $lookup: { from: 'accessoryschemas', localField: 'items.accessoryId', foreignField: '_id', as: 'accessories' } },
            { $lookup: { from: 'priceschemas',     localField: 'items.priceId',     foreignField: '_id', as: 'prices' } },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
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
        ]);

        if (!result.length) return res.status(404).json({ success: false, message: 'Order not found.' });
        return res.status(200).json({ success: true, data: result[0] });
    } catch (err) {
        console.error('getAdminOrderDetail Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Update Order Status (admin) ──────────────────────────────────────────
// PUT /api/admin/order/status/:id  body: { status }
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ success: false, message: 'status is required.' });
        if (!VALID_STATUSES.includes(status))
            return res.status(400).json({ success: false, message: `Invalid status. Valid values: ${VALID_STATUSES.join(', ')}` });

        const order = await orderModel.findByIdAndUpdate(
            id, { status }, { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

        return res.status(200).json({ success: true, message: `Order status updated to "${status}".`, data: order });
    } catch (err) {
        console.error('updateOrderStatus Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Order Stats for Dashboard (admin) ───────────────────────────────────
export const getOrderStats = async (req, res) => {
    try {
        const stats = await orderModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                },
            },
        ]);

        const totalOrders  = await orderModel.countDocuments();
        const totalRevenue = await orderModel.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);

        const byStatus = {};
        for (const s of stats) byStatus[s._id] = { count: s.count, revenue: s.revenue };

        return res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                byStatus,
            },
        });
    } catch (err) {
        console.error('getOrderStats Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};
