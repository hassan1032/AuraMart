import { addEvent, deleteEvent, getAllEvents, getSingleEvent, updatedeventstatus, updateEvent } from "../../controllers/PromotionManegement/event.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";

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
    app.post('/api/add/event/admin', auth, addEvent)
    app.get('/api/get/all/event/admin', getAllEvents)
    app.get('/api/get/single/event/admin/:id', getSingleEvent)
    app.put('/api/update/event/admin/:id', updateEvent)
    app.delete('/api/delete/event/admin/:id', auth, deleteEvent)
    app.put('/api/update/status/event/admin', auth, updatedeventstatus)
}
