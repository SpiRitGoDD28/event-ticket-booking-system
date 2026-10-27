const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    changePassword,
    getCurrentUser
} = require("../controllers/authController");

const rateLimit = require("express-rate-limit");

const {
    body,
    validationResult
} = require("express-validator");


// =====================================================
// RATE LIMITERS
// =====================================================

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many requests, please try again later."
    }
});


const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message:
            "Too many password reset attempts. Please try again later."
    }
});


// =====================================================
// VALIDATION
// =====================================================

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
];


const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];


const forgotPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
];


const verifyOtpValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("otp")
        .trim()
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage("OTP must be a 6-digit number")
];


const resetPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("resetToken")
        .trim()
        .notEmpty()
        .withMessage("Reset token is required"),

    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters")
];


const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters")
];


// =====================================================
// VALIDATION MIDDLEWARE
// =====================================================

const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });

    }

    next();
};


// =====================================================
// ROUTER
// =====================================================

const router = express.Router();


// REGISTER

router.post(
    "/register",
    registerValidation,
    validate,
    registerUser
);


// LOGIN

router.post(
    "/login",
    loginValidation,
    validate,
    authLimiter,
    loginUser
);

// CURRENT USER

router.get(
    "/me",
    protect,
    getCurrentUser
);


// FORGOT PASSWORD

router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validate,
    passwordResetLimiter,
    forgotPassword
);


// VERIFY OTP

router.post(
    "/verify-otp",
    verifyOtpValidation,
    validate,
    passwordResetLimiter,
    verifyOtp
);


// RESET PASSWORD

router.post(
    "/reset-password",
    resetPasswordValidation,
    validate,
    passwordResetLimiter,
    resetPassword
);


// CHANGE PASSWORD

router.put(
    "/change-password",
    protect,
    changePasswordValidation,
    validate,
    passwordResetLimiter,
    changePassword
);


module.exports = router;