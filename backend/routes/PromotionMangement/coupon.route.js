import { addCoupon, deletecoupon, getAllcoupon, updatedCoupon, updatedcouponstatus } from "../../controllers/PromotionManegement/coupon.controller.js";

//import { auth } from "../../middlewares/auth.middleware.js"
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
    app.post('/api/add/coupon/admin', addCoupon)
    app.put('/api/update/coupon/admin/:id', updatedCoupon)
    app.put('/api/update/status/coupon/admin', updatedcouponstatus)
    app.get('/api/get/all/coupon/admin', getAllcoupon)
    app.delete('/api/delete/coupon/admin/:id', deletecoupon)
}
