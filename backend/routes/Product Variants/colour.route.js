
import { addColour, deleteColour, getAllcolour, updatecolour, updatecolourStatus } from "../../controllers/Product Variants/colour.controller.js";
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
    app.post('/api/add/colour/admin', addColour)
    app.get('/api/get/all/colour/admin', getAllcolour)
    app.put('/api/update/colour/admin/:id', auth, updatecolour)
    app.put('/api/update/colour/status/admin', auth, updatecolourStatus)
    app.delete('/api/delete/colour/admin/:id', deleteColour)
}
