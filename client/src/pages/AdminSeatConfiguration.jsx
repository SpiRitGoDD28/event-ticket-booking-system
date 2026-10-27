import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";

function AdminSeatConfiguration() {

    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);

    const [rows, setRows] = useState(5);
    const [seatsPerRow, setSeatsPerRow] = useState(10);

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // FETCH EVENT + SEATS
    // =====================================================

    const fetchData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                eventResponse,
                seatsResponse
            ] = await Promise.all([

                api.get(`/events/${id}`),

                api.get(`/seats/${id}`)

            ]);


            const eventData =
                eventResponse.data.event ||
                eventResponse.data;


            setEvent(eventData);

            const fetchedSeats =
                seatsResponse.data.seats || [];

            setSeats(fetchedSeats);


            // -------------------------------------------------
            // SET CURRENT CONFIGURATION
            // -------------------------------------------------

            if (fetchedSeats.length > 0) {

                const uniqueRows = [
                    ...new Set(
                        fetchedSeats.map(
                            seat => seat.row
                        )
                    )
                ];

                const maximumSeatsPerRow =
                    Math.max(
                        ...uniqueRows.map(
                            row =>
                                fetchedSeats.filter(
                                    seat =>
                                        seat.row === row
                                ).length
                        )
                    );


                setRows(
                    uniqueRows.length
                );

                setSeatsPerRow(
                    maximumSeatsPerRow
                );

            }


        } catch (error) {

            console.error(
                "Error loading seat configuration:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load seat configuration."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchData();

    }, [id]);


    // =====================================================
    // GENERATE ROW LETTERS
    // =====================================================

    const generateRowNames = (count) => {

        const rowNames = [];

        for (let i = 0; i < count; i++) {

            rowNames.push(
                String.fromCharCode(65 + i)
            );

        }

        return rowNames;

    };


    // =====================================================
    // CREATE / UPDATE SEATS
    // =====================================================

    const handleGenerateSeats = async () => {

        try {

            setGenerating(true);
            setError("");
            setSuccess("");


            const rowNames =
                generateRowNames(
                    Number(rows)
                );


            let response;


            // =================================================
            // FIRST TIME → CREATE
            // =================================================

            if (seats.length === 0) {

                response =
                    await api.post(
                        "/seats",
                        {
                            eventId: id,

                            rows: rowNames,

                            seatsPerRow:
                                Number(seatsPerRow)
                        }
                    );

            }


            // =================================================
            // EXISTING SEATS → UPDATE
            // =================================================

            else {

                response =
                    await api.put(
                        "/seats/configuration",
                        {
                            eventId: id,

                            rows: rowNames,

                            seatsPerRow:
                                Number(seatsPerRow)
                        }
                    );

            }


            setSuccess(
                response.data.message ||
                "Seating configuration updated successfully."
            );


            await fetchData();


        } catch (error) {

            console.error(
                "Error updating seats:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to update seating configuration.";


            // -------------------------------------------------
            // PROTECTED SEATS
            // -------------------------------------------------

            if (
                error.response?.data?.protectedSeats
            ) {

                setError(
                    `${message} Protected seats: ${error.response.data.protectedSeats.join(", ")}`
                );

            } else {

                setError(message);

            }

        } finally {

            setGenerating(false);

        }

    };


    // =====================================================
    // GROUP SEATS BY ROW
    // =====================================================

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


    // =====================================================
    // COUNTS
    // =====================================================

    const availableSeats =
        seats.filter(
            seat =>
                seat.status === "AVAILABLE"
        ).length;


    const heldSeats =
        seats.filter(
            seat =>
                seat.status === "HELD"
        ).length;


    const bookedSeats =
        seats.filter(
            seat =>
                seat.status === "BOOKED"
        ).length;


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="admin-page">

                <div className="container py-5">

                    <div className="events-loading">
                        Loading seat configuration...
                    </div>

                </div>

            </div>
        );

    }


    return (
        <div className="admin-page">

            <div className="container py-5">


                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="admin-header">

                    <div>

                        <p className="section-label">
                            ADMIN PANEL
                        </p>

                        <h1>
                            Configure <span>seats.</span>
                        </h1>

                        {event && (

                            <p>
                                {event.name}
                                {" • "}
                                {event.location}
                            </p>

                        )}

                    </div>


                    <Link
                        to="/admin/events"
                        className="admin-secondary-btn"
                    >
                        ← Back to Events
                    </Link>

                </div>


                {/* =====================================================
                    ERROR
                ===================================================== */}

                {error && (

                    <div className="events-error mb-4">
                        {error}
                    </div>

                )}


                {/* =====================================================
                    SUCCESS
                ===================================================== */}

                {success && (

                    <div className="admin-success-message">
                        {success}
                    </div>

                )}


                {/* =====================================================
                    EVENT INFORMATION
                ===================================================== */}

                {event && (

                    <div className="admin-seat-event-card">

                        <div>

                            <span>
                                EVENT
                            </span>

                            <strong>
                                {event.name}
                            </strong>

                        </div>

                        <div>

                            <span>
                                DATE
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

                )}


                {/* =====================================================
                    GENERATOR
                ===================================================== */}

                <div className="admin-form-card">

                    <div className="admin-form-header">

                        <div>

                            <p className="section-label">
                                SEAT GENERATOR
                            </p>

                            <h2>
                                {seats.length > 0
                                    ? "Update seating layout."
                                    : "Create seating layout."}
                            </h2>

                        </div>

                    </div>


                    <div className="admin-form-grid">


                        {/* ROWS */}

                        <div className="admin-form-group">

                            <label>
                                Number of Rows
                            </label>

                            <input
                                type="number"
                                min="1"
                                max="26"
                                value={rows}
                                onChange={(event) =>
                                    setRows(
                                        event.target.value
                                    )
                                }
                            />

                            <small className="admin-form-help">
                                Rows will be generated as A, B, C...
                            </small>

                        </div>


                        {/* SEATS */}

                        <div className="admin-form-group">

                            <label>
                                Seats Per Row
                            </label>

                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={seatsPerRow}
                                onChange={(event) =>
                                    setSeatsPerRow(
                                        event.target.value
                                    )
                                }
                            />

                            <small className="admin-form-help">
                                Example: 10 seats per row
                            </small>

                        </div>

                    </div>


                    {/* PREVIEW */}

                    <div className="admin-seat-generator-preview">

                        <span>
                            LAYOUT PREVIEW
                        </span>

                        <div className="admin-seat-preview-text">

                            {generateRowNames(
                                Number(rows)
                            ).map(
                                (row) => (

                                    <span key={row}>

                                        {row}
                                        1–
                                        {seatsPerRow}

                                    </span>

                                )
                            )}

                        </div>

                    </div>


                    <div className="admin-form-actions">

                        <button
                            type="button"
                            className="admin-primary-btn"
                            onClick={handleGenerateSeats}
                            disabled={
                                generating ||
                                Number(rows) < 1 ||
                                Number(seatsPerRow) < 1
                            }
                        >

                            {generating

                                ? "Updating..."

                                : seats.length > 0

                                    ? "Update Seating Layout"

                                    : "Generate Seating Layout"}

                        </button>

                    </div>

                </div>


                {/* =====================================================
                    SEAT STATISTICS
                ===================================================== */}

                <div className="admin-section">

                    <div className="admin-section-header">

                        <div>

                            <p className="section-label">
                                SEAT STATUS
                            </p>

                            <h2>
                                Current layout.
                            </h2>

                        </div>

                        <span className="admin-event-count">
                            {seats.length} total seats
                        </span>

                    </div>


                    {seats.length > 0 && (

                        <div className="admin-seat-stats">

                            <div className="admin-seat-stat">

                                <span>
                                    AVAILABLE
                                </span>

                                <strong>
                                    {availableSeats}
                                </strong>

                            </div>

                            <div className="admin-seat-stat">

                                <span>
                                    HELD
                                </span>

                                <strong>
                                    {heldSeats}
                                </strong>

                            </div>

                            <div className="admin-seat-stat">

                                <span>
                                    BOOKED
                                </span>

                                <strong>
                                    {bookedSeats}
                                </strong>

                            </div>

                        </div>

                    )}


                    {/* =====================================================
                        NO SEATS
                    ===================================================== */}

                    {seats.length === 0 ? (

                        <div className="admin-empty">

                            <h3>
                                No seats configured
                            </h3>

                            <p>
                                Use the seat generator above
                                to create the seating layout.
                            </p>

                        </div>

                    ) : (


                        /* =====================================================
                           SEAT LAYOUT
                        ===================================================== */

                        <div className="admin-seat-layout">

                            <div className="admin-stage">
                                STAGE
                            </div>


                            {Object.keys(groupedSeats)
                                .sort()
                                .map((row) => (

                                    <div
                                        key={row}
                                        className="admin-seat-row"
                                    >

                                        <span className="admin-seat-row-label">
                                            {row}
                                        </span>


                                        <div className="admin-seat-grid">

                                            {groupedSeats[row]
                                                .sort(
                                                    (a, b) =>
                                                        parseInt(
                                                            a.seatNumber.replace(
                                                                row,
                                                                ""
                                                            )
                                                        ) -
                                                        parseInt(
                                                            b.seatNumber.replace(
                                                                row,
                                                                ""
                                                            )
                                                        )
                                                )
                                                .map(
                                                    (seat) => (

                                                        <div
                                                            key={seat._id}
                                                            className={`admin-seat ${seat.status.toLowerCase()}`}
                                                            title={`${seat.seatNumber} - ${seat.status}`}
                                                        >
                                                            {seat.seatNumber}
                                                        </div>

                                                    )
                                                )}

                                        </div>

                                    </div>

                                ))}


                            <div className="admin-seat-legend">

                                <div>

                                    <span className="legend-box available"></span>

                                    <span>
                                        Available
                                    </span>

                                </div>

                                <div>

                                    <span className="legend-box held"></span>

                                    <span>
                                        Held
                                    </span>

                                </div>

                                <div>

                                    <span className="legend-box booked"></span>

                                    <span>
                                        Booked
                                    </span>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminSeatConfiguration;