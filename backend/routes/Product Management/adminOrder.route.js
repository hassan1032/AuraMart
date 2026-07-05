import { getAdminOrders, getAdminOrderDetail, updateOrderStatus, getOrderStats } from "../../controllers/Product Management/adminOrder.controller.js";
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

    // GET  /api/admin/orders?status=confirmed&search=ORD&page=1&limit=20
    app.get('/api/admin/orders',                  auth, adminAuth, getAdminOrders);
    // GET  /api/admin/order/:id  (id or orderUrl slug)
    app.get('/api/admin/order/:id',               auth, adminAuth, getAdminOrderDetail);
    // PUT  /api/admin/order/status/:id  body: { status }
    app.put('/api/admin/order/status/:id',        auth, adminAuth, updateOrderStatus);
    // GET  /api/admin/orders/stats  — dashboard counts + revenue
    app.get('/api/admin/orders/stats',            auth, adminAuth, getOrderStats);
};
