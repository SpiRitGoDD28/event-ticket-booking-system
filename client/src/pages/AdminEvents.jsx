import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function AdminEvents() {

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        date: "",
        time: "",
        price: "",
        description: ""
    });

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);


    // =====================================================
    // FETCH EVENTS
    // =====================================================

    const fetchEvents = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/events");

            setEvents(
                response.data.events || []
            );

        } catch (error) {

            console.error(
                "Error fetching events:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load events."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchEvents();

    }, []);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            previous => ({
                ...previous,
                [name]: value
            })
        );

    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setFormData({
            name: "",
            location: "",
            date: "",
            time: "",
            price: "",
            description: ""
        });

        setEditingEvent(null);

        setShowForm(false);

    };


    // =====================================================
    // OPEN CREATE FORM
    // =====================================================

    const handleCreateClick = () => {

        setFormData({
            name: "",
            location: "",
            date: "",
            time: "",
            price: "",
            description: ""
        });

        setEditingEvent(null);

        setShowForm(true);

        setError("");

    };


    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const handleEditClick = (event) => {

        setEditingEvent(event);

        setFormData({
            name: event.name || "",
            location: event.location || "",
            date: event.date
                ? event.date.split("T")[0]
                : "",
            time: event.time || "",
            price: event.price ?? "",
            description: event.description || ""
        });

        setShowForm(true);

        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =====================================================
    // SUBMIT FORM
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");


            const payload = {
                name: formData.name.trim(),
                location: formData.location.trim(),
                date: formData.date,
                time: formData.time.trim(),
                price: Number(formData.price),
                description:
                    formData.description.trim()
            };


            if (editingEvent) {

                await api.put(
                    `/events/${editingEvent._id}`,
                    payload
                );

            } else {

                await api.post(
                    "/events",
                    payload
                );

            }


            await fetchEvents();

            resetForm();


        } catch (error) {

            console.error(
                "Error saving event:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to save event."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // DELETE EVENT
    // =====================================================

    const handleDelete = async (eventId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this event?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(eventId);
            setError("");

            await api.delete(
                `/events/${eventId}`
            );

            await fetchEvents();


        } catch (error) {

            console.error(
                "Error deleting event:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete event."
            );

        } finally {

            setDeletingId(null);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="admin-page">

                <div className="container py-5">

                    <div className="events-loading">
                        Loading events...
                    </div>

                </div>

            </div>
        );

    }


    return (
        <div className="admin-page">

            <div className="container py-5">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="admin-header">

                    <div>

                        <p className="section-label">
                            ADMIN PANEL
                        </p>

                        <h1>
                            Manage <span>events.</span>
                        </h1>

                        <p>
                            Create, edit and manage all
                            events available on EventBook.
                        </p>

                    </div>


                    {!showForm && (

                        <button
                            type="button"
                            className="admin-primary-btn"
                            onClick={handleCreateClick}
                        >
                            + Create Event
                        </button>

                    )}

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="events-error mb-4">
                        {error}
                    </div>

                )}


                {/* =================================================
                    EVENT FORM
                ================================================= */}

                {showForm && (

                    <div className="admin-form-card">

                        <div className="admin-form-header">

                            <div>

                                <p className="section-label">
                                    {editingEvent
                                        ? "EDIT EVENT"
                                        : "NEW EVENT"}
                                </p>

                                <h2>
                                    {editingEvent
                                        ? "Update event."
                                        : "Create an event."}
                                </h2>

                            </div>

                            <button
                                type="button"
                                className="admin-form-close"
                                onClick={resetForm}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="admin-event-form"
                        >

                            <div className="admin-form-grid">


                                {/* EVENT NAME */}

                                <div className="admin-form-group">

                                    <label>
                                        Event Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. College Fest 2026"
                                        required
                                    />

                                </div>


                                {/* LOCATION */}

                                <div className="admin-form-group">

                                    <label>
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Kolkata"
                                        required
                                    />

                                </div>


                                {/* DATE */}

                                <div className="admin-form-group">

                                    <label>
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* TIME */}

                                <div className="admin-form-group">

                                    <label>
                                        Time
                                    </label>

                                    <input
                                        type="text"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        placeholder="e.g. 6:00 PM"
                                        required
                                    />

                                </div>


                                {/* PRICE */}

                                <div className="admin-form-group">

                                    <label>
                                        Ticket Price
                                    </label>

                                    <div className="admin-price-input">

                                        <span>
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="500"
                                            min="0"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* DESCRIPTION */}

                                <div className="admin-form-group admin-form-full">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the event..."
                                        rows="4"
                                    />

                                </div>

                            </div>


                            <div className="admin-form-actions">

                                <button
                                    type="button"
                                    className="admin-secondary-btn"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingEvent
                                            ? "Update Event"
                                            : "Create Event"}
                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* =================================================
                    EVENTS
                ================================================= */}

                {!showForm && (

                    <div className="admin-section">

                        <div className="admin-section-header">

                            <div>

                                <p className="section-label">
                                    ALL EVENTS
                                </p>

                                <h2>
                                    Your events.
                                </h2>

                            </div>

                            <span className="admin-event-count">
                                {events.length} event
                                {events.length !== 1
                                    ? "s"
                                    : ""}
                            </span>

                        </div>


                        {events.length === 0 ? (

                            <div className="admin-empty">

                                <h3>
                                    No events yet
                                </h3>

                                <p>
                                    Create your first event
                                    to start selling tickets.
                                </p>

                                <button
                                    type="button"
                                    className="admin-primary-btn"
                                    onClick={handleCreateClick}
                                >
                                    + Create Event
                                </button>

                            </div>

                        ) : (

                            <div className="admin-manage-events">

                                {events.map((event) => (

                                    <div
                                        key={event._id}
                                        className="admin-manage-event-card"
                                    >

                                        <div className="admin-manage-event-main">

                                            <div>

                                                <p className="admin-event-label">
                                                    EVENT
                                                </p>

                                                <h3>
                                                    {event.name}
                                                </h3>

                                            </div>

                                        </div>


                                        <div className="admin-manage-event-details">


                                            <div>

                                                <span>
                                                    LOCATION
                                                </span>

                                                <strong>
                                                    {event.location}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    DATE
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        event.date
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    TIME
                                                </span>

                                                <strong>
                                                    {event.time}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    PRICE
                                                </span>

                                                <strong className="admin-event-price">
                                                    ₹{event.price}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="admin-manage-event-actions">

                                            <button
                                                type="button"
                                                className="admin-edit-btn"
                                                onClick={() =>
                                                    handleEditClick(
                                                        event
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <Link
                                                to={`/admin/events/${event._id}/seats`}
                                                className="admin-seat-btn"
                                            >
                                                Configure Seats
                                            </Link>


                                            <button
                                                type="button"
                                                className="admin-delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        event._id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    event._id
                                                }
                                            >
                                                {deletingId ===
                                                event._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminEvents;