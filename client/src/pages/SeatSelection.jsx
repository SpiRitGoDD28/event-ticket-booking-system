import { useEffect, useState } from "react";
import {
    useParams,
    Link,
    useNavigate
} from "react-router-dom";
import { io } from "socket.io-client";

import api from "../services/api";

function SeatSelection() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(true);
    const [holding, setHolding] = useState(false);

    const [error, setError] = useState("");
    const [holdMessage, setHoldMessage] = useState("");

    const [holdExpiresAt, setHoldExpiresAt] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);


    /* ---------------- FETCH EVENT + SEATS ---------------- */

    useEffect(() => {

        const fetchData = async () => {

            try {

                const seatsResponse =
                    await api.get(`/seats/${id}`);

                setSeats(
                    seatsResponse.data.seats || []
                );

                const eventResponse =
                    await api.get(`/events/${id}`);

                const eventData =
                    eventResponse.data.event ||
                    eventResponse.data;

                setEvent(eventData);

            } catch (error) {

                console.error(
                    "Error loading seat page:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load seats."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, [id]);


    /* ---------------- SOCKET.IO ---------------- */

    useEffect(() => {

        const socket = io("http://localhost:5000");

        socket.on("connect", () => {

            console.log(
                "Connected to Socket.IO:",
                socket.id
            );

            socket.emit("joinEvent", id);

        });

        socket.on("seatUpdate", (updatedSeat) => {

            console.log(
                "Real-time seat update:",
                updatedSeat
            );

            setSeats((previousSeats) => {

                return previousSeats.map((seat) => {

                    if (
                        seat._id === updatedSeat.seatId
                    ) {

                        return {
                            ...seat,
                            status: updatedSeat.status,
                            holdExpiresAt:
                                updatedSeat.holdExpiresAt ||
                                null
                        };

                    }

                    return seat;

                });

            });

        });

        socket.on("disconnect", () => {

            console.log(
                "Disconnected from Socket.IO"
            );

        });

        return () => {

            socket.disconnect();

        };

    }, [id]);


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

                setHoldExpiresAt(null);

                setHoldMessage("");

                setSelectedSeats([]);

                api.get(`/seats/${id}`)
                    .then((response) => {

                        setSeats(
                            response.data.seats || []
                        );

                    })
                    .catch((error) => {

                        console.error(
                            "Error refreshing seats:",
                            error
                        );

                    });

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

    }, [holdExpiresAt, id]);


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


    /* ---------------- SEAT CLICK ---------------- */

    const handleSeatClick = (seat) => {

        if (seat.status !== "AVAILABLE") {

            return;

        }

        if (holdExpiresAt) {

            return;

        }

        setSelectedSeats((previousSeats) => {

            const alreadySelected =
                previousSeats.some(
                    (selectedSeat) =>
                        selectedSeat._id === seat._id
                );

            if (alreadySelected) {

                return previousSeats.filter(
                    (selectedSeat) =>
                        selectedSeat._id !== seat._id
                );

            }

            return [
                ...previousSeats,
                seat
            ];

        });

    };


    /* ---------------- HOLD SEATS ---------------- */

    const handleContinue = async () => {

        if (selectedSeats.length === 0) {

            return;

        }

        setError("");

        setHoldMessage("");

        setHolding(true);

        try {

            const seatIds =
                selectedSeats.map(
                    (seat) => seat._id
                );

            const response =
                await api.post(
                    "/seats/hold",
                    {
                        seatIds
                    }
                );

            console.log(
                "Hold response:",
                response.data
            );

            const expiresAt =
                response.data.holdExpiresAt;

            setHoldExpiresAt(expiresAt);

            setHoldMessage(
                "Your seats have been reserved for 3 minutes."
            );

            if (response.data.seats) {

                setSeats((previousSeats) => {

                    return previousSeats.map(
                        (seat) => {

                            const heldSeat =
                                response.data.seats.find(
                                    (item) =>
                                        item._id === seat._id
                                );

                            if (heldSeat) {

                                return {
                                    ...seat,
                                    status: "HELD",
                                    heldBy:
                                        heldSeat.heldBy,
                                    holdExpiresAt:
                                        heldSeat.holdExpiresAt
                                };

                            }

                            return seat;

                        }
                    );

                });

            }

            navigate(
                `/events/${id}/checkout`,
                {
                    state: {
                        event: event,
                        selectedSeats: selectedSeats,
                        holdExpiresAt: expiresAt
                    }
                }
            );

        } catch (error) {

            console.error(
                "Hold seats error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to reserve the selected seats."
            );

        } finally {

            setHolding(false);

        }

    };


    /* ---------------- PRICE ---------------- */

    const pricePerSeat =
        Number(event?.price) || 0;

    const totalPrice =
        selectedSeats.length *
        pricePerSeat;


    /* ---------------- GROUP SEATS BY ROW ---------------- */

    const groupedSeats =
        seats.reduce(
            (groups, seat) => {

                if (!groups[seat.row]) {

                    groups[seat.row] = [];

                }

                groups[seat.row].push(seat);

                return groups;

            },
            {}
        );


    const sortedRows =
        Object.keys(groupedSeats).sort();


    sortedRows.forEach((row) => {

        groupedSeats[row].sort(
            (a, b) => {

                const numberA =
                    parseInt(
                        a.seatNumber.replace(
                            row,
                            ""
                        )
                    );

                const numberB =
                    parseInt(
                        b.seatNumber.replace(
                            row,
                            ""
                        )
                    );

                return numberA - numberB;

            }
        );

    });


    /* ---------------- LOADING ---------------- */

    if (loading) {

        return (
            <div className="seat-page">

                <div className="container text-center py-5">

                    <div className="events-loading">
                        Loading seats...
                    </div>

                </div>

            </div>
        );

    }


    /* ---------------- ERROR ---------------- */

    if (error && seats.length === 0) {

        return (
            <div className="seat-page">

                <div className="container py-5">

                    <div className="events-error">
                        {error}
                    </div>

                    <Link
                        to={`/events/${id}`}
                        className="back-events-link"
                    >
                        ← Back to event
                    </Link>

                </div>

            </div>
        );

    }


    /* ---------------- PAGE ---------------- */

    return (
        <div className="seat-page">

            <div className="container py-5">

                <Link
                    to={`/events/${id}`}
                    className="seat-back-link"
                >
                    ← Back to event
                </Link>


                <div className="seat-header">

                    <p className="section-label">
                        SELECT YOUR SEATS
                    </p>

                    <h1>
                        Choose your <span>seat.</span>
                    </h1>

                    <p>
                        {event?.name}
                    </p>

                </div>


                {error && (
                    <div className="events-error mb-4">
                        {error}
                    </div>
                )}


                {holdMessage && (
                    <div className="seat-hold-message">

                        <div>
                            {holdMessage}
                        </div>

                        {timeLeft > 0 && (
                            <strong>
                                Time remaining:{" "}
                                {formatTime(timeLeft)}
                            </strong>
                        )}

                    </div>
                )}


                {/* ---------------- SEATING AREA ---------------- */}

                <div className="seating-area">

                {/*
                        IMPORTANT:
                        Screen + seats are now inside
                        ONE common seating canvas.
                    */}

                    <div className="seating-canvas">


                        {/* ---------------- SCREEN ---------------- */}

                        <div className="cinema-screen-wrapper">

                            <div className="cinema-screen">
                                SCREEN
                            </div>

                        </div>


                        {/* ---------------- SEATS ---------------- */}

                        <div className="seat-layout">

                            {sortedRows.map((row) => (

                                <div
                                    key={row}
                                    className="seat-row"
                                >

                                    <span className="seat-row-label">
                                        {row}
                                    </span>


                                    <div className="seat-row-seats">

                                        {groupedSeats[row].map(
                                            (seat) => {

                                                const isSelected =
                                                    selectedSeats.some(
                                                        (selectedSeat) =>
                                                            selectedSeat._id ===
                                                            seat._id
                                                    );


                                                let seatClass =
                                                    "seat seat-booked";


                                                if (
                                                    seat.status ===
                                                    "AVAILABLE"
                                                ) {

                                                    seatClass =
                                                        "seat seat-available";

                                                }


                                                if (isSelected) {

                                                    seatClass =
                                                        "seat seat-selected";

                                                }


                                                return (

                                                    <button
                                                        key={seat._id}
                                                        type="button"
                                                        disabled={
                                                            seat.status !==
                                                                "AVAILABLE" ||
                                                            Boolean(
                                                                holdExpiresAt
                                                            )
                                                        }
                                                        onClick={() =>
                                                            handleSeatClick(
                                                                seat
                                                            )
                                                        }
                                                        className={
                                                            seatClass
                                                        }
                                                    >

                                                        {seat.seatNumber}

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>


                {/* ---------------- LEGEND ---------------- */}

                <div className="seat-legend">

                    <div>

                        <span className="legend-box available"></span>

                        Available

                    </div>


                    <div>

                        <span className="legend-box selected"></span>

                        Selected

                    </div>


                    <div>

                        <span className="legend-box booked"></span>

                        Unavailable

                    </div>

                </div>


                {/* ---------------- SUMMARY ---------------- */}

                <div className="seat-summary">

                    <div>

                        <p>
                            Selected seats
                        </p>

                        <strong>

                            {selectedSeats.length === 0
                                ? "None"
                                : selectedSeats
                                    .map(
                                        (seat) =>
                                            seat.seatNumber
                                    )
                                    .join(", ")
                            }

                        </strong>

                    </div>


                    <div>

                        <p>
                            Price per seat
                        </p>

                        <strong>
                            ₹{pricePerSeat}
                        </strong>

                    </div>


                    <div>

                        <p>
                            Total
                        </p>

                        <strong className="seat-total">
                            ₹{totalPrice}
                        </strong>

                    </div>


                    <button
                        type="button"
                        className="seat-continue-btn"
                        disabled={
                            selectedSeats.length === 0 ||
                            holding ||
                            Boolean(holdExpiresAt)
                        }
                        onClick={handleContinue}
                    >

                        {holding
                            ? "Reserving..."
                            : holdExpiresAt
                                ? `Reserved · ${formatTime(timeLeft)}`
                                : "Continue"
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}

export default SeatSelection;