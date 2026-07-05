import { addAddress, deleteAddress, getAddressById, getAllAddresses, updateAddress } from "../../controllers/Product Management/orderAddress.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";

export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        next();
    });

    app.post('/api/add/address/order/user',                        auth, addAddress);
    app.get('/api/get/all/address/order/user',                     auth, getAllAddresses);
    app.get('/api/get/single/address/order/user/:AddressId',       auth, getAddressById);
    app.put('/api/update/address/order/user/:addressId',           auth, updateAddress);
    app.delete('/api/delete/address/oreder/user/:addressId',       auth, deleteAddress);
};
