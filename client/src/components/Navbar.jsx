import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useEffect, useState } from "react";

import { GiPopcorn } from "react-icons/gi";

import api from "../services/api";

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    const [isAdmin, setIsAdmin] = useState(false);


    // =====================================================
    // CHECK AUTHENTICATION
    // =====================================================

    useEffect(() => {

        const checkUser = async () => {

            const token =
                localStorage.getItem("token");


            // No token = logged out

            if (!token) {

                setIsLoggedIn(false);
                setIsAdmin(false);

                return;

            }


            setIsLoggedIn(true);


            // Check user's role

            try {

                const response =
                    await api.get("/auth/me");

                const role =
                    response.data.user?.role;

                setIsAdmin(
                    role === "ADMIN"
                );

            } catch (error) {

                console.error(
                    "Failed to fetch user information:",
                    error
                );

                setIsAdmin(false);

            }

        };


        checkUser();

    }, [location.pathname]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        setIsLoggedIn(false);
        setIsAdmin(false);

        navigate("/login");

    };


    return (
        <nav className="navbar navbar-expand-lg event-navbar">

            <div className="container">

                <Link
                    to="/"
                    className="navbar-brand d-flex align-items-center"
                >

                    <span className="brand-mark">
                        <GiPopcorn />
                    </span>

                    <span className="brand-name">
                        EventBook
                    </span>

                </Link>


                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>


                <div
                    className="collapse navbar-collapse"
                    id="mainNavbar"
                >

                    <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

                        {/* HOME */}

                        <Link
                            to="/"
                            className="nav-link"
                        >
                            Home
                        </Link>


                        {/* EVENTS */}

                        <Link
                            to="/events"
                            className="nav-link"
                        >
                            Events
                        </Link>


                        {isLoggedIn ? (

                            <>

                                {/* ADMIN DASHBOARD */}

                                {isAdmin && (

                                    <Link
                                        to="/admin"
                                        className="nav-link"
                                    >
                                        Admin Dashboard
                                    </Link>

                                )}


                                {/* MY BOOKINGS */}

                                <Link
                                    to="/bookings"
                                    className="nav-link"
                                >
                                    My Bookings
                                </Link>


                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    className="btn register-btn ms-lg-2"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </>

                        ) : (

                            <>

                                {/* LOGIN */}

                                <Link
                                    to="/login"
                                    className="nav-link"
                                >
                                    Login
                                </Link>


                                {/* GET STARTED */}

                                <Link
                                    to="/register"
                                    className="btn register-btn ms-lg-2"
                                >
                                    Get Started
                                </Link>

                            </>

                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;