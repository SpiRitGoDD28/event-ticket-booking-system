import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import api from "../services/api";

function ForgotPassword() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [resetToken, setResetToken] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // =====================================================
    // STEP 1 — SEND OTP
    // =====================================================

    const handleSendOtp = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/forgot-password",
                {
                    email
                }
            );

            setMessage(response.data.message);

            setStep(2);

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to send OTP. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // STEP 2 — VERIFY OTP
    // =====================================================

    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/verify-otp",
                {
                    email,
                    otp
                }
            );

            setResetToken(
                response.data.resetToken
            );

            setMessage(
                "OTP verified successfully."
            );

            setStep(3);

        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Invalid or expired OTP."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // STEP 3 — RESET PASSWORD
    // =====================================================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }

        setLoading(true);

        try {

            const response = await api.post(
                "/auth/reset-password",
                {
                    email,
                    resetToken,
                    newPassword
                }
            );

            setMessage(
                response.data.message
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error(
                "Password reset error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to reset password. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* =================================================
                    STEP 1
                ================================================= */}

                {step === 1 && (

                    <>
                        <div className="auth-header">

                            <h1>Forgot Password?</h1>

                            <p>
                                Enter your email and we'll send you
                                an OTP to reset your password.
                            </p>

                        </div>


                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}


                        <form onSubmit={handleSendOtp}>

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


                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >

                                {loading ? (
                                    "Sending OTP..."
                                ) : (
                                    <>
                                        Send OTP
                                        <FaArrowRight />
                                    </>
                                )}

                            </button>

                        </form>


                        <div className="auth-divider">
                            <span>OR</span>
                        </div>


                        <p className="auth-register-text">

                            Remember your password?

                            <Link to="/login">
                                Login
                            </Link>

                        </p>

                    </>

                )}


                {/* =================================================
                    STEP 2
                ================================================= */}

                {step === 2 && (

                    <>
                        <div className="auth-header">

                            <h1>Verify OTP</h1>

                            <p>
                                Enter the 6-digit OTP sent to
                                <br />
                                <strong>{email}</strong>
                            </p>

                        </div>


                        {message && (
                            <div className="auth-success">
                                {message}
                            </div>
                        )}


                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}


                        <form onSubmit={handleVerifyOtp}>

                            <div className="auth-form-group">

                                <label>
                                    OTP
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    placeholder="Enter 6-digit OTP"
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={
                                    loading ||
                                    otp.length !== 6
                                }
                            >

                                {loading ? (
                                    "Verifying..."
                                ) : (
                                    <>
                                        Verify OTP
                                        <FaArrowRight />
                                    </>
                                )}

                            </button>

                        </form>


                        <p className="auth-register-text">

                            Didn't receive the OTP?

                            <button
                                type="button"
                                className="auth-link-button"
                                onClick={() => {
                                    setStep(1);
                                    setOtp("");
                                    setError("");
                                    setMessage("");
                                }}
                            >
                                Try again
                            </button>

                        </p>

                    </>

                )}


                {/* =================================================
                    STEP 3
                ================================================= */}

                {step === 3 && (

                    <>
                        <div className="auth-header">

                            <h1>Reset Password</h1>

                            <p>
                                Create a new password for your account.
                            </p>

                        </div>


                        {message && (
                            <div className="auth-success">
                                {message}
                            </div>
                        )}


                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}


                        <form onSubmit={handleResetPassword}>

                            {/* New password */}

                            <div className="auth-form-group">

                                <label>
                                    New Password
                                </label>

                                <div className="auth-password-wrapper">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter new password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
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


                            {/* Confirm password */}

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
                                        placeholder="Confirm new password"
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


                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >

                                {loading ? (
                                    "Resetting password..."
                                ) : (
                                    <>
                                        Reset Password
                                        <FaArrowRight />
                                    </>
                                )}

                            </button>

                        </form>

                    </>

                )}

            </div>

        </div>
    );
}

export default ForgotPassword;