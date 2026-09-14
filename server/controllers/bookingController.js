const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Seat = require("../models/Seat");
const Event = require("../models/Event");
const generateTicket = require("../utils/generateTicket");
const { getIO } = require("../config/socket");


const createBooking = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { eventId, seatIds } = req.body;

        session.startTransaction();

        // Find the seats that the user is currently holding
        const seats = await Seat.find({
            _id: { $in: seatIds },
            event: eventId,
            status: "HELD",
            heldBy: req.user._id,
            holdExpiresAt: { $gt: new Date() }
        }).session(session);

        // Make sure all requested seats are valid
        if (seats.length !== seatIds.length) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "One or more seats are invalid, expired, or not held by you"
            });
        }

        // Find the event
        const event = await Event.findById(eventId).session(session);

        if (!event) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Calculate total price
        const totalAmount = seats.length * event.price;

        // Generate booking ID
        const bookingId =
            "BK-" + Date.now().toString(36).toUpperCase();

        // Create booking
        const booking = await Booking.create(
            [
                {
                    bookingId,
                    user: req.user._id,
                    event: eventId,
                    seats: seatIds,
                    totalAmount,
                    status: "CONFIRMED"
                }
            ],
            { session }
        );

        // Change seats from HELD to BOOKED
        await Seat.updateMany(
            {
                _id: { $in: seatIds },
                status: "HELD",
                heldBy: req.user._id
            },
            {
                $set: {
                    status: "BOOKED",
                    heldBy: null,
                    holdExpiresAt: null
                }
            },
            { session }
        );

        await session.commitTransaction();

        // Send real-time seat updates
        const io = getIO();

        if (io) {
            for (let seat of seats) {
                io.to(`event:${eventId}`).emit("seatUpdate", {
                    seatId: seat._id,
                    seatNumber: seat.seatNumber,
                    status: "BOOKED"
                });
            }
        }

        res.status(201).json({
            message: "Booking created successfully",
            booking: booking[0]
        });

    } catch (error) {

        await session.abortTransaction();

        console.log("Booking error:", error);

        res.status(500).json({
            message: "Failed to create booking",
            error: error.message
        });

    } finally {
        session.endSession();
    }
};


const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        })
            .populate("event")
            .populate("seats")
            .sort({ createdAt: -1 });

        res.status(200).json({
            bookings: bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};


const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        })
            .populate("event")
            .populate("seats");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            booking: booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch booking",
            error: error.message
        });
    }
};


const cancelBooking = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { id } = req.params;

        session.startTransaction();

        const booking = await Booking.findOne({
            _id: id,
            user: req.user._id,
            status: "CONFIRMED"
        }).session(session);

        if (!booking) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Booking not found or already cancelled"
            });
        }

        await Seat.updateMany(
            {
                _id: { $in: booking.seats },
                status: "BOOKED"
            },
            {
                $set: {
                    status: "AVAILABLE",
                    heldBy: null,
                    holdExpiresAt: null
                }
            },
            { session }
        );

        booking.status = "CANCELLED";

        await booking.save({ session });

        await session.commitTransaction();

        // Send real-time seat updates
        const io = getIO();

        if (io) {
            for (let seatId of booking.seats) {
                io.to(`event:${booking.event}`).emit("seatUpdate", {
                    seatId: seatId,
                    status: "AVAILABLE"
                });
            }
        }

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking: booking
        });

    } catch (error) {

        await session.abortTransaction();

        console.log("Cancellation error:", error);

        res.status(500).json({
            message: "Failed to cancel booking",
            error: error.message
        });

    } finally {
        session.endSession();
    }
};


const getDigitalTicket = async (req, res) => {
    try {

        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: "CONFIRMED"
        })
            .populate("event")
            .populate("seats");

        if (!booking) {
            return res.status(404).json({
                message: "Confirmed booking not found"
            });
        }

        const ticket = await generateTicket(booking);

        res.status(200).json({
            message: "Digital ticket generated successfully",
            ticket: ticket
        });

    } catch (error) {

        console.log("Ticket generation error:", error);

        res.status(500).json({
            message: "Failed to generate digital ticket",
            error: error.message
        });
    }
};


module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getDigitalTicket
};