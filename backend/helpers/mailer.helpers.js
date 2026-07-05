import 'dotenv/config';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const BREVO_SEND_URL = 'https://api.brevo.com/v3/smtp/email';

// Sends over Brevo's HTTPS API rather than raw SMTP — immune to the outbound
// SMTP port issues (IPv6 routing, port blocking) hit with Gmail SMTP on Render.
const sendViaBrevo = async ({ to, subject, html }) => {
    const res = await fetch(BREVO_SEND_URL, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: { name: 'AuraMart Team', email: process.env.MAIL_USER },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Brevo send failed (${res.status}): ${body}`);
    }
};

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

    await sendViaBrevo({ to: receiver, subject: SUBJECTS[type], html });
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

    await sendViaBrevo({
        to:      receiver,
        subject: 'Verification & Shipment Notification - AuraMart',
        html,
    });

    return true;
};
