import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function AdminDashboard() {

    const [stats, setStats] = useState(null);
    const [eventStats, setEventStats] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // FETCH DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                setLoading(true);
                setError("");


                const [
                    statsResponse,
                    eventsResponse
                ] = await Promise.all([

                    api.get("/admin/stats"),

                    api.get("/admin/events")

                ]);


                setStats(
                    statsResponse.data
                );


                setEventStats(
                    eventsResponse.data.eventStats || []
                );


            } catch (error) {

                console.error(
                    "Error loading admin dashboard:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load admin dashboard."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchDashboardData();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="admin-page">

                <div className="container py-5">

                    <div className="events-loading">
                        Loading admin dashboard...
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
                            Admin <span>Dashboard.</span>
                        </h1>

                        <p>
                            Monitor your events, bookings,
                            tickets and revenue from one place.
                        </p>

                    </div>


                    <Link
                        to="/admin/events"
                        className="admin-primary-btn"
                    >
                        + Create Event
                    </Link>

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
                    STAT CARDS
                ================================================= */}

                {stats && (

                    <div className="admin-stats-grid">


                        {/* USERS */}

                        <div className="admin-stat-card">

                            <span className="admin-stat-label">
                                TOTAL USERS
                            </span>

                            <strong>
                                {stats.totalUsers}
                            </strong>

                            <span className="admin-stat-description">
                                Registered users
                            </span>

                        </div>


                        {/* EVENTS */}

                        <div className="admin-stat-card">

                            <span className="admin-stat-label">
                                TOTAL EVENTS
                            </span>

                            <strong>
                                {stats.totalEvents}
                            </strong>

                            <span className="admin-stat-description">
                                Active events
                            </span>

                        </div>


                        {/* BOOKINGS */}

                        <div className="admin-stat-card">

                            <span className="admin-stat-label">
                                TOTAL BOOKINGS
                            </span>

                            <strong>
                                {stats.totalBookings}
                            </strong>

                            <span className="admin-stat-description">
                                All bookings
                            </span>

                        </div>


                        {/* TICKETS */}

                        <div className="admin-stat-card">

                            <span className="admin-stat-label">
                                TICKETS SOLD
                            </span>

                            <strong>
                                {stats.totalTicketsSold}
                            </strong>

                            <span className="admin-stat-description">
                                Seats booked
                            </span>

                        </div>


                        {/* REVENUE */}

                        <div className="admin-stat-card admin-stat-revenue">

                            <span className="admin-stat-label">
                                TOTAL REVENUE
                            </span>

                            <strong>
                                ₹{stats.totalRevenue}
                            </strong>

                            <span className="admin-stat-description">
                                Booking revenue
                            </span>

                        </div>


                    </div>

                )}


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="admin-section">

                    <div className="admin-section-header">

                        <div>

                            <p className="section-label">
                                QUICK ACTIONS
                            </p>

                            <h2>
                                Manage EventBook
                            </h2>

                        </div>

                    </div>


                    <div className="admin-actions-grid">


                        <Link
                            to="/admin/events"
                            className="admin-action-card"
                        >

                            <span className="admin-action-icon">
                                +
                            </span>

                            <div>

                                <h3>
                                    Manage Events
                                </h3>

                                <p>
                                    Create, edit and remove events.
                                </p>

                            </div>

                            <span className="admin-action-arrow">
                                →
                            </span>

                        </Link>


                        <Link
                            to="/admin/bookings"
                            className="admin-action-card"
                        >

                            <span className="admin-action-icon">
                                🎟
                            </span>

                            <div>

                                <h3>
                                    View Bookings
                                </h3>

                                <p>
                                    Monitor all customer bookings.
                                </p>

                            </div>

                            <span className="admin-action-arrow">
                                →
                            </span>

                        </Link>


                    </div>

                </div>


                {/* =================================================
                    EVENT PERFORMANCE
                ================================================= */}

                <div className="admin-section">

                    <div className="admin-section-header">

                        <div>

                            <p className="section-label">
                                EVENT PERFORMANCE
                            </p>

                            <h2>
                                Your events.
                            </h2>

                        </div>


                        <Link
                            to="/admin/events"
                            className="admin-view-all"
                        >
                            Manage Events →
                        </Link>

                    </div>


                    {eventStats.length === 0 ? (

                        <div className="admin-empty">

                            <h3>
                                No event performance data
                            </h3>

                            <p>
                                Create an event and start accepting
                                bookings to see performance here.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-events-list">

                            {eventStats.map((event) => (

                                <div
                                    key={event.eventId}
                                    className="admin-event-row"
                                >

                                    <div className="admin-event-main">

                                        <span className="admin-event-name">
                                            {event.eventName}
                                        </span>

                                    </div>


                                    <div className="admin-event-info">


                                        <div>

                                            <span>
                                                BOOKINGS
                                            </span>

                                            <strong>
                                                {event.totalBookings}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                TICKETS
                                            </span>

                                            <strong>
                                                {event.totalTicketsSold}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                REVENUE
                                            </span>

                                            <strong>
                                                ₹{event.totalRevenue}
                                            </strong>

                                        </div>


                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;