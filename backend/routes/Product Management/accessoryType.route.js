
import { addAccessoryType, deleteAccessoryType, getAllaccessoryType, getAllAccessoryTypeWithAccessory, updateAccessoryType, updateAccessoryTypeStatus } from "../../controllers/Product Management/accessoryType.controller.js";
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
    app.post('/api/add/accessory/type/admin', addAccessoryType)
    app.put('/api/update/accessory/type/admin/:id', auth, updateAccessoryType)
    app.get('/api/get/all/accessory/type/admin', getAllaccessoryType)
    app.get('/api/get/all/accessory/type/accessory/user', getAllAccessoryTypeWithAccessory)
    app.put('/api/update/accessory/type/status/admin', auth, updateAccessoryTypeStatus)
    app.delete('/api/delete/accessory/type/admin/:id', auth, deleteAccessoryType)
}
