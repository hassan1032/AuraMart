import jwt from 'jsonwebtoken';
import config from '../configs/JWT.config.js';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: (config.cookieExpire || 15) * 24 * 60 * 60 * 1000,
};

// ─── User token (email/OTP/social login) ─────────────────────────────────
export const generateToken = (user, message, statusCode, res) => {
    const token = jwt.sign(
        { userId: user._id.toString(), email: user.email, role: user.role },
        config.jwtSecretKey,
        { expiresIn: '15d' }
    );

    return res
        .status(statusCode)
        .cookie('token', token, COOKIE_OPTIONS)
        .json({
            success: true,
            message,
            token,
            user: {
                _id:       user._id,
                name:      user.name,
                email:     user.email,
                contact:   user.contact,
                role:      user.role,
                profilePic: user.profilePic,
                isVerified: user.isVerified,
            },
        });
};

// ─── Social-login token — FIXED: was using {id} instead of {userId} ────────
// Auth middleware expects payload.userId — keep payload consistent.
export const generateTokenGoogle = (userId) => {
    return jwt.sign(
        { userId: userId.toString() },
        config.jwtSecretKey,
        { expiresIn: '15d' }
    );
};

// ─── Employee token ───────────────────────────────────────────────────────
export const generateTokenEmployee = (employee, message, statusCode, res) => {
    try {
        const token = jwt.sign(
            {
                employeeId: employee._id.toString(),
                email:      employee.email,
                roleType:   employee.role?.roleName || 'Unknown',
            },
            config.jwtSecretKey,
            { expiresIn: '7d' }
        );

        return res
            .status(statusCode)
            .cookie('token', token, COOKIE_OPTIONS)
            .json({
                success: true,
                message,
                token,
                employee: {
                    id:   employee._id,
                    name: `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
                    email: employee.email,
                    role: {
                        roleName:    employee.role?.roleName    || 'Unknown',
                        permissions: employee.role?.permissions || [],
                    },
                },
            });
    } catch (err) {
        console.error('generateTokenEmployee Error:', err);
        return res.status(500).json({ success: false, message: 'Token generation failed.' });
    }
};
