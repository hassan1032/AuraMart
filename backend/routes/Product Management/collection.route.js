import { addCollection, deleteCollection, getAllCollection, getAllCollectionWithProductCount, updateCollection, updatedcollectionstatus } from "../../controllers/Product Management/collection.controller.js";
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
    app.post('/api/add/collection/admin', addCollection)
    app.put('/api/update/collection/admin/:id', auth, updateCollection)
    app.get('/api/get/all/collection/admin', getAllCollection)
    app.get('/api/get/collection/product/user', getAllCollectionWithProductCount)
    app.put('/api/update/collection/status/admin', auth, updatedcollectionstatus)
    app.delete('/api/delete/collection/admin/:id', auth, deleteCollection)
}
