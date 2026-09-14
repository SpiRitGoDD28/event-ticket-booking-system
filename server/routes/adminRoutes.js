const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAdminStats,
    getEventStats,
    getAllBookings
} = require("../controllers/adminController");

const router = express.Router();

router.get(
    "/stats",
    protect,
    authorizeRoles("ADMIN"),
    getAdminStats
);

router.get(
    "/events",
    protect,
    authorizeRoles("ADMIN"),
    getEventStats
);

router.get(
    "/bookings",
    protect,
    authorizeRoles("ADMIN"),
    getAllBookings
);

module.exports = router;