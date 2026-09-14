const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalEvents = await Event.countDocuments();

        const totalBookings = await Booking.countDocuments({
            status: "CONFIRMED"
        });

        const bookingStats = await Booking.aggregate([
            {
                $match: {
                    status: "CONFIRMED"
                }
            },
            {
                $group: {
                    _id: null,

                    totalTicketsSold: {
                        $sum: {
                            $size: "$seats"
                        }
                    },

                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const totalTicketsSold =
            bookingStats.length > 0
                ? bookingStats[0].totalTicketsSold
                : 0;

        const totalRevenue =
            bookingStats.length > 0
                ? bookingStats[0].totalRevenue
                : 0;

        res.status(200).json({
            totalUsers: totalUsers,
            totalEvents: totalEvents,
            totalBookings: totalBookings,
            totalTicketsSold: totalTicketsSold,
            totalRevenue: totalRevenue
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admin statistics",
            error: error.message
        });
    }
};


// Event-wise statistics
const getEventStats = async (req, res) => {
    try {
        const eventStats = await Booking.aggregate([
            {
                $match: {
                    status: "CONFIRMED"
                }
            },

            {
                $group: {
                    _id: "$event",

                    totalTicketsSold: {
                        $sum: {
                            $size: "$seats"
                        }
                    },

                    totalRevenue: {
                        $sum: "$totalAmount"
                    },

                    totalBookings: {
                        $sum: 1
                    }
                }
            },

            {
                $lookup: {
                    from: "events",
                    localField: "_id",
                    foreignField: "_id",
                    as: "event"
                }
            },

            {
                $unwind: "$event"
            },

            {
                $project: {
                    _id: 0,
                    eventId: "$event._id",
                    eventName: "$event.name",
                    totalTicketsSold: 1,
                    totalRevenue: 1,
                    totalBookings: 1
                }
            }
        ]);

        res.status(200).json({
            eventStats: eventStats
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch event statistics",
            error: error.message
        });
    }
};


// Get all bookings for admin
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "-password")
            .populate("event")
            .populate("seats")
            .sort({ createdAt: -1 });

        res.status(200).json({
            bookings: bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch all bookings",
            error: error.message
        });
    }
};


module.exports = {
    getAdminStats,
    getEventStats,
    getAllBookings
};