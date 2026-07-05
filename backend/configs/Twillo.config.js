import "dotenv/config";

const config = {
    twilio: {
        accountSID:  process.env.TWILIO_ACCOUNT_SID,
        authToken:   process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE,
    }
};

export default config;
