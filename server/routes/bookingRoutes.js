const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getDigitalTicket
} = require("../controllers/bookingController");

const {
    body,
    validationResult
} = require("express-validator");


/* ---------------- BOOKING VALIDATION ---------------- */

const bookingValidation = [

    body("eventId")
        .isMongoId()
        .withMessage("Valid event ID is required"),

    body("seatIds")
        .isArray({ min: 1 })
        .withMessage("seatIds must be a non-empty array"),

    body("seatIds.*")
        .isMongoId()
        .withMessage("Each seat ID must be valid")
];


/* ---------------- VALIDATION HANDLER ---------------- */

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


/* ---------------- ROUTES ---------------- */

const router = express.Router();


router.post(
    "/",
    protect,
    bookingValidation,
    validate,
    createBooking
);


router.get(
    "/my",
    protect,
    getMyBookings
);


router.get(
    "/:id/ticket",
    protect,
    getDigitalTicket
);


router.get(
    "/:id",
    protect,
    getBookingById
);


router.delete(
    "/:id",
    protect,
    cancelBooking
);


module.exports = router;