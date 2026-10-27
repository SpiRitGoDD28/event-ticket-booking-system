
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FiMapPin,
    FiClock,
    FiCalendar,
    FiArrowRight
} from "react-icons/fi";

import api from "../services/api";

function Events() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchEvents = async () => {

            try {

                const response =
                    await api.get("/events");

                console.log(
                    "Backend response:",
                    response.data
                );

                setEvents(
                    response.data.events || []
                );

            } catch (error) {

                console.error(
                    "Error fetching events:",
                    error
                );

                setError(
                    "Unable to load events."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchEvents();

    }, []);


    if (loading) {

        return (
            <div className="events-page">

                <div className="container py-5 text-center">

                    <div className="events-loading">
                        Loading events...
                    </div>

                </div>

            </div>
        );

    }


    if (error) {

        return (
            <div className="events-page">

                <div className="container py-5">

                    <div className="events-error">
                        {error}
                    </div>

                </div>

            </div>
        );

    }


    return (

        <div className="events-page">

            {/* =================================
                HEADER
            ================================= */}

            <section className="events-header">

                <div className="container">

                    <p className="section-label">
                        EVENTBOOK
                    </p>

                    <h1 className="events-title">

                        Find your next

                        <span>
                            {" "}experience.
                        </span>

                    </h1>

                    <p className="events-subtitle">
                        Discover upcoming events, choose your seat,
                        and make your plans unforgettable.
                    </p>

                </div>

            </section>


            {/* =================================
                EVENTS
            ================================= */}

            <section className="events-list-section">

                <div className="container">

                    {events.length === 0 ? (

                        <div className="no-events">

                            <h3>
                                No events available
                            </h3>

                            <p>
                                Check back soon for upcoming experiences.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {events.map((event) => (

                                <div
                                    className="col-lg-6"
                                    key={event._id}
                                >

                                    <div className="event-card">

                                        {/* Visual */}

                                        <div className="event-card-visual">

                                            <div className="event-card-overlay">

                                                <span className="event-category">
                                                    LIVE EVENT
                                                </span>

                                                <h2>
                                                    {event.name}
                                                </h2>

                                            </div>

                                        </div>


                                        {/* Body */}

                                        <div className="event-card-body">

                                            <p className="event-description">
                                                {event.description}
                                            </p>


                                            <div className="event-details">

                                                <div className="event-detail">

                                                    <FiCalendar />

                                                    <span>
                                                        {new Date(
                                                            event.date
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )}
                                                    </span>

                                                </div>


                                                <div className="event-detail">

                                                    <FiClock />

                                                    <span>
                                                        {event.time}
                                                    </span>

                                                </div>


                                                <div className="event-detail">

                                                    <FiMapPin />

                                                    <span>
                                                        {event.location}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* Footer */}

                                            <div className="event-card-footer">

                                                <div className="event-price-container">

                                                    <span className="price-label">
                                                        Starting from
                                                    </span>

                                                    <span className="event-price">
                                                        ₹{event.price}
                                                    </span>

                                                </div>


                                                <Link
                                                    to={`/events/${event._id}`}
                                                    className="event-view-btn"
                                                >
                                                    <span>
                                                        View Event
                                                    </span>

                                                    <FiArrowRight />

                                                </Link>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </section>

        </div>

    );

}

export default Events;