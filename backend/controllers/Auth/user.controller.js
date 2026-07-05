import authModel           from '../../models/Auth/user.model.js';
import contactOtpModel     from '../../models/Auth/contactotp.model.js';
import { generate }        from '../../helpers/appConfig.helper.js';
import { sendMail }        from '../../helpers/mailer.helpers.js';
import { generateToken, generateTokenGoogle } from '../../helpers/JWT.helpers.js';
import { generateOTP }     from '../../helpers/generateOtp.js';
import { generateUserSlug } from '../../helpers/genrateSlug.helper.js';
import config              from '../../configs/JWT.config.js';
import { OAuth2Client }    from 'google-auth-library';
import axios               from 'axios';

const googleClient = new OAuth2Client(config.googleClientId);

// ─── Validators ───────────────────────────────────────────────────────────
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^[0-9]{10}$/.test(v);

// ─── helpers ─────────────────────────────────────────────────────────────
async function ensureNewUser(email) {
    const existing = await authModel.findOne({ email });
    if (existing?.isVerified) return { error: 'Email already registered. Please login.' };
    return { existing };
}

async function storeAndSendOtp(user, email, type) {
    const { otp, otpExpiry } = generateOTP();
    user.OTP       = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendMail(email, otp, type);
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRATION — OTP-based (step 1: send OTP to new email)
// POST /api/auth/send/otp/email/user
// Body: { email }
// ═══════════════════════════════════════════════════════════════════════════
export const sendOtpEmailUser = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        if (!email)        return res.status(400).json({ success: false, message: 'Email is required.' });
        if (!isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format.' });

        const { error, existing } = await ensureNewUser(email);
        if (error) return res.status(409).json({ success: false, message: error });

        let user = existing;
        if (!user) {
            const userId = await generate('user');
            const url    = await generateUserSlug(email, authModel, 'url');
            user = new authModel({ email, userId, url, isVerified: false, role: 'User' });
        }
        await storeAndSendOtp(user, email, 'signup');
        return res.status(200).json({ success: true, message: 'OTP sent to email. Please verify.' });
    } catch (err) {
        console.error('sendOtpEmailUser Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRATION — Password-based (replaces completeUserProfile)
// POST /api/auth/register/user
// Body: { name, email, password }
// Creates account + sends verification OTP. Verify via /verify/account/user.
// ═══════════════════════════════════════════════════════════════════════════
export const registerWithPassword = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email)    return res.status(400).json({ success: false, message: 'Email is required.' });
        if (!password) return res.status(400).json({ success: false, message: 'Password is required.' });
        if (!isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format.' });
        if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

        const existing = await authModel.findOne({ email: email.trim().toLowerCase() });
        if (existing?.isVerified) return res.status(409).json({ success: false, message: 'Email already registered. Please login.' });

        const userId = existing ? existing.userId : await generate('user');
        const url    = existing ? existing.url    : await generateUserSlug(email, authModel, 'url');

        let user = existing || new authModel({ email: email.trim().toLowerCase(), userId, url, role: 'User' });
        user.name     = name?.trim() || user.name;
        user.password = password;        // pre-save hook hashes this
        user.isVerified = false;

        const { otp, otpExpiry } = generateOTP();
        user.OTP       = otp;
        user.otpExpiry = otpExpiry;
        await user.save();               // password gets hashed here

        await sendMail(user.email, otp, 'signup');
        return res.status(200).json({ success: true, message: 'Account created. OTP sent to email — please verify.' });
    } catch (err) {
        console.error('registerWithPassword Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// VERIFY EMAIL OTP (used by both registration flows)
// POST /api/auth/verify/account/user
// Body: { email, OTP }
// Returns JWT on success.
// ═══════════════════════════════════════════════════════════════════════════
export const verifyEmail = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { OTP } = req.body;

        if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
        if (!OTP)   return res.status(400).json({ success: false, message: 'OTP is required.' });
        if (!isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format.' });

        const user = await authModel.findOne({ email });
        if (!user)           return res.status(404).json({ success: false, message: 'User not found.' });
        if (user.isVerified) return generateToken(user, 'Email already verified.', 200, res);

        if (!user.OTP || !user.otpExpiry)
            return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
        if (Date.now() > new Date(user.otpExpiry).getTime()) {
            user.OTP = null; user.otpExpiry = null; await user.save();
            return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
        }
        if (user.OTP.trim() !== String(OTP).trim())
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });

        user.isVerified = true;
        user.OTP        = null;
        user.otpExpiry  = null;
        await user.save();

        return generateToken(user, 'Email verified successfully. Welcome!', 200, res);
    } catch (err) {
        console.error('verifyEmail Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN — Email + Password
// POST /api/auth/login/password/user
// Body: { email, password }
// ═══════════════════════════════════════════════════════════════════════════
export const loginWithPassword = async (req, res) => {
    try {
        const email    = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        if (!isEmail(email))
            return res.status(400).json({ success: false, message: 'Invalid email format.' });

        // Explicitly select password (select: false in schema)
        const user = await authModel.findOne({ email }).select('+password');
        if (!user)
            return res.status(404).json({ success: false, message: 'No account found with this email.' });
        if (!user.isVerified)
            return res.status(403).json({ success: false, message: 'Email not verified. Please verify your email first.' });
        if (!user.password)
            return res.status(400).json({ success: false, message: 'This account uses OTP or social login — no password set.' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: 'Incorrect password.' });

        return generateToken(user, 'Login successful.', 200, res);
    } catch (err) {
        console.error('loginWithPassword Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN — Request OTP (send OTP to email or phone)
// POST /api/auth/request/login/otp/user
// Body: { email } OR { contact }
// ═══════════════════════════════════════════════════════════════════════════
export const requestLoginOtp = async (req, res) => {
    try {
        const email   = req.body.email?.trim().toLowerCase();
        const contact = req.body.contact?.trim();

        if (!email && !contact)
            return res.status(400).json({ success: false, message: 'Email or contact number is required.' });

        const { otp, otpExpiry } = generateOTP();

        if (email) {
            if (!isEmail(email))
                return res.status(400).json({ success: false, message: 'Invalid email format.' });

            const user = await authModel.findOne({ email });
            if (!user)         return res.status(404).json({ success: false, message: 'No account found with this email.' });
            if (!user.isVerified) return res.status(403).json({ success: false, message: 'Email not verified. Please complete registration first.' });

            user.OTP = otp; user.otpExpiry = otpExpiry;
            await user.save();
            await sendMail(email, otp, 'login');
            return res.status(200).json({ success: true, message: 'OTP sent to email.' });
        }

        if (contact) {
            if (!isPhone(contact))
                return res.status(400).json({ success: false, message: 'Invalid contact format. Must be 10 digits.' });

            const user = await authModel.findOne({ contact });
            if (!user) return res.status(404).json({ success: false, message: 'No account found with this contact number.' });
            if (!user.email) return res.status(400).json({ success: false, message: 'No email linked to this account. Please login with email.' });

            // Send OTP to the linked email (no SMS/Twilio)
            user.OTP = otp; user.otpExpiry = otpExpiry;
            await user.save();
            await sendMail(user.email, otp, 'login');
            return res.status(200).json({ success: true, message: `OTP sent to your registered email (${user.email.replace(/(.{2}).+(@.+)/, '$1***$2')}).` });
        }
    } catch (err) {
        console.error('requestLoginOtp Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN — Verify OTP (email or phone)
// POST /api/auth/login/user
// Body: { email, OTP } OR { contact, OTP }
// ═══════════════════════════════════════════════════════════════════════════
export const userLoginOtp = async (req, res) => {
    try {
        const email   = req.body.email?.trim().toLowerCase();
        const contact = req.body.contact?.trim();
        const { OTP } = req.body;

        if ((!email && !contact) || !OTP)
            return res.status(400).json({ success: false, message: 'Email/contact and OTP are required.' });

        if (email) {
            const user = await authModel.findOne({ email });
            if (!user)            return res.status(404).json({ success: false, message: 'No account found with this email.' });
            if (!user.isVerified) return res.status(403).json({ success: false, message: 'Email not verified.' });
            if (!user.OTP || !user.otpExpiry) return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
            if (Date.now() > new Date(user.otpExpiry).getTime()) {
                user.OTP = null; user.otpExpiry = null; await user.save();
                return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
            }
            if (user.OTP.trim() !== String(OTP).trim())
                return res.status(401).json({ success: false, message: 'Invalid OTP.' });

            user.OTP = null; user.otpExpiry = null;
            await user.save();
            return generateToken(user, 'Login successful.', 200, res);
        }

        if (contact) {
            if (!isPhone(contact))
                return res.status(400).json({ success: false, message: 'Invalid contact format.' });

            const otpRecord = await contactOtpModel.findOne({ contact });
            if (!otpRecord || !otpRecord.OTP) return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
            if (Date.now() > new Date(otpRecord.otpExpiry).getTime())
                return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
            if (otpRecord.OTP.trim() !== String(OTP).trim())
                return res.status(401).json({ success: false, message: 'Invalid OTP.' });

            const user = await authModel.findOne({ contact });
            if (!user) return res.status(404).json({ success: false, message: 'No account found with this contact number.' });

            await contactOtpModel.updateOne({ contact }, { $set: { OTP: null, otpExpiry: null } });
            return generateToken(user, 'Login successful.', 200, res);
        }
    } catch (err) {
        console.error('userLoginOtp Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD — send OTP to email
// POST /api/auth/forgot/password/user
// Body: { email }
// ═══════════════════════════════════════════════════════════════════════════
export const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        if (!email)        return res.status(400).json({ success: false, message: 'Email is required.' });
        if (!isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format.' });

        const user = await authModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'No account found with this email.' });
        if (!user.isVerified) return res.status(403).json({ success: false, message: 'Email not verified.' });

        const { otp, otpExpiry } = generateOTP();
        user.OTP = otp; user.otpExpiry = otpExpiry;
        await user.save();
        await sendMail(email, otp, 'forgot_password');
        return res.status(200).json({ success: true, message: 'Password reset OTP sent to email.' });
    } catch (err) {
        console.error('forgotPassword Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// RESET PASSWORD — verify OTP + set new password
// POST /api/auth/reset/password/user
// Body: { email, OTP, newPassword }
// ═══════════════════════════════════════════════════════════════════════════
export const resetPassword = async (req, res) => {
    try {
        const email       = req.body.email?.trim().toLowerCase();
        const { OTP, newPassword } = req.body;

        if (!email || !OTP || !newPassword)
            return res.status(400).json({ success: false, message: 'Email, OTP, and newPassword are required.' });
        if (newPassword.length < 6)
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

        const user = await authModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        if (!user.OTP || !user.otpExpiry) return res.status(400).json({ success: false, message: 'No OTP found. Please request password reset again.' });
        if (Date.now() > new Date(user.otpExpiry).getTime()) {
            user.OTP = null; user.otpExpiry = null; await user.save();
            return res.status(400).json({ success: false, message: 'OTP expired. Please request password reset again.' });
        }
        if (user.OTP.trim() !== String(OTP).trim())
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });

        user.password  = newPassword;   // pre-save hook hashes it
        user.OTP       = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({ success: true, message: 'Password reset successful. Please login.' });
    } catch (err) {
        console.error('resetPassword Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// LOGOUT
// POST /api/auth/logout/user
// Clears the HTTP-only cookie; client should also delete its stored token.
// ═══════════════════════════════════════════════════════════════════════════
export const logout = async (req, res) => {
    return res
        .clearCookie('token', { httpOnly: true, sameSite: 'lax' })
        .status(200)
        .json({ success: true, message: 'Logged out successfully.' });
};

// ═══════════════════════════════════════════════════════════════════════════
// RESEND OTP (for registration or login)
// POST /api/auth/resend/otp/email/user
// Body: { email, type } — type: 'signup' | 'login' | 'forgot_password'
// ═══════════════════════════════════════════════════════════════════════════
export const resendOtpEmail = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const type  = req.body.type || 'signup';
        if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

        const user = await authModel.findOne({ email });
        if (!user)  return res.status(404).json({ success: false, message: 'User not found.' });

        if (type === 'login' && !user.isVerified)
            return res.status(403).json({ success: false, message: 'Email not verified.' });

        const { otp, otpExpiry } = generateOTP();
        user.OTP = otp; user.otpExpiry = otpExpiry;
        await user.save();
        await sendMail(email, otp, type === 'forgot_password' ? 'forgot_password' : type === 'login' ? 'login' : 'resend_otp');
        return res.status(200).json({ success: true, message: 'OTP resent successfully.' });
    } catch (err) {
        console.error('resendOtpEmail Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GET PROFILE (requires auth)
// GET /api/auth/get/profile/user
// ═══════════════════════════════════════════════════════════════════════════
export const getUserprofile = async (req, res) => {
    try {
        const user = await authModel.findById(req.userId).lean();
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        return res.status(200).json({ success: true, message: 'Profile retrieved.', data: user });
    } catch (err) {
        console.error('getUserprofile Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// UPDATE PROFILE (requires auth)
// PUT /api/auth/update/profile/user
// Body: { firstName, lastName, dob, gender, phone, countryCode }
// ═══════════════════════════════════════════════════════════════════════════
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { firstName, lastName, dob, gender, phone, countryCode } = req.body;

        const updates = {};
        if (firstName !== undefined) updates.firstName = String(firstName).trim();
        if (lastName  !== undefined) updates.lastName  = String(lastName).trim();
        if (dob       !== undefined) updates.dob       = dob;
        if (gender    !== undefined) updates.gender    = gender;
        if (countryCode !== undefined) updates.countryCode = countryCode;
        if (phone !== undefined) {
            // phone arrives as "+91XXXXXXXXXX" — strip the country-code prefix for storage
            updates.contact = String(phone).replace(/^\+\d{1,3}/, '').trim();
        }

        // Keep the combined `name` field in sync
        if (updates.firstName !== undefined || updates.lastName !== undefined) {
            const existing = await authModel.findById(userId).lean();
            const fn = updates.firstName ?? existing?.firstName ?? '';
            const ln = updates.lastName  ?? existing?.lastName  ?? '';
            updates.name = [fn, ln].filter(Boolean).join(' ');
        }

        const updated = await authModel.findByIdAndUpdate(userId, { $set: updates }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'User not found.' });
        return res.status(200).json({ success: true, message: 'Profile updated successfully.', data: updated });
    } catch (err) {
        console.error('updateProfile Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT OTP — send OTP to the linked email (no SMS)
// POST /api/auth/send/contact/otp/user
// Body: { contact, email } — email is needed to receive the OTP
// ═══════════════════════════════════════════════════════════════════════════
export const sendContactOTP = async (req, res) => {
    try {
        const contact = req.body.contact?.trim();
        const email   = req.body.email?.trim().toLowerCase();
        if (!contact)          return res.status(400).json({ success: false, message: 'Contact is required.' });
        if (!isPhone(contact)) return res.status(400).json({ success: false, message: 'Invalid contact format. Must be 10 digits.' });
        if (!email || !isEmail(email)) return res.status(400).json({ success: false, message: 'A valid email is required to receive the OTP.' });

        const { otp, otpExpiry } = generateOTP();
        await contactOtpModel.findOneAndUpdate(
            { contact },
            { OTP: otp, otpExpiry, contactVerified: false },
            { upsert: true, new: true }
        );
        await sendMail(email, otp, 'verification');
        return res.status(200).json({ success: true, message: 'OTP sent to your email for contact verification.' });
    } catch (err) {
        console.error('sendContactOTP Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT OTP — verify
// POST /api/auth/verify/contact/user
// Body: { contact, OTP }
// ═══════════════════════════════════════════════════════════════════════════
export const verifyContact = async (req, res) => {
    try {
        const contact = req.body.contact?.trim();
        const { OTP } = req.body;
        if (!contact || !OTP)
            return res.status(400).json({ success: false, message: 'Contact and OTP are required.' });

        const record = await contactOtpModel.findOne({ contact });
        if (!record) return res.status(404).json({ success: false, message: 'Contact not found. Please request OTP first.' });
        if (record.contactVerified) return res.status(200).json({ success: true, message: 'Contact already verified.' });
        if (!record.OTP || !record.otpExpiry) return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
        if (Date.now() > new Date(record.otpExpiry).getTime())
            return res.status(400).json({ success: false, message: 'OTP expired.' });
        if (record.OTP.trim() !== String(OTP).trim())
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });

        await contactOtpModel.updateOne({ contact }, { $set: { contactVerified: true, OTP: null, otpExpiry: null } });
        return res.status(200).json({ success: true, message: 'Contact verified successfully.' });
    } catch (err) {
        console.error('verifyContact Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT OTP — resend
// POST /api/auth/resend/otp/user
// Body: { contact }
// ═══════════════════════════════════════════════════════════════════════════
export const resendContactOTP = async (req, res) => {
    try {
        const contact = req.body.contact?.trim();
        if (!contact)        return res.status(400).json({ success: false, message: 'Contact is required.' });
        if (!isPhone(contact)) return res.status(400).json({ success: false, message: 'Invalid contact format.' });

        const record = await contactOtpModel.findOne({ contact });
        if (!record) return res.status(404).json({ success: false, message: 'Contact not found. Please request OTP first.' });

        const email = req.body.email?.trim().toLowerCase();
        if (!email || !isEmail(email))
            return res.status(400).json({ success: false, message: 'A valid email is required to receive the OTP.' });

        const { otp, otpExpiry } = generateOTP();
        await contactOtpModel.updateOne({ contact }, { $set: { OTP: otp, otpExpiry } });
        await sendMail(email, otp, 'verification');
        return res.status(200).json({ success: true, message: 'OTP resent to your email.' });
    } catch (err) {
        console.error('resendContactOTP Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GOOGLE LOGIN
// POST /api/auth/login/google/user
// Body: { token } (Google ID token)
// ═══════════════════════════════════════════════════════════════════════════
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ success: false, message: 'Google token is required.' });

        const ticket  = await googleClient.verifyIdToken({ idToken: token, audience: config.googleClientId });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await authModel.findOne({ email: email?.toLowerCase() });
        if (!user) {
            const userId = await generate('user');
            const url    = await generateUserSlug(email, authModel, 'url');
            user = await authModel.create({
                email: email.toLowerCase(), name, profilePic: picture,
                userId, url, provider: 'google', isVerified: true, role: 'User',
            });
        } else {
            user.name       = name       || user.name;
            user.profilePic = picture    || user.profilePic;
            user.provider   = 'google';
            user.isVerified = true;
            await user.save();
        }

        // generateTokenGoogle now correctly uses {userId} payload
        const jwtToken = generateTokenGoogle(user._id);
        return res.status(200).json({
            success: true,
            message: 'Google login successful.',
            token: jwtToken,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic },
        });
    } catch (err) {
        console.error('googleLogin Error:', err);
        return res.status(500).json({ success: false, message: err.message || 'Server error.' });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// FACEBOOK LOGIN
// POST /api/auth/login/facebook/user
// Body: { accessToken }
// ═══════════════════════════════════════════════════════════════════════════
export const facebookLogin = async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) return res.status(400).json({ success: false, message: 'Facebook access token is required.' });

        // Validate via debug_token only when Facebook App credentials are configured
        if (config.facebookAppId && config.facebookAppSecret) {
            const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${config.facebookAppId}|${config.facebookAppSecret}`;
            const { data: debug } = await axios.get(debugUrl);
            if (!debug.data?.is_valid) return res.status(401).json({ success: false, message: 'Invalid Facebook access token.' });
        }

        const { data: fbUser } = await axios.get(
            `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
        );
        const { id, name, email, picture } = fbUser;

        let user = email
            ? await authModel.findOne({ email: email.toLowerCase() })
            : await authModel.findOne({ providerId: id });

        if (!user) {
            const userId = await generate('user');
            user = await authModel.create({
                name, email: email?.toLowerCase() || '', profilePic: picture?.data?.url || '',
                userId, provider: 'facebook', providerId: id, isVerified: true, role: 'User',
            });
        } else {
            user.name       = name             || user.name;
            user.profilePic = picture?.data?.url || user.profilePic;
            user.provider   = 'facebook';
            user.providerId = id;
            user.isVerified = true;
            await user.save();
        }

        const jwtToken = generateTokenGoogle(user._id);    // same JWT shape
        return res.status(200).json({
            success: true,
            message: 'Facebook login successful.',
            token: jwtToken,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic },
        });
    } catch (err) {
        console.error('facebookLogin Error:', err);
        return res.status(500).json({ success: false, message: err.message || 'Server error.' });
    }
};

// Legacy alias — kept so existing routes don't break
export const completeUserProfile = registerWithPassword;
