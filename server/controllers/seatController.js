const Seat = require("../models/Seat");
const { getIO } = require("../config/socket");


const createSeats = async (req, res) => {
    try {
        const { eventId, rows, seatsPerRow } = req.body;

        const seats = [];

        for (let row of rows) {
            for (let i = 1; i <= seatsPerRow; i++) {

                seats.push({
                    event: eventId,
                    seatNumber: `${row}${i}`,
                    row: row,
                    status: "AVAILABLE"
                });

            }
        }

        const createdSeats = await Seat.insertMany(seats);

        res.status(201).json({
            message: "Seats created successfully",
            seats: createdSeats
        });

    } catch (error) {

        // Handle duplicate seat error
        if (error.code === 11000) {
            return res.status(400).json({
                message: "One or more seats already exist for this event"
            });
        }

        res.status(500).json({
            message: "Failed to create seats",
            error: error.message
        });
    }
};


const getSeatsByEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        const seats = await Seat.find({
            event: eventId
        });

        const now = new Date();

        for (let seat of seats) {

            if (
                seat.status === "HELD" &&
                seat.holdExpiresAt &&
                seat.holdExpiresAt <= now
            ) {

                seat.status = "AVAILABLE";
                seat.heldBy = null;
                seat.holdExpiresAt = null;

                await seat.save();

                // Notify users that the seat is available again
                const io = getIO();

                if (io) {
                    io.to(`event:${eventId}`).emit("seatUpdate", {
                        seatId: seat._id,
                        seatNumber: seat.seatNumber,
                        status: "AVAILABLE"
                    });
                }
            }
        }

        const updatedSeats = await Seat.find({
            event: eventId
        });

        res.status(200).json({
            seats: updatedSeats
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch seats",
            error: error.message
        });
    }
};


const holdSeats = async (req, res) => {
    try {
        const { seatIds } = req.body;

        const holdExpiresAt = new Date(
            Date.now() + 3 * 60 * 1000
        );

        const heldSeats = [];

        for (let seatId of seatIds) {

            console.log("Trying to hold seat:", seatId);

            const seat = await Seat.findOneAndUpdate(
                {
                    _id: seatId,

                    $or: [
                        {
                            status: "AVAILABLE"
                        },
                        {
                            status: "HELD",
                            holdExpiresAt: {
                                $lte: new Date()
                            }
                        }
                    ]
                },
                {
                    $set: {
                        status: "HELD",
                        heldBy: req.user._id,
                        holdExpiresAt: holdExpiresAt
                    }
                },
                {
                    returnDocument: "after"
                }
            );

            if (!seat) {
                console.log("Seat could not be held:", seatId);

                return res.status(400).json({
                    message: "One or more seats are not available"
                });
            }

            console.log(
                "Seat successfully held:",
                seat.seatNumber
            );

            heldSeats.push(seat);

            // Send real-time update
            const io = getIO();

            if (io) {
                io.to(`event:${seat.event}`).emit("seatUpdate", {
                    seatId: seat._id,
                    seatNumber: seat.seatNumber,
                    status: "HELD",
                    holdExpiresAt: seat.holdExpiresAt
                });
            }
        }

        res.status(200).json({
            message: "Seats held successfully",
            holdExpiresAt: holdExpiresAt,
            seats: heldSeats
        });

    } catch (error) {
        console.log("Hold seat error:", error);

        res.status(500).json({
            message: "Failed to hold seats",
            error: error.message
        });
    }
};


module.exports = {
    createSeats,
    getSeatsByEvent,
    holdSeats
};