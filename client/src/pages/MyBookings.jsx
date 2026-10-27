import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    const fetchBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/bookings/my");

            setBookings(
                response.data.bookings || []
            );

        } catch (error) {

            console.error(
                "Error fetching bookings:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your bookings."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchBookings();

    }, []);

    const formatDate = (date) => {

        if (!date) {
            return "â€”";
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

    const handleCancelBooking = async (bookingId) => {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setCancellingId(bookingId);
            setError("");

            await api.delete(
                `/bookings/${bookingId}`
            );

            /*
             * Fetch the latest bookings again so that
             * the updated status comes directly from
             * the backend.
             */

            await fetchBookings();

        } catch (error) {

            console.error(
                "Error cancelling booking:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to cancel the booking."
            );

        } finally {

            setCancellingId(null);

        }
    };

    if (loading) {

        return (
            <div className="bookings-page">

                <div className="container py-5">

                    <div className="events-loading">
                        Loading your bookings...
                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="bookings-page">

            <div className="container py-5">

                <div className="bookings-header">

                    <p className="section-label">
                        YOUR BOOKINGS
                    </p>

                    <h1>
                        My <span>bookings.</span>
                    </h1>

                    <p>
                        Keep track of your events, seats,
                        and booking details in one place.
                    </p>

                </div>

                {error && (

                    <div className="events-error mb-4">
                        {error}
                    </div>

                )}

                {bookings.length === 0 && !error && (

                    <div className="bookings-empty">

                        <div className="bookings-empty-icon">
                            ðŸŽŸ
                        </div>

                        <h2>
                            No bookings yet
                        </h2>

                        <p>
                            You haven't booked any events yet.
                            Find something exciting and reserve
                            your seat.
                        </p>

                        <Link
                            to="/events"
                            className="event-view-btn"
                        >
                            Explore Events
                        </Link>

                    </div>

                )}

                {bookings.length > 0 && (

                    <div className="bookings-list">

                        {bookings.map((booking) => {

                            const event =
                                booking.event;

                            const seats =
                                booking.seats || [];

                            const isConfirmed =
                                booking.status === "CONFIRMED";

                            const isCancelling =
                                cancellingId === booking._id;

                            return (
                                <div
                                    key={booking._id}
                                    className="booking-card"
                                >

                                    {/* =========================
                                        CARD HEADER
                                    ========================= */}

                                    <div className="booking-card-top">

                                        <div>

                                            <p className="booking-card-label">
                                                EVENT
                                            </p>

                                            <h2>
                                                {event?.name ||
                                                    "Event"}
                                            </h2>

                                        </div>

                                        <span
                                            className={
                                                isConfirmed
                                                    ? "booking-status confirmed"
                                                    : "booking-status cancelled"
                                            }
                                        >
                                            {booking.status}
                                        </span>

                                    </div>


                                    {/* =========================
                                        EVENT INFORMATION
                                    ========================= */}

                                    <div className="booking-divider"></div>

                                    <div className="booking-details-grid">

                                        <div>

                                            <span>
                                                Booking ID
                                            </span>

                                            <strong>
                                                {booking.bookingId}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Location
                                            </span>

                                            <strong>
                                                {event?.location ||
                                                    "â€”"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    event?.date
                                                )}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Time
                                            </span>

                                            <strong>
                                                {event?.time ||
                                                    "â€”"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* =========================
                                        SEATS + AMOUNT
                                    ========================= */}

                                    <div className="booking-divider"></div>

                                    <div className="booking-card-bottom">

                                        <div>

                                            <span className="booking-bottom-label">
                                                SEATS
                                            </span>

                                            <div className="booking-seats">

                                                {seats.length > 0 ? (

                                                    seats.map(
                                                        (seat) => (

                                                            <span
                                                                key={
                                                                    seat._id
                                                                }
                                                                className="booking-seat"
                                                            >
                                                                {
                                                                    seat.seatNumber
                                                                }
                                                            </span>

                                                        )
                                                    )

                                                ) : (

                                                    <span>
                                                        No seats
                                                    </span>

                                                )}

                                            </div>

                                        </div>


                                        <div className="booking-amount">

                                            <span>
                                                TOTAL
                                            </span>

                                            <strong>
                                                â‚¹
                                                {
                                                    booking.totalAmount
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* =========================
                                        ACTIONS
                                    ========================= */}
                                    <div className="booking-card-actions">

    {isConfirmed && (

        <>

            <Link
                to={`/bookings/${booking._id}/ticket`}
                className="event-view-btn"
            >
                View Digital Ticket
                <span>
                    â†’
                </span>
            </Link>

            <button
                type="button"
                className="booking-cancel-btn"
                onClick={() =>
                    handleCancelBooking(
                        booking._id
                    )
                }
                disabled={
                    isCancelling
                }
            >
                {isCancelling
                    ? "Cancelling..."
                    : "Cancel Booking"
                }
            </button>

        </>

    )}

    {!isConfirmed && (

        <span className="booking-cancelled-text">
            This booking has been
            cancelled.
        </span>

    )}

</div>

                                </div>
                            );

                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

export default MyBookings;
