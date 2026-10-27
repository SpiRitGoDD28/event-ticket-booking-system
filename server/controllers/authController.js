const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });

    }
};


// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        /*
         * Always return the same response whether the
         * email exists or not.
         *
         * This prevents account enumeration.
         */
        if (!user) {
            return res.status(200).json({
                message:
                    "If an account with that email exists, an OTP has been sent."
            });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Hash OTP before storing it
        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // OTP valid for 10 minutes
        const otpExpiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.resetOtpHash = otpHash;
        user.resetOtpExpiresAt = otpExpiresAt;

        // Clear any previous reset token
        user.resetTokenHash = null;
        user.resetTokenExpiresAt = null;

        await user.save();

        const emailText = `
Hello ${user.name},

We received a request to reset the password for your Ticket Booking account.

Your OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
Ticket Booking System
        `;

        await sendEmail(
            user.email,
            "Password Reset OTP - Ticket Booking System",
            emailText
        );

        res.status(200).json({
            message:
                "If an account with that email exists, an OTP has been sent."
        });

    } catch (error) {

        console.log("Forgot password error:", error);

        res.status(500).json({
            message: "Failed to process password reset request"
        });

    }
};


// =====================================================
// VERIFY OTP
// =====================================================

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

        // Check whether OTP exists
        if (
            !user.resetOtpHash ||
            !user.resetOtpExpiresAt
        ) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

        // Check expiry
        if (user.resetOtpExpiresAt < new Date()) {

            user.resetOtpHash = null;
            user.resetOtpExpiresAt = null;

            await user.save();

            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        // Hash received OTP
        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // Compare hashes
        if (otpHash !== user.resetOtpHash) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Reset token valid for 10 minutes
        const resetTokenExpiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.resetTokenHash = resetTokenHash;
        user.resetTokenExpiresAt = resetTokenExpiresAt;

        // OTP can no longer be reused
        user.resetOtpHash = null;
        user.resetOtpExpiresAt = null;

        await user.save();

        res.status(200).json({
            message: "OTP verified successfully",
            resetToken: resetToken
        });

    } catch (error) {

        console.log("OTP verification error:", error);

        res.status(500).json({
            message: "Failed to verify OTP"
        });

    }
};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
    try {
        const {
            email,
            resetToken,
            newPassword
        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        if (
            !user.resetTokenHash ||
            !user.resetTokenExpiresAt
        ) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        // Check expiry
        if (user.resetTokenExpiresAt < new Date()) {

            user.resetTokenHash = null;
            user.resetTokenExpiresAt = null;

            await user.save();

            return res.status(400).json({
                message: "Reset token has expired"
            });
        }

        // Hash provided token
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Compare token hashes
        if (resetTokenHash !== user.resetTokenHash) {
            return res.status(400).json({
                message: "Invalid reset token"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        // Clear reset token after successful password change
        user.resetTokenHash = null;
        user.resetTokenExpiresAt = null;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {

        console.log("Reset password error:", error);

        res.status(500).json({
            message: "Failed to reset password"
        });

    }
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Verify current password
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        // Prevent using the same password
        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (samePassword) {
            return res.status(400).json({
                message:
                    "New password must be different from current password"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {

        console.log("Change password error:", error);

        res.status(500).json({
            message: "Failed to change password"
        });

    }
};
// =====================================================
// GET CURRENT USER
// =====================================================

const getCurrentUser = async (req, res) => {

    try {

        res.status(200).json({

            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }

        });

    } catch (error) {

        res.status(500).json({

            message: "Failed to fetch current user",

            error: error.message

        });

    }

};


module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    changePassword,
    getCurrentUser
};