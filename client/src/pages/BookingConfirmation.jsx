import { Link, useLocation } from "react-router-dom";

function BookingConfirmation() {

    const location = useLocation();

    const booking =
        location.state?.booking;


    if (!booking) {

        return (
            <div className="confirmation-page">

                <div className="container">

                    <div className="confirmation-empty">

                        <h2>
                            Booking not found
                        </h2>

                        <p>
                            We could not find the booking
                            information for this page.
                        </p>

                        <Link
                            to="/events"
                            className="event-view-btn"
                        >
                            Browse Events
                        </Link>

                    </div>

                </div>

            </div>
        );

    }


    const event =
        booking.event;


    const seats =
        booking.seats || [];


    return (
        <div className="confirmation-page">

            <div className="container py-5">

                <div className="confirmation-header">

                    <div className="confirmation-icon">
                        ✓
                    </div>

                    <p className="section-label">
                        BOOKING CONFIRMED
                    </p>

                    <h1>
                        You're <span>going.</span>
                    </h1>

                    <p>
                        Your booking has been successfully
                        confirmed.
                    </p>

                </div>


                <div className="confirmation-card">

                    <div className="confirmation-booking-id">

                        <span>
                            BOOKING ID
                        </span>

                        <strong>
                            {booking.bookingId}
                        </strong>

                    </div>


                    <div className="confirmation-divider"></div>


                    <div className="confirmation-event">

                        <p className="checkout-card-label">
                            EVENT
                        </p>

                        <h2>
                            {event?.name || "Event"}
                        </h2>


                        <div className="confirmation-details">

                            <div>

                                <span>
                                    Location
                                </span>

                                <strong>
                                    {event?.location || "—"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Date
                                </span>

                                <strong>
                                    {event?.date
                                        ? new Date(
                                            event.date
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            }
                                        )
                                        : "—"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Time
                                </span>

                                <strong>
                                    {event?.time || "—"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    <div className="confirmation-divider"></div>


                    <div className="confirmation-bottom">

                        <div>

                            <p className="checkout-card-label">
                                SEATS
                            </p>

                            <div className="confirmation-seats">

                                {seats.map(
                                    (seat, index) => (

                                        <span
                                            key={
                                                seat._id ||
                                                index
                                            }
                                            className="checkout-seat"
                                        >
                                            {seat.seatNumber ||
                                                seat}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>


                        <div className="confirmation-total">

                            <span>
                                TOTAL PAID
                            </span>

                            <strong>
                                ₹{booking.totalAmount}
                            </strong>

                        </div>

                    </div>

                </div>


                <div className="confirmation-actions">

                    <Link
                        to="/events"
                        className="event-view-btn"
                    >
                        Browse More Events
                    </Link>

                    <Link
                        to="/"
                        className="learn-btn"
                    >
                        Back to Home
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default BookingConfirmation;