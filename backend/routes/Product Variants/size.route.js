
import { addSize, deletesize, getAllsize, updateSize, updatesizeStatus } from "../../controllers/Product Variants/size.controller.js";
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
    app.post('/api/add/size/admin', auth, addSize)
    app.get('/api/get/all/size/admin', getAllsize)
    app.put('/api/update/size/admin/:id', auth, updateSize)
    app.put('/api/update/size/status/admin', auth, updatesizeStatus)
    app.delete('/api/delete/size/admin/:id', auth, deletesize)
}
