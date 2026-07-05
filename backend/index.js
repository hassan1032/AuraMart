import dns from 'dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT, dbConfig } from './configs/DB.config.js';

// Prefer IPv4 for all outbound DNS lookups — Render's containers resolve AAAA
// records for hosts like smtp.gmail.com but can't route them, causing ENETUNREACH.
try { dns.setDefaultResultOrder('ipv4first'); } catch { /* Node < 17, ignore */ }

import colourRoute from './routes/Product Variants/colour.route.js';
import sizeRoute from './routes/Product Variants/size.route.js';
import bannerRoute from './routes/PromotionMangement/banner.route.js';
import couponRoute from './routes/PromotionMangement/coupon.route.js';
import collectionRoute from './routes/Product Management/collection.route.js';
import accessoryTypeRoute from './routes/Product Management/accessoryType.route.js';
import productRoute from './routes/Product Management/product.route.js';
import accessoryRoute from './routes/Product Management/accessory.route.js';
import stockkistRoute from './routes/Product Management/stockKist.route.js';
import moduleRoute from './routes/Role Permission/module.route.js';
import roleRoute from './routes/Role Permission/role.route.js';
import employeeRoute from './routes/Auth/employee.route.js';
import userRoute from './routes/Auth/user.route.js';
import productCustomizationRoute from './routes/Product Management/productCustomization.route.js';
import orderRoute from './routes/Product Management/order.route.js';
import whislistRoute from './routes/Product Management/whislist.route.js';
import addToCartRoute from './routes/Product Management/addToCart.route.js';
import orderAddressRoute from './routes/Product Management/orderAddress.route.js';
import paymentRoute from './routes/Product Management/payment.route.js';
import eventRoute from './routes/PromotionMangement/event.route.js';
import orderTrackRoute from './routes/Product Management/orderTrack.route.js';
import adminOrderRoute from './routes/Product Management/adminOrder.route.js';

const app = express();


app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

/* ✅ DB Connection */
mongoose.connect(dbConfig.url)
    .then(() => console.log('📊 DB Connected'))
    .catch(err => { console.error('❌ DB connection failed — check MongoDB Atlas IP whitelist:', err.message); });

/* ✅ Health Check */
app.get('/', (req, res) => res.json({ success: true, message: 'Backend running ✅', timestamp: new Date().toISOString() }));

/* ✅ Start server */
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

/* ✅ Import all routes */
userRoute(app);
colourRoute(app);
sizeRoute(app);
bannerRoute(app);
accessoryTypeRoute(app);
accessoryRoute(app);
couponRoute(app);
productRoute(app);
collectionRoute(app);
moduleRoute(app);
roleRoute(app);
stockkistRoute(app);
employeeRoute(app);
productCustomizationRoute(app);
orderRoute(app);
orderAddressRoute(app);
whislistRoute(app);
addToCartRoute(app);
eventRoute(app);
paymentRoute(app);
orderTrackRoute(app);
adminOrderRoute(app);

/* ✅ 404 handler — must be after all routes */
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

/* ✅ Global error handler — catches unhandled errors from all routes */
app.use((err, req, res, next) => {
    console.error('❌ Unhandled Error:', err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});