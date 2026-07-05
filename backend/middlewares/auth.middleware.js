import config from "../configs/JWT.config.js"
import authModel from "../models/Auth/user.model.js"
import jwt from 'jsonwebtoken';
import employeeModel from "../models/Auth/employee.model.js";

export const auth = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(400).json({ error: true, message: "Bearer token is required." });
    }

    const token = authorizationHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, config.jwtSecretKey);
        let employee = null;
        if (payload.employeeId) {
            employee = await employeeModel.findById(payload.employeeId);
            if (!employee) {
                return res.status(401).json({ error: true, message: "Unauthorized. Employee not found." });
            }
            req.employeeId = employee._id;
        }
        let user = null;
        if (payload.userId) {
            user = await authModel.findById(payload.userId);
            if (!user) {
                return res.status(401).json({ error: true, message: "Unauthorized. User not found." });
            }
            req.userId = user._id;
            req.role = user.role;
            req.name = user.name;
            req.discount = user.discount;
        }
        next();

    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ error: true, message: "Invalid or expired token. Please log in again." });
    }
};

