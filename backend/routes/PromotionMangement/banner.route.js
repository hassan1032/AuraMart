import { addbanner, deletebanner, getAllbanner, updatebanner, updatedbannerstatus } from "../../controllers/PromotionManegement/banner.controller.js";
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
    app.post('/api/add/banner/admin', auth, addbanner)
    app.put('/api/update/banner/admin/:id', auth, updatebanner)
    app.put('/api/update/status/banner/admin', auth, updatedbannerstatus)
    app.get('/api/get/all/banner/admin', getAllbanner)
    app.delete('/api/delete/banner/admin/:id', auth, deletebanner)
}
