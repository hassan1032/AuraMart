import { createOrder, getAllOrders, getOrderById, getUserOrders, createOrderFromCart, cancelOrder } from "../../controllers/Product Management/order.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/adminAuth.middleware.js";

export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        next();
    });

    // User order endpoints — login required
    app.post('/api/create/order/user',      auth, createOrder);
    app.post('/api/create/order/cart/user', auth, createOrderFromCart);
    app.get('/api/get/order/by/user',       auth, getUserOrders);

    // Cancel order — user must own it
    app.patch('/api/cancel/order/user/:orderId', auth, cancelOrder);

    // Admin order endpoints — login + admin role required
    app.post('/api/get/single/order/admin', auth, adminAuth, getOrderById);
    app.get('/api/get/all/order/admin',     auth, adminAuth, getAllOrders);
};
