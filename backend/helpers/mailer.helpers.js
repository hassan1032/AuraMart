import 'dotenv/config';
import nodemailer from 'nodemailer';
import dns from 'dns';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const GMAIL_SMTP_HOST = 'smtp.gmail.com';

// Nodemailer resolves both A and AAAA records for the SMTP host itself and then
// picks a RANDOM address from the combined list (see nodemailer/lib/shared/index.js
// formatDNSValue) — it does NOT honor the documented `family`/`lookup` transport
// options for this step. On Render the AAAA (IPv6) address isn't routable, so
// roughly half of connection attempts fail with "connect ENETUNREACH ...:587".
// Resolving the IPv4 address ourselves and passing it as a literal IP bypasses
// Nodemailer's own resolver entirely (it skips DNS whenever `host` is already an
// IP). `servername` is set explicitly so TLS still validates against the real
// hostname instead of the raw IP.
const resolveGmailIPv4 = async () => {
    const addresses = await dns.promises.resolve4(GMAIL_SMTP_HOST);
    return addresses[0];
};

const createTransporter = async () =>
    nodemailer.createTransport({
        host: await resolveGmailIPv4(),
        servername: GMAIL_SMTP_HOST,
        port: 465, // implicit TLS — try this if 587/STARTTLS is blocked outbound
        secure: true,
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
    const transporter  = await createTransporter();

    await transporter.sendMail({
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
    const transporter = await createTransporter();

    await transporter.sendMail({
        from:    `AuraMart Team <${process.env.MAIL_USER}>`,
        to:      receiver,
        subject: 'Verification & Shipment Notification - AuraMart',
        html,
    });

    return true;
};
