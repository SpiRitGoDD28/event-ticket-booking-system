import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    Link
} from "react-router-dom";

import api from "../services/api";

function Checkout() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        event,
        selectedSeats,
        holdExpiresAt
    } = location.state || {};

    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ---------------- COUNTDOWN ---------------- */

    useEffect(() => {

        if (!holdExpiresAt) {
            setTimeLeft(0);
            return;
        }

        const updateTimer = () => {

            const remaining =
                new Date(holdExpiresAt).getTime() -
                Date.now();

            if (remaining <= 0) {

                setTimeLeft(0);

                setError(
                    "Your seat reservation has expired. Please select your seats again."
                );

                return;
            }

            setTimeLeft(
                Math.ceil(remaining / 1000)
            );

        };

        updateTimer();

        const timer = setInterval(
            updateTimer,
            1000
        );

        return () => {
            clearInterval(timer);
        };

    }, [holdExpiresAt]);


    /* ---------------- FORMAT TIME ---------------- */

    const formatTime = (seconds) => {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;

    };


    /* ---------------- CHECKOUT DATA ---------------- */

    if (!event || !selectedSeats) {

        return (
            <div className="checkout-page">

                <div className="container">

                    <div className="checkout-empty">

                        <h2>
                            Checkout unavailable
                        </h2>

                        <p>
                            Your booking information could not
                            be found.
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


    const pricePerSeat =
        Number(event.price) || 0;

    const totalAmount =
        selectedSeats.length *
        pricePerSeat;


    /* ---------------- CONFIRM BOOKING ---------------- */

    const handleConfirmBooking = async () => {

        if (timeLeft <= 0) {

            setError(
                "Your seat reservation has expired. Please select your seats again."
            );

            return;
        }

        setError("");
        setLoading(true);

        try {

            const seatIds =
                selectedSeats.map(
                    (seat) => seat._id
                );

            const response =
                await api.post(
                    "/bookings",
                    {
                        eventId: event._id,
                        seatIds
                    }
                );

            console.log(
                "Booking response:",
                response.data
            );

            const booking =
                response.data.booking;

            navigate(
                `/booking-confirmation/${booking._id}`,
                {
                    state: {
                        booking
                    }
                }
            );

        } catch (error) {

            console.error(
                "Booking error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to confirm your booking."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ---------------- PAGE ---------------- */

    return (
        <div className="checkout-page">

            <div className="container py-5">

                <div className="checkout-header">

                    <p className="section-label">
                        CHECKOUT
                    </p>

                    <h1>
                        Confirm your <span>booking.</span>
                    </h1>

                    <p>
                        Review your event and seat details
                        before confirming.
                    </p>

                </div>


                {/* COUNTDOWN */}

                {timeLeft > 0 && (

                    <div className="checkout-timer">

                        <div>
                            Your seats are reserved.
                        </div>

                        <strong>
                            Time remaining:{" "}
                            {formatTime(timeLeft)}
                        </strong>

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div className="events-error mb-4">
                        {error}
                    </div>

                )}


                <div className="row g-4">

                    {/* LEFT SIDE */}

                    <div className="col-lg-8">

                        <div className="checkout-card">

                            <p className="checkout-card-label">
                                EVENT DETAILS
                            </p>

                            <h2>
                                {event.name}
                            </h2>


                            <div className="checkout-event-details">

                                <div>

                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        {event.location}
                                    </strong>

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
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            }
                                        )}
                                    </strong>

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

                        </div>


                        <div className="checkout-card mt-4">

                            <p className="checkout-card-label">
                                SELECTED SEATS
                            </p>

                            <h2>
                                Your seats
                            </h2>


                            <div className="checkout-seats">

                                {selectedSeats.map(
                                    (seat) => (

                                        <span
                                            key={seat._id}
                                            className="checkout-seat"
                                        >
                                            {seat.seatNumber}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="col-lg-4">

                        <div className="checkout-summary">

                            <p className="checkout-card-label">
                                ORDER SUMMARY
                            </p>


                            <div className="checkout-summary-row">

                                <span>
                                    Seats
                                </span>

                                <strong>
                                    {selectedSeats.length}
                                </strong>

                            </div>


                            <div className="checkout-summary-row">

                                <span>
                                    Price per seat
                                </span>

                                <strong>
                                    ₹{pricePerSeat}
                                </strong>

                            </div>


                            <div className="checkout-divider"></div>


                            <div className="checkout-total-row">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{totalAmount}
                                </strong>

                            </div>


                            <button
                                type="button"
                                className="checkout-confirm-btn"
                                onClick={handleConfirmBooking}
                                disabled={
                                    loading ||
                                    timeLeft <= 0
                                }
                            >

                                {loading
                                    ? "Confirming..."
                                    : "Confirm Booking"
                                }

                            </button>


                            <p className="checkout-note">
                                Your seats are temporarily
                                reserved. Complete the booking
                                before the timer expires.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;