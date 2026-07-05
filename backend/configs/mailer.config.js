import "dotenv/config";

export const emailConfig = {
    user:        process.env.MAIL_USER,
    appPassword: process.env.MAIL_APP_PASSWORD,
};
