import {
    completeUserProfile,
    registerWithPassword,
    verifyEmail,
    loginWithPassword,
    requestLoginOtp,
    userLoginOtp,
    forgotPassword,
    resetPassword,
    logout,
    sendContactOTP,
    verifyContact,
    resendContactOTP,
    resendOtpEmail,
    getUserprofile,
    updateProfile,
    sendOtpEmailUser,
    googleLogin,
    facebookLogin,
} from "../../controllers/Auth/user.controller.js";
import { auth } from "../../middlewares/auth.middleware.js"


export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        res.header('Content-Type', 'application/json; charset=utf-8');
        next();
    });
    // ── Registration ────────────────────────────────────────────────────────
    app.post('/api/auth/send/otp/email/user',      sendOtpEmailUser)       // step 1: OTP-based registration
    app.post('/api/auth/verify/account/user',      verifyEmail)            // step 2: verify email OTP → returns token
    app.post('/api/auth/register/user',            registerWithPassword)   // password-based registration (sends verification OTP)

    // ── Login ────────────────────────────────────────────────────────────────
    app.post('/api/auth/login/password/user',      loginWithPassword)      // email + password login
    app.post('/api/auth/request/login/otp/user',  requestLoginOtp)        // send login OTP
    app.post('/api/auth/login/user',               userLoginOtp)           // verify login OTP → returns token

    // ── Social login ─────────────────────────────────────────────────────────
    app.post('/api/auth/login/google/user',        googleLogin)
    app.post('/api/auth/login/facebook/user',      facebookLogin)

    // ── Password reset ───────────────────────────────────────────────────────
    app.post('/api/auth/forgot/password/user',     forgotPassword)         // send reset OTP
    app.post('/api/auth/reset/password/user',      resetPassword)          // verify OTP + set new password

    // ── Contact (phone) ──────────────────────────────────────────────────────
    app.post('/api/auth/send/contact/otp/user',    sendContactOTP)
    app.post('/api/auth/verify/contact/user',      verifyContact)
    app.post('/api/auth/resend/otp/user',          resendContactOTP)       // resend phone OTP

    // ── Email OTP resend ─────────────────────────────────────────────────────
    app.post('/api/auth/resend/otp/email/user',    resendOtpEmail)         // resend email OTP (signup/login/forgot)

    // ── Session / Profile ────────────────────────────────────────────────────
    app.post('/api/auth/logout/user',              logout)
    app.get('/api/auth/get/profile/user',          auth, getUserprofile)
    app.post('/api/auth/get/profile/user',         auth, getUserprofile)   // legacy POST kept
    app.put('/api/auth/update/profile/user',       auth, updateProfile)
};