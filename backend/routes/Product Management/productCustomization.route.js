import { addCustomization, deleteCustomization, getAllCustomization, getSingleCustomization } from "../../controllers/Product Management/productCustomization.controller.js";
import { auth } from "../../middlewares/auth.middleware.js"
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
    app.post('/api/add/prodcut/customization/user', addCustomization)
    app.get('/api/get/all//product/customization/admin', auth, getAllCustomization)
    app.get('/api/get/product/customization/admin/:id', auth, getSingleCustomization)
    app.delete('/api/delete/customization/admin/:id', auth, deleteCustomization)
}
