const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },

    resetOtpHash: {
        type: String,
        default: null
    },

    resetOtpExpiresAt: {
        type: Date,
        default: null
    },

    resetTokenHash: {
        type: String,
        default: null
    },

    resetTokenExpiresAt: {
        type: Date,
        default: null
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;