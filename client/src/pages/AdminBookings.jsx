
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/admin/bookings");

                setBookings(response.data.bookings || []);
            } catch (error) {
                console.error("Error loading bookings:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load bookings."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatAmount = (amount) => {
        return Number(amount || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        });
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="container py-5">
                    <div className="events-loading">
                        Loading bookings...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="container py-5">

                <div className="admin-header">
                    <div>
                        <p className="section-label">ADMIN PANEL</p>

                        <h1>
                            All <span>Bookings.</span>
                        </h1>

                        <p>
                            View and monitor customer bookings across EventBook.
                        </p>
                    </div>

                    <Link
                        to="/admin"
                        className="admin-primary-btn"
                    >
                        ← Dashboard
                    </Link>
                </div>

                {error && (
                    <div className="events-error mb-4">
                        {error}
                    </div>
                )}

                {!error && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <div>
                                <p className="section-label">
                                    BOOKING MANAGEMENT
                                </p>

                                <h2>Booking records</h2>
                            </div>

                            <span>
                                {bookings.length} booking(s)
                            </span>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="admin-empty">
                                <h3>No bookings yet</h3>

                                <p>
                                    Customer bookings will appear here
                                    when they are created.
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Event</th>
                                            <th>Seats</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Booked On</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {bookings.map((booking) => {
                                            const customer =
                                                booking.user?.name ||
                                                booking.user?.email ||
                                                "Unknown customer";

                                            const eventName =
                                                booking.event?.name ||
                                                "Event unavailable";

                                            const seatLabels = (
                                                booking.seats || []
                                            )
                                                .map((seat) => {
                                                    if (typeof seat === "string") {
                                                        return seat;
                                                    }

                                                    return (
                                                        seat?.seatNumber ||
                                                        seat?.label ||
                                                        seat?.name ||
                                                        seat?._id
                                                    );
                                                })
                                                .filter(Boolean);

                                            return (
                                                <tr key={booking._id}>
                                                    <td>
                                                        <strong>{customer}</strong>

                                                        {booking.user?.email && (
                                                            <div className="small text-muted">
                                                                {booking.user.email}
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td>{eventName}</td>

                                                    <td>
                                                        {seatLabels.length > 0
                                                            ? seatLabels.join(", ")
                                                            : "—"}
                                                    </td>

                                                    <td>
                                                        {formatAmount(
                                                            booking.totalAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span>
                                                            {booking.status || "UNKNOWN"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            booking.createdAt
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminBookings;
