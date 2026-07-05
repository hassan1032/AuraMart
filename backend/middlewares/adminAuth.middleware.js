export const adminAuth = (req, res, next) => {
    // Allow employees (admin panel users) OR users with Admin role
    if (req.employeeId || req.role === 'Admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Admin access required.' });
};
