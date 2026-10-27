
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import DigitalTicket from "./pages/DigitalTicket";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminBookings from "./pages/AdminBookings";
import AdminSeatConfiguration from "./pages/AdminSeatConfiguration";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/events"
                    element={<Events />}
                />

                <Route
                    path="/events/:id"
                    element={<EventDetails />}
                />

                <Route
                    path="/events/:id/seats"
                    element={<SeatSelection />}
                />

                <Route
                    path="/events/:id/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/booking-confirmation/:id"
                    element={<BookingConfirmation />}
                />

                <Route
                    path="/bookings"
                    element={<MyBookings />}
                />

                <Route
                    path="/bookings/:id/ticket"
                    element={<DigitalTicket />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Admin Dashboard */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                {/* Admin Event Management */}
                <Route
                    path="/admin/events"
                    element={
                        <AdminRoute>
                            <AdminEvents />
                        </AdminRoute>
                    }
                />

                {/* Admin Booking Management */}
                <Route
                    path="/admin/bookings"
                    element={
                        <AdminRoute>
                            <AdminBookings />
                        </AdminRoute>
                    }
                />

                {/* Admin Seat Configuration */}
                <Route
                    path="/admin/events/:id/seats"
                    element={
                        <AdminRoute>
                            <AdminSeatConfiguration />
                        </AdminRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
