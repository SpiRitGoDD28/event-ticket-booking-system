import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log("Login response:", response.data);

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/events");

        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>Welcome Back</h1>

                    <p>
                        Login to continue booking your seats.
                    </p>

                </div>


                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleLogin}>

                    <div className="auth-form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div className="auth-form-group">

                        <div className="auth-password-header">

                            <label>
                                Password
                            </label>

                            <Link to="/forgot-password">
                                Forgot password?
                            </Link>

                        </div>


                        <div className="auth-password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }
                            </button>

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >

                        {loading ? (
                            "Logging in..."
                        ) : (
                            <>
                                Login
                                <FaArrowRight />
                            </>
                        )}

                    </button>

                </form>


                <div className="auth-divider">
                    <span>OR</span>
                </div>


                <p className="auth-register-text">

                    Don't have an account?

                    <Link to="/register">
                        Create an account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;