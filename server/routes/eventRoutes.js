const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const {
    body,
    validationResult
} = require("express-validator");


const eventValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Event name is required"),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Event location is required"),

    body("date")
        .isISO8601()
        .withMessage("Please provide a valid date"),

    body("time")
        .trim()
        .notEmpty()
        .withMessage("Event time is required"),

    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number"),

    body("description")
        .optional()
        .trim()
];


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


const router = express.Router();


router.post(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    eventValidation,
    validate,
    createEvent
);


router.get(
    "/",
    getEvents
);


router.get(
    "/:id",
    getEventById
);


router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    eventValidation,
    validate,
    updateEvent
);


router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteEvent
);


module.exports = router;
