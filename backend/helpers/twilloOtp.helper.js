import twilio from 'twilio';
import config from '../configs/Twillo.config.js';

const client = twilio(config.twilio.accountSID, config.twilio.authToken);
export const sendOTP = async (OTP, toNumber, purpose = 'verify') => {
    try {
        let bodyMessage = '';

        if (purpose === 'login') {
            bodyMessage = `Nicki Macfarlane\n\nYour OTP for login is: ${OTP}\n\nUse this OTP to log in to your account.\n\nBest regards,\nNicki Macfarlane Team`;
        } else if (purpose === 'verify') {
            bodyMessage = `Nicki Macfarlane\n\nYour OTP is: ${OTP}\n\nUse this to verify your contact number.\n\nBest regards,\nNicki Macfarlane Team`;
        } else {
            bodyMessage = `Nicki Macfarlane\n\nYour OTP is: ${OTP}\n\nBest regards,\nNicki Macfarlane Team`;
        }

        const message = await client.messages.create({
            body: bodyMessage,
            from: config.twilio.phoneNumber,
            to: toNumber.startsWith('+') ? toNumber : `+91${toNumber}`
        });

        console.log('✅ OTP sent successfully:', message.sid);
        return true;
    } catch (error) {
        console.error("❌ Twilio SMS Error:", error.message);
        return false;
    }
};

