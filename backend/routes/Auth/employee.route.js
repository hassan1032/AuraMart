import { Addemployee, deleteEmployee, forgotPassword, getAllEmployee, updatePasswordAdmin, getEmpolyeebyId, loginEmployee, resendOTP, resetPassword, updateadminProfile, updatePassword, getEmployeeprofile } from "../../controllers/Auth/employee.controller.js";
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
    // Auth Routes Employee:::
    app.post('/api/register/employee/admin', Addemployee);
    app.post('/api/login/employee/admin', loginEmployee)
    app.put('/api/update/employee/password/admin', auth, updatePassword)
    app.get('/api/get/all/employee/admin', auth, getAllEmployee)
    app.get('/api/get/profile/employee/admin', auth, getEmployeeprofile)
    app.get('/api/get/by/id/employee/admin/:id', getEmpolyeebyId)
    app.delete('/api/delete/employee/admin/:id', deleteEmployee)

    // Auth Routes SuperAdmin :: 
    app.post('/api/auth/forgot/password/admin', forgotPassword)
    app.post('/api/auth/reset/password/admin', resetPassword)
    app.put('/api/auth/update/profile/admin', auth, updateadminProfile)
    app.post('/api/auth/update/password/admin', auth, updatePasswordAdmin)
    app.post('/api/auth/resend/otp', resendOTP)
}