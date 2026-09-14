const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    seatNumber: {
        type: String,
        required: true
    },

    row: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["AVAILABLE", "HELD", "BOOKED"],
        default: "AVAILABLE"
    },

    heldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    holdExpiresAt: {
        type: Date,
        default: null
    }
});


/* Prevent duplicate seat numbers within the same event */

seatSchema.index(
    { event: 1, seatNumber: 1 },
    { unique: true }
);


const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;