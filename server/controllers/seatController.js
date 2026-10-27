const Seat = require("../models/Seat");
const Event = require("../models/Event");
const { getIO } = require("../config/socket");


// =====================================================
// CREATE SEATS
// =====================================================

const createSeats = async (req, res) => {

    try {

        const {
            eventId,
            rows,
            seatsPerRow
        } = req.body;


        // Check event exists

        const event =
            await Event.findById(eventId);

        if (!event) {

            return res.status(404).json({
                message: "Event not found"
            });

        }


        const seats = [];


        for (let row of rows) {

            for (
                let i = 1;
                i <= seatsPerRow;
                i++
            ) {

                seats.push({

                    event: eventId,

                    seatNumber:
                        `${row}${i}`,

                    row: row,

                    status:
                        "AVAILABLE"

                });

            }

        }


        const createdSeats =
            await Seat.insertMany(seats);


        res.status(201).json({

            message:
                "Seats created successfully",

            seats:
                createdSeats

        });


    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({

                message:
                    "One or more seats already exist for this event"

            });

        }


        res.status(500).json({

            message:
                "Failed to create seats",

            error:
                error.message

        });

    }

};


// =====================================================
// GET SEATS BY EVENT
// =====================================================

const getSeatsByEvent = async (req, res) => {

    try {

        const eventId =
            req.params.eventId;


        const seats =
            await Seat.find({
                event: eventId
            });


        const now =
            new Date();


        // Release expired holds

        for (let seat of seats) {

            if (

                seat.status === "HELD" &&

                seat.holdExpiresAt &&

                seat.holdExpiresAt <= now

            ) {

                seat.status =
                    "AVAILABLE";

                seat.heldBy =
                    null;

                seat.holdExpiresAt =
                    null;


                await seat.save();


                const io =
                    getIO();


                if (io) {

                    io.to(
                        `event:${eventId}`
                    ).emit(
                        "seatUpdate",
                        {

                            seatId:
                                seat._id,

                            seatNumber:
                                seat.seatNumber,

                            status:
                                "AVAILABLE"

                        }
                    );

                }

            }

        }


        const updatedSeats =
            await Seat.find({
                event: eventId
            });


        res.status(200).json({

            seats:
                updatedSeats

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch seats",

            error:
                error.message

        });

    }

};


// =====================================================
// HOLD SEATS
// =====================================================

const holdSeats = async (req, res) => {

    try {

        const {
            seatIds
        } = req.body;


        const holdExpiresAt =
            new Date(
                Date.now() +
                3 * 60 * 1000
            );


        const heldSeats = [];


        for (
            let seatId
            of seatIds
        ) {

            console.log(
                "Trying to hold seat:",
                seatId
            );


            const seat =
                await Seat.findOneAndUpdate(

                    {

                        _id:
                            seatId,

                        $or: [

                            {
                                status:
                                    "AVAILABLE"
                            },

                            {

                                status:
                                    "HELD",

                                holdExpiresAt: {
                                    $lte:
                                        new Date()
                                }

                            }

                        ]

                    },

                    {

                        $set: {

                            status:
                                "HELD",

                            heldBy:
                                req.user._id,

                            holdExpiresAt:
                                holdExpiresAt

                        }

                    },

                    {

                        returnDocument:
                            "after"

                    }

                );


            if (!seat) {

                console.log(
                    "Seat could not be held:",
                    seatId
                );


                return res.status(400).json({

                    message:
                        "One or more seats are not available"

                });

            }


            console.log(
                "Seat successfully held:",
                seat.seatNumber
            );


            heldSeats.push(seat);


            const io =
                getIO();


            if (io) {

                io.to(
                    `event:${seat.event}`
                ).emit(
                    "seatUpdate",
                    {

                        seatId:
                            seat._id,

                        seatNumber:
                            seat.seatNumber,

                        status:
                            "HELD",

                        holdExpiresAt:
                            seat.holdExpiresAt

                    }
                );

            }

        }


        res.status(200).json({

            message:
                "Seats held successfully",

            holdExpiresAt:
                holdExpiresAt,

            seats:
                heldSeats

        });


    } catch (error) {

        console.log(
            "Hold seat error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to hold seats",

            error:
                error.message

        });

    }

};


// =====================================================
// UPDATE SEATING CONFIGURATION
// =====================================================

const updateSeatConfiguration = async (
    req,
    res
) => {

    try {

        const {
            eventId,
            rows,
            seatsPerRow
        } = req.body;


        // -------------------------------------------------
        // CHECK EVENT
        // -------------------------------------------------

        const event =
            await Event.findById(eventId);


        if (!event) {

            return res.status(404).json({

                message:
                    "Event not found"

            });

        }


        // -------------------------------------------------
        // CREATE DESIRED SEAT NUMBERS
        // -------------------------------------------------

        const desiredSeats =
            new Set();


        for (let row of rows) {

            for (
                let i = 1;
                i <= seatsPerRow;
                i++
            ) {

                desiredSeats.add(
                    `${row}${i}`
                );

            }

        }


        // -------------------------------------------------
        // GET EXISTING SEATS
        // -------------------------------------------------

        const existingSeats =
            await Seat.find({
                event: eventId
            });


        // -------------------------------------------------
        // CHECK PROTECTED SEATS
        // -------------------------------------------------

        const protectedSeats =
            existingSeats.filter(
                seat =>
                    seat.status === "BOOKED" ||
                    seat.status === "HELD"
            );


        const conflictingProtectedSeats =
            protectedSeats.filter(
                seat =>
                    !desiredSeats.has(
                        seat.seatNumber
                    )
            );


        if (
            conflictingProtectedSeats.length >
            0
        ) {

            return res.status(400).json({

                message:
                    "The seating layout cannot be reduced because some seats are already booked or held.",

                protectedSeats:
                    conflictingProtectedSeats.map(
                        seat =>
                            seat.seatNumber
                    )

            });

        }


        // -------------------------------------------------
        // REMOVE UNUSED AVAILABLE SEATS
        // -------------------------------------------------

        const seatsToRemove =
            existingSeats.filter(
                seat =>
                    seat.status === "AVAILABLE" &&
                    !desiredSeats.has(
                        seat.seatNumber
                    )
            );


        if (
            seatsToRemove.length > 0
        ) {

            await Seat.deleteMany({

                _id: {

                    $in:
                        seatsToRemove.map(
                            seat =>
                                seat._id
                        )

                }

            });

        }


        // -------------------------------------------------
        // CREATE MISSING SEATS
        // -------------------------------------------------

        const existingSeatNumbers =
            new Set(
                existingSeats.map(
                    seat =>
                        seat.seatNumber
                )
            );


        const seatsToCreate = [];


        for (
            let seatNumber
            of desiredSeats
        ) {

            if (
                !existingSeatNumbers.has(
                    seatNumber
                )
            ) {

                const row =
                    seatNumber.match(
                        /^[A-Z]+/
                    )[0];


                seatsToCreate.push({

                    event:
                        eventId,

                    seatNumber:
                        seatNumber,

                    row:
                        row,

                    status:
                        "AVAILABLE",

                    heldBy:
                        null,

                    holdExpiresAt:
                        null

                });

            }

        }


        let createdSeats = [];


        if (
            seatsToCreate.length > 0
        ) {

            createdSeats =
                await Seat.insertMany(
                    seatsToCreate
                );

        }


        // -------------------------------------------------
        // GET UPDATED SEATS
        // -------------------------------------------------

        const updatedSeats =
            await Seat.find({
                event: eventId
            });


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        res.status(200).json({

            message:
                "Seating configuration updated successfully",

            seats:
                updatedSeats,

            created:
                createdSeats.length,

            removed:
                seatsToRemove.length

        });


    } catch (error) {

        console.log(
            "Seat configuration update error:",
            error
        );


        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                message:
                    "One or more seats already exist."

            });

        }


        res.status(500).json({

            message:
                "Failed to update seating configuration",

            error:
                error.message

        });

    }

};


module.exports = {

    createSeats,

    getSeatsByEvent,

    holdSeats,

    updateSeatConfiguration

};