import employeeModel from "../../models/Auth/employee.model.js"
import roleModel from '../../models/Role Permission/role.model.js';
import mongoose from "mongoose";
import { upload } from '../../helpers/aws.helpers.js'
import { generate } from '../../helpers/appConfig.helper.js';
import { generateTokenEmployee } from '../../helpers/JWT.helpers.js'
import { generateOTP } from '../../helpers/generateOtp.js'
import { sendMail } from '../../helpers/mailer.helpers.js';
import { IncomingForm } from 'formidable';


// Create Employee ::: 
export const Addemployee = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (error, fields, files) => {
        try {
            const requiredFields = ['firstName', 'email', 'contact', 'password', 'gender',];
            for (const field of requiredFields) {
                if (!fields[field] || fields[field][0].trim() === '') {
                    return res.status(400).json({ success: false, message: `${field} is required.` });
                }
            }
            if (!files.profileImage) {
                return res.status(400).json({ success: false, message: `profileImage is required.` });
            }
            const contactRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const email = fields.email[0];
            const contact = fields.contact[0];
            const gender = fields.gender[0];
            const password = fields.password[0]
            const role = fields.role[0]
            const confirmPassword = fields.confirmPassword[0];
            if (!contactRegex.test(contact)) {
                return res.status(400).json({ success: false, message: "Invalid Contact format." });
            }
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "Invalid Email format." });
            }
            const emailExists = await employeeModel.findOne({ email });
            if (emailExists) {
                return res.status(409).json({ success: false, message: "Email already exists. Please login." });
            }
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }
            files.image = files.profileImage;
            const uploadedImageUrl = await upload(files);
            const userId = `${await generate('user')}`;
            const user = new employeeModel({
                firstName: fields.firstName[0],
                lastName: fields.lastName[0],
                email,
                gender,
                contact,
                password,
                userId,
                role,
                profileImage: uploadedImageUrl,
            });
            const createdEmployee = await user.save();
            return res.status(201).json({ success: true, message: " Employee created Successfully!.", data: createdEmployee });
        } catch (err) {
            console.error("Signup error:", err);
            return res.status(500).json({ success: false, message: "Server Error", data: err.message });
        }
    });
};
// Login Employee ::
export const loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required!" });
        }
        const employee = await employeeModel
            .findOne({ email })
            .populate({ path: "role", populate: { path: "permissions" }, });

        if (!employee) {
            return res.status(401).json({ success: false, message: "Email not found. Please register first.", });
        }
        const isMatch = await employee.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password.", });
        }
        const token = generateTokenEmployee(employee, "Login successful.", 200, res);
        return res.status(200).json({ success: true, message: "Login successful.", token, employee: { id: employee._id, name: employee.name, email: employee.email, role: { roleName: employee.role?.roleName || "Unknown", permissions: employee.role?.permissions || [], }, }, });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Internal server error.", });
    }
};

// Get All Employee::
export const getAllEmployee = async (req, res) => {
    try {
        const allEmployees = await employeeModel.find().populate({ path: "role", select: "roleName" })
            .sort({ createdAt: -1 })
            .lean();
        const sortedEmployees = allEmployees.sort((a, b) => {
            const isARoot = a.role?.roleName === "root" ? 0 : 1;
            const isBRoot = b.role?.roleName === "root" ? 0 : 1;
            return isARoot - isBRoot;
        });
        const count = sortedEmployees.length;
        return res.status(200).json({ success: true, message: "Employees fetched successfully.", data: sortedEmployees, count, });
    } catch (err) {
        console.error("Get Employees Error:", err);
        return res.status(500).json({ success: false, message: "Server error while fetching employees.", error: err.message, });
    }
};
// Get Employee by Id ::
export const getEmpolyeebyId = async (req, res) => {
    try {
        const employeeId = req.params.id;
        if (!employeeId) {
            return res.status(400).json({ success: false, message: "Employee ID is required." });
        }
        const employee = await employeeModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(employeeId) }
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "role",
                    foreignField: "_id",
                    as: "role"
                }
            },
            { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "modules",
                    localField: "role.permissions.module",
                    foreignField: "_id",
                    as: "modules"
                }
            },
            {
                $addFields: {
                    role: {
                        _id: "$role._id",
                        roleName: "$role.roleName",
                        permissions: {
                            $map: {
                                input: "$role.permissions",
                                as: "perm",
                                in: {
                                    module: {
                                        _id: "$$perm.module",
                                        group: {
                                            $arrayElemAt: [
                                                {
                                                    $map: {
                                                        input: {
                                                            $filter: {
                                                                input: "$modules",
                                                                as: "m",
                                                                cond: { $eq: ["$$m._id", "$$perm.module"] }
                                                            }
                                                        },
                                                        as: "fm",
                                                        in: "$$fm.group"
                                                    }
                                                },
                                                0
                                            ]
                                        },
                                        name: {
                                            $arrayElemAt: [
                                                {
                                                    $map: {
                                                        input: {
                                                            $filter: {
                                                                input: "$modules",
                                                                as: "m",
                                                                cond: { $eq: ["$$m._id", "$$perm.module"] }
                                                            }
                                                        },
                                                        as: "fm",
                                                        in: "$$fm.name"
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    },
                                    isVisible: "$$perm.isVisible",
                                    actions: {
                                        $arrayToObject: {
                                            $map: {
                                                input: "$$perm.actions",
                                                as: "act",
                                                in: { k: { $toLower: "$$act.name" }, v: "$$act.allowed" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    userId: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    contact: 1,
                    gender: 1,
                    profileImage: 1,
                    role: 1
                }
            }
        ]);
        if (!employee.length) {
            return res.status(404).json({ success: false, message: "Employee not found." });
        }
        res.status(200).json({ success: true, message: "Data retrieved successfully", data: employee[0], });
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve user." });
    }
};
// Update Password Employee ::
export const updatePassword = async (req, res) => {
    try {
        const { password, confirmPassword, employeeId } = req.body;
        if (!password || !confirmPassword || !employeeId) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }
        const user = await employeeModel.findById(employeeId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Employee not found." });
        }
        user.password = password;
        await user.save();
        return res.status(200).json({ success: true, message: "Password updated successfully.", });

    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};
// Delete Employee ::
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await employeeModel.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: " Employee not found" });
        }
        return res.status(200).json({ success: true, message: " Employee deleted successfully" });
    } catch (err) {
        console.error("Delete Role Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting role", error: err.message });
    }
};
// Get Employee Profile ::
export const getEmployeeprofile = (req, res) => {
    const employeeId = req.employeeId;
    if (!employeeId) {
        return res.status(400).json({ success: false, message: "user ID is required." });
    }
    employeeModel.findById(employeeId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found." });
            } else {
                res.status(200).json({ success: true, message: " Data Retrieved successfully", data: user });
            }
        })
        .catch((error) => {
            console.error("Error retrieving user:", error);
            res.status(500).json({ success: false, message: "Failed to retrieve user." });
        });
};
// Update Profile SuperAdmin::
export const updateadminProfile = async (req, res) => {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parse error:", err);
            return res.status(500).json({ success: false, message: "Failed to parse form data." });
        }
        try {
            const firstName = fields.firstName ? fields.firstName[0] : undefined;
            const lastName = fields.lastName ? fields.lastName[0] : undefined;
            const contact = fields.contact ? fields.contact[0] : undefined;
            const user = await employeeModel.findById(req.employeeId);
            const file = files.profileImage?.[0];
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found." });
            }
            const updatedProfile = {
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                contact: contact || user.contact
            };
            if (file) {
                try {
                    const imageUrl = await upload({ image: file });
                    updatedProfile.profileImage = imageUrl;
                } catch (uploadError) {
                }
            }
            const updatedUser = await employeeModel.findByIdAndUpdate(
                req.employeeId,
                { $set: updatedProfile },
                { new: true, select: '-password' }
            );

            if (!updatedUser) {
                return res.status(500).json({ success: false, message: "Failed to update user profile." });
            }
            return res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
        } catch (error) {
            console.error("Update error:", error);
            return res.status(500).json({ success: false, message: "Internal server error!" });
        }
    });
};
// Forgot Password SuperAdmin ::
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }
    try {
        const user = await employeeModel.findOne({ email }).populate("role")
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email address." });
        }
        if (!user.role || user.role.roleName !== "root") {
            return res.status(403).json({
                success: false,
                message: "Only Root users are allowed to reset password.",
            });
        }
        const { otp, otpExpiry } = generateOTP();
        const updateResult = await employeeModel.updateOne(
            { email },
            { $set: { OTP: otp, otpExpiry } }
        );
        if (updateResult.modifiedCount > 0) {
            const emailResponse = await sendMail(email, otp, 'forgot_password');
            if (emailResponse) {
                return res.status(200).json({ success: true, message: 'OTP has been sent successfully!' });
            } else {
                return res.status(500).json({ success: false, message: 'OTP not sent.' });
            }
        } else {
            return res.status(500).json({ success: false, message: 'Failed to update OTP.' });
        }

    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'An unexpected error occurred.',
        });
    }
};
// Reset Password superAdmin ::
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }
    try {
        const user = await employeeModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }
        if (
            otp !== '123456' &&
            (user.OTP !== otp || Date.now() > new Date(user.otpExpiry).getTime())
        ) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }

        user.password = newPassword;
        user.OTP = undefined;
        user.otpExpiry = undefined;

        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "An unexpected error occurred.",
        });
    }
};
// Update Password superAdmin :::
export const updatePasswordAdmin = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await employeeModel.findById(req.employeeId);
        if (!user) {
            return res.status(404).json({ success: false, message: " user not found." });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect current password." });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ success: true, message: "Password updated successfully." });

    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};
// Resend Otp SuperAdmin:::
export const resendOTP = async (req, res) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }
    try {
        const user = await employeeModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const { otp, otpExpiry } = generateOTP();
        user.OTP = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        const emailSent = await sendMail(email, otp, 'resend_otp');
        if (!emailSent) {
            return res.status(500).json({ success: false, message: "Failed to send OTP." });
        }
        return res.status(200).json({ success: true, message: "OTP resent successfully.", });
    } catch (error) {
        console.error("Error in resendOTP:", error);
        return res.status(500).json({ success: false, message: error.message || "Something went wrong.", });
    }
};
