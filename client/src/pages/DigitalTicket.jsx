import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function DigitalTicket() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchTicket = async () => {

            try {

                const response =
                    await api.get(
                        `/bookings/${id}/ticket`
                    );

                setTicket(
                    response.data.ticket
                );

            } catch (error) {

                console.error(
                    "Error fetching digital ticket:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load digital ticket."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchTicket();

    }, [id]);


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


    if (loading) {

        return (
            <div className="digital-ticket-page">

                <div className="container py-5">

                    <div className="events-loading">
                        Loading your digital ticket...
                    </div>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="digital-ticket-page">

                <div className="container py-5">

                    <div className="events-error">
                        {error}
                    </div>

                    <button
                        type="button"
                        className="ticket-back-btn"
                        onClick={() =>
                            navigate("/bookings")
                        }
                    >
                        ← Back to My Bookings
                    </button>

                </div>

            </div>
        );
    }


    if (!ticket) {
        return null;
    }


    return (
        <div className="digital-ticket-page">

            <div className="container py-5">

                <div className="digital-ticket-header">

                    <p className="section-label">
                        DIGITAL TICKET
                    </p>

                    <h1>
                        Your <span>ticket.</span>
                    </h1>

                    <p>
                        Show this ticket and QR code at
                        the event entrance.
                    </p>

                </div>


                <div className="digital-ticket-wrapper">

                    <div className="digital-ticket-card">


                        {/* =========================
                            TICKET BRANDING
                        ========================= */}

                        <div className="digital-ticket-brand">

                            <div className="ticket-brand-mark">
                                EB
                            </div>

                            <div>

                                <div className="ticket-brand-name">
                                    EventBook
                                </div>

                                <div className="ticket-brand-subtitle">
                                    DIGITAL EVENT TICKET
                                </div>

                            </div>

                        </div>


                        <div className="ticket-divider"></div>


                        {/* =========================
                            EVENT INFORMATION
                        ========================= */}

                        <div className="ticket-event-section">

                            <p>
                                EVENT
                            </p>

                            <h2>
                                {ticket.event}
                            </h2>

                        </div>


                        <div className="ticket-info-grid">

                            <div className="ticket-info-item">

                                <span>
                                    DATE
                                </span>

                                <strong>
                                    {formatDate(
                                        ticket.date
                                    )}
                                </strong>

                            </div>


                            <div className="ticket-info-item">

                                <span>
                                    TIME
                                </span>

                                <strong>
                                    {ticket.time || "—"}
                                </strong>

                            </div>


                            <div className="ticket-info-item">

                                <span>
                                    LOCATION
                                </span>

                                <strong>
                                    {ticket.location || "—"}
                                </strong>

                            </div>


                            <div className="ticket-info-item">

                                <span>
                                    BOOKING ID
                                </span>

                                <strong>
                                    {ticket.bookingId}
                                </strong>

                            </div>

                        </div>


                        <div className="ticket-divider"></div>


                        {/* =========================
                            SEATS
                        ========================= */}

                        <div className="ticket-seats-section">

                            <div>

                                <span className="ticket-section-label">
                                    SEAT(S)
                                </span>

                                <div className="ticket-seat-list">

                                    {ticket.seats?.map(
                                        (seat, index) => (

                                            <span
                                                key={index}
                                                className="ticket-seat"
                                            >
                                                {seat}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>


                            <div className="ticket-price">

                                <span>
                                    TOTAL
                                </span>

                                <strong>
                                    ₹
                                    {ticket.totalAmount}
                                </strong>

                            </div>

                        </div>


                        <div className="ticket-divider"></div>


                        {/* =========================
                            QR CODE
                        ========================= */}

                        <div className="ticket-qr-section">

                            <div>

                                <h3>
                                    Scan to verify
                                </h3>

                                <p>
                                    Present this QR code at
                                    the entrance for ticket
                                    verification.
                                </p>

                            </div>


                            <div className="ticket-qr-wrapper">

                                <img
                                    src={ticket.qrCode}
                                    alt="Digital ticket QR code"
                                    className="ticket-qr"
                                />

                            </div>

                        </div>


                        <div className="ticket-footer">

                            <span>
                                EventBook
                            </span>

                            <span>
                                Keep this ticket safe
                            </span>

                        </div>

                    </div>


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    <div className="ticket-actions">

                        <button
                            type="button"
                            className="ticket-back-btn"
                            onClick={() =>
                                navigate("/bookings")
                            }
                        >
                            ← Back to My Bookings
                        </button>


                        <button
                            type="button"
                            className="ticket-print-btn"
                            onClick={() =>
                                window.print()
                            }
                        >
                            Print Ticket
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DigitalTicket;