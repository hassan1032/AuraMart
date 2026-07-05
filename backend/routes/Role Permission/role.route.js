
import { createRole, deleteRole, getAllRoles, getRoleById, updateRole, updateRolePermissions, getFilteredRole } from "../../controllers/Role Permission/role.Controller.js";
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
    app.post('/api/add/role/admin', createRole)
    app.get('/api/filter/role/admin', getFilteredRole)
    app.get('/api/get/all/role/admin', auth, getAllRoles)
    app.get('/api/get/single/role/admin/:id', auth, getRoleById)
    app.put('/api/update/role/admin/:id', auth, updateRole)
    app.put('/api/update/role/permission/admin/:id', updateRolePermissions)
    app.delete('/api/delete/role/admin/:id', auth, deleteRole)

}
