const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        seats: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seat",
                required: true
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["CONFIRMED", "CANCELLED"],
            default: "CONFIRMED"
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;