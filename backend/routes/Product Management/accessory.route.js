
import { addAccessory, deleteAccessory, generateBarcodeAccescory, getaccessoryById, getAccessoryByUser, getAllaccessory, getFilter, getFilteredAccessory, updateAccessory, updatedaccesorystatus } from "../../controllers/Product Management/accessory.controller.js";
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
    app.post('/api/add/accessory/admin', auth, addAccessory)
    app.post('/api/genrate/accessory/barcode/admin/:id', auth, generateBarcodeAccescory)
    app.get('/api/get/single/accessory/by/user', getAccessoryByUser)
    app.post('/api/get/single/accessory/by/user', getAccessoryByUser)
    app.put('/api/update/accessory/admin/:id', auth, updateAccessory)
    app.put('/api/update/accessory/status/admin', auth, updatedaccesorystatus)
    app.get('/api/get/all/accessory/admin', getAllaccessory)
    app.get('/api/get/filter/accessory/admin', auth, getFilteredAccessory)
    app.get('/api/get/filter/accessory/user', getFilter)
    app.get('/api/get/single/accessory/admin/:id', auth, getaccessoryById)
    app.delete('/api/delete/accessory/admin/:id', auth, deleteAccessory)
}
