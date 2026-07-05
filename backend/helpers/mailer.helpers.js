import 'dotenv/config';
import { Resend } from 'resend';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Lazily construct so it always reads the current env vars
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Until a custom domain is verified with Resend, this sandbox address can only
// deliver to the email you signed up to Resend with — not to arbitrary customers.
const FROM = process.env.MAIL_FROM || 'AuraMart Team <onboarding@resend.dev>';

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

    const { error } = await getResend().emails.send({
        from:    FROM,
        to:      receiver,
        subject: SUBJECTS[type],
        html,
    });
    if (error) throw new Error(error.message || 'Failed to send email');
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

    const { error } = await getResend().emails.send({
        from:    FROM,
        to:      receiver,
        subject: 'Verification & Shipment Notification - AuraMart',
        html,
    });
    if (error) throw new Error(error.message || 'Failed to send email');

    return true;
};
