import { createDhlShipment, getTrackingByOrder, getTrackingByNumber, updateOrderStatus } from "../../controllers/Product Management/orderTrack.controller.js";

export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        res.header('Content-Type', 'application/json; charset=utf-8');
        next();
    });
    app.post('/api/create/track/order/user/:orderId', createDhlShipment)
    app.put('/api/update/status/order/admin/:orderId', updateOrderStatus)
    app.get('/api/get/track/order/user/:orderId', getTrackingByOrder)
    app.get('/api/get/track/number/user/:trackingNumber', getTrackingByNumber)

}
