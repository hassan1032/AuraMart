
import { addStockKist, deletestockKist, getAllStockKist, updatedstockKiststatus, updateStockKist } from "../../controllers/Product Management/stockKist.controller.js";
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
    app.post('/api/add/stock/kist/admin', auth, addStockKist)
    app.put('/api/update/stock/kist/admin/:id', auth, updateStockKist)
    app.get('/api/get/all/stock/kist/admin', getAllStockKist)
    app.put('/api/update/stock/kist/status/admin', auth, updatedstockKiststatus)
    app.delete('/api/delete/stock/kist/admin/:id', auth, deletestockKist)
}
