import 'dotenv/config';
import nodemailer from 'nodemailer';
import dns from 'dns';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// smtp.gmail.com has both A and AAAA records. On Render the AAAA (IPv6) address
// resolves but isn't actually routable, causing "connect ENETUNREACH ...:587".
// `family: 4` alone isn't reliably honored for the initial DNS step in every
// Nodemailer/Node version, so force it via a custom lookup as well.
const forceIPv4Lookup = (hostname, options, callback) =>
    dns.lookup(hostname, { family: 4 }, callback);

// Create transporter lazily so it always reads the current env vars
// (avoids stale config when module loads before dotenv is initialised)
const createTransporter = () =>
    nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        family: 4,
        lookup: forceIPv4Lookup,
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_APP_PASSWORD,
        },
    });

const SUBJECTS = {
    forgot_password: 'Forgot Password OTP - AuraMart',
    resend_otp:      'Resend OTP - AuraMart',
    signup:          'Signup Verification - AuraMart',
    verification:    'Email Verification - AuraMart',
    login:           'Login OTP - AuraMart',
};

export const sendMail = async (receiver, OTP, type) => {
    if (!SUBJECTS[type]) {
        console.warn('Invalid email type received:', type);
        throw new Error(`Invalid email type: ${type}`);
    }

    const templatePath = path.join(__dirname, '../templates/otp.ejs');
    const html         = await ejs.renderFile(templatePath, { OTP });

    await createTransporter().sendMail({
        from:    `AuraMart Team <${process.env.MAIL_USER}>`,
        to:      receiver,
        subject: SUBJECTS[type],
        html,
    });
};

export const sendTrackingMail = async (receiver, order, trackingNumber, estimatedDelivery) => {
    const templatePath    = path.join(__dirname, '../templates/otp.ejs');
    const orderIdentifier = order?.orderCode || order?._id;
    const html            = await ejs.renderFile(templatePath, {
        orderId: orderIdentifier,
        trackingNumber,
        estimatedDelivery,
        tracking: true,
    });

    await createTransporter().sendMail({
        from:    `AuraMart Team <${process.env.MAIL_USER}>`,
        to:      receiver,
        subject: 'Verification & Shipment Notification - AuraMart',
        html,
    });

    return true;
};
