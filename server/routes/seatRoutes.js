const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createSeats,
    getSeatsByEvent,
    holdSeats
} = require("../controllers/seatController");

const {
    body,
    validationResult
} = require("express-validator");


/* ---------------- CREATE SEATS VALIDATION ---------------- */

const createSeatValidation = [

    body("eventId")
        .isMongoId()
        .withMessage("Valid event ID is required"),

    body("rows")
        .isArray({ min: 1 })
        .withMessage("Rows must be a non-empty array"),

    body("rows.*")
        .trim()
        .notEmpty()
        .withMessage("Row cannot be empty"),

    body("seatsPerRow")
        .isInt({ min: 1 })
        .withMessage("Seats per row must be at least 1")
];


/* ---------------- HOLD SEATS VALIDATION ---------------- */

const holdSeatsValidation = [

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
    authorizeRoles("ADMIN"),
    createSeatValidation,
    validate,
    createSeats
);


router.get(
    "/:eventId",
    protect,
    getSeatsByEvent
);


router.post(
    "/hold",
    protect,
    holdSeatsValidation,
    validate,
    holdSeats
);


module.exports = router;