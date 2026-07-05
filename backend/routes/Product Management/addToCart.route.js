import { addToCart, clearCart, getCart, mergeCart, removeFromCart } from "../../controllers/Product Management/addToCart.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";

export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        next();
    });

    // All cart DB operations require the user to be logged in.
    // Guest cart lives in localStorage on the frontend; call /merge after login.
    app.post('/api/add/cart/product/user',    auth, addToCart);
    app.get('/api/get/all/cart/product/user', auth, getCart);
    app.post('/api/remove/cart/product/user', auth, removeFromCart);
    app.post('/api/clear/cart/product/user',  auth, clearCart);
    app.post('/api/merge/cart/product/user',  auth, mergeCart);
};
