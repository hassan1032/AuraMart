
import { createModule, deleteModule, getAllModules, } from "../../controllers/Role Permission/module.controller.js";
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
    app.post('/api/add/module/admin', auth, createModule)
    app.get('/api/get/all/module/admin', getAllModules)
    app.delete('/api/delete/module/admin/:id', auth, deleteModule)
}
