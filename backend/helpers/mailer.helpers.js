import 'dotenv/config';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Create transporter lazily so it always reads the current env vars
// (avoids stale config when module loads before dotenv is initialised)
const createTransporter = () =>
    nodemailer.createTransport({
        service: 'Gmail',
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
