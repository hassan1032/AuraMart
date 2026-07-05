import { addToWishlist, getWishlist, removeFromWishlist, mergeWishlist } from "../../controllers/Product Management/whislist.controller.js";
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

    app.post('/api/add/whislist/product/user',    auth, addToWishlist);
    app.get('/api/get/all/whislist/product/user', auth, getWishlist);
    app.delete('/api/remove/whislist/product/user', auth, removeFromWishlist);
    // Merge guest localStorage wishlist into DB after login
    app.post('/api/merge/whislist/product/user',  auth, mergeWishlist);
};
