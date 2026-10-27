import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            await api.post("/auth/register", {
                name,
                email,
                password
            });

            navigate("/login");

        } catch (error) {

            console.error("Registration error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>Create Account</h1>

                    <p>
                        Register to start booking your event tickets.
                    </p>

                </div>


                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleRegister}>

                    {/* Name */}

                    <div className="auth-form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter your full name"
                            required
                        />

                    </div>


                    {/* Email */}

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


                    {/* Password */}

                    <div className="auth-form-group">

                        <label>
                            Password
                        </label>

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
                                placeholder="Create a password"
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


                    {/* Confirm Password */}

                    <div className="auth-form-group">

                        <label>
                            Confirm Password
                        </label>

                        <div className="auth-password-wrapper">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm your password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }
                            </button>

                        </div>

                    </div>


                    {/* Register button */}

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >

                        {loading ? (
                            "Creating account..."
                        ) : (
                            <>
                                Create Account
                                <FaArrowRight />
                            </>
                        )}

                    </button>

                </form>


                <div className="auth-divider">
                    <span>OR</span>
                </div>


                <p className="auth-register-text">

                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;