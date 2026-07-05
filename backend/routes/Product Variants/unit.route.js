
import { addunit, deleteunit, getAllunit, updateunitStatus, updatunit } from "../../controllers/Product Variants/unit.controller.js";
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
    app.post('/api/add/unit/admin', auth, addunit)
    app.get('/api/get/all/unit/admin', auth, getAllunit)
    app.put('/api/update/unit/admin/:id', auth, updatunit)
    app.put('/api/update/unit/status/admin', auth, updateunitStatus)
    app.delete('/api/delete/unit/admin/:id', auth, deleteunit)
}
