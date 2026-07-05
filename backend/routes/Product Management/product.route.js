
import { addProduct, deleteProduct, generateBarcodeLabels, generateSKU, getAllProduct, getFiltered, getFilteredProducts, getproductById, getProductByUser, setDefaultColor, updatedproductstatus, updateProduct } from "../../controllers/Product Management/product.controller.js";
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
    app.post('/api/add/product/admin', auth, addProduct)
    app.put('/api/update/product/admin/:id', auth, updateProduct)
    app.get('/api/get/all/product/admin', getAllProduct)
    app.get('/api/get/filter/product/admin', getFilteredProducts)
    app.get('/api/get/filter/product/user', getFiltered)
    app.get('/api/get/single/product/by/user', getProductByUser)
    app.post('/api/get/single/product/by/user', getProductByUser)
    app.get('/api/get/single/product/admin/:id', auth, getproductById)
    app.put('/api/update/product/status/admin', auth, updatedproductstatus)
    app.delete('/api/delete/product/admin/:id', auth, deleteProduct)
    app.post('/api/genrate/sku/code/admin', auth, generateSKU)
    app.post('/api/default/image/product/admin', setDefaultColor)
    app.post('/api/genrate/product/barcode/admin/:id', auth, generateBarcodeLabels)

}
