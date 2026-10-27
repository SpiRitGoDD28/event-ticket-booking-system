import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiMapPin
} from "react-icons/fi";

import api from "../services/api";

function EventDetails() {

    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchEvent = async () => {

            try {

                const response = await api.get(`/events/${id}`);

                setEvent(response.data.event);

            } catch (error) {

                console.error("Error fetching event:", error);

                setError("Unable to load this event.");

            } finally {

                setLoading(false);

            }
        };

        fetchEvent();

    }, [id]);


    if (loading) {

        return (
            <div className="event-details-page">

                <div className="container text-center py-5">

                    <div className="events-loading">
                        Loading event...
                    </div>

                </div>

            </div>
        );
    }


    if (error || !event) {

        return (
            <div className="event-details-page">

                <div className="container py-5">

                    <div className="events-error">
                        {error || "Event not found."}
                    </div>

                    <Link
                        to="/events"
                        className="back-events-link"
                    >
                        <FiArrowLeft />
                        Back to events
                    </Link>

                </div>

            </div>
        );
    }


    return (
        <div className="event-details-page">

            {/* Back button */}

            <div className="container">

                <Link
                    to="/events"
                    className="back-events-link"
                >
                    <FiArrowLeft />
                    Back to events
                </Link>

            </div>


            {/* Event hero */}

            <section className="event-details-hero">

                <div className="container">

                    <div className="event-details-visual">

                        <div className="event-details-category">
                            LIVE EVENT
                        </div>

                        <h1>
                            {event.name}
                        </h1>

                        <p>
                            {event.description}
                        </p>

                    </div>

                </div>

            </section>


            {/* Event information */}

            <section className="event-information">

                <div className="container">

                    <div className="row g-4">

                        {/* Main information */}

                        <div className="col-lg-8">

                            <div className="event-info-card">

                                <p className="section-label">
                                    EVENT DETAILS
                                </p>

                                <h2>
                                    Everything you need to know.
                                </h2>

                                <div className="event-info-grid">

                                    <div className="event-info-item">

                                        <div className="event-info-icon">
                                            <FiCalendar />
                                        </div>

                                        <div>
                                            <span>
                                                Date
                                            </span>

                                            <strong>
                                                {new Date(
                                                    event.date
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        weekday: "long",
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    }
                                                )}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="event-info-item">

                                        <div className="event-info-icon">
                                            <FiClock />
                                        </div>

                                        <div>
                                            <span>
                                                Time
                                            </span>

                                            <strong>
                                                {event.time}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="event-info-item">

                                        <div className="event-info-icon">
                                            <FiMapPin />
                                        </div>

                                        <div>
                                            <span>
                                                Location
                                            </span>

                                            <strong>
                                                {event.location}
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Booking card */}

                        <div className="col-lg-4">

                            <div className="booking-price-card">

                                <span className="booking-label">
                                    TICKET PRICE
                                </span>

                                <div className="booking-price">
                                    ₹{event.price}
                                </div>

                                <p>
                                    Select your preferred seat and
                                    continue to secure your booking.
                                </p>

                                <Link
                                    to={`/events/${event._id}/seats`}
                                    className="choose-seat-btn"
                                >
                                    Choose Seats
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default EventDetails;