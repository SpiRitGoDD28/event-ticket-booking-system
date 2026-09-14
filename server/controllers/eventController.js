const Event = require("../models/Event");

// Create an event
const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json({
            message: "Event created successfully",
            event: event
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create event",
            error: error.message
        });
    }
};
// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();

        res.status(200).json({
            events: events
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
};
// Get one event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            event: event
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch event",
            error: error.message
        });
    }
};
// Update an event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event updated successfully",
            event: event
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update event",
            error: error.message
        });
    }
};
// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};