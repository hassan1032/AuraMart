// generateOTP.js
export const generateOTP = (length = 6, expiryMinutes = 10) => {
    const otp = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
    const otpExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
    return { otp, otpExpiry };
};
