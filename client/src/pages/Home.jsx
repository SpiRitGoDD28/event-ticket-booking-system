
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* =================================
                HERO
            ================================= */}

            <section className="hero-section">

                <div className="container">

                    <div className="hero-content">

                        <div className="hero-badge">
                            <span className="pulse-dot"></span>
                            Your next experience starts here
                        </div>

                        <h1 className="hero-title">
                            Events worth
                            <span> remembering.</span>
                        </h1>

                        <p className="hero-text">
                            Discover experiences that bring people
                            together. Find your event, choose your
                            perfect seat, and make it yours.
                        </p>

                        <div className="hero-buttons">

                            <Link
                                to="/events"
                                className="explore-btn"
                            >
                                Explore Events

                                <span className="arrow">
                                    →
                                </span>
                            </Link>

                            <Link
                                to="/register"
                                className="learn-btn"
                            >
                                Create an account
                            </Link>

                        </div>

                    </div>


                    {/* =================================
                        THEATRE VISUAL
                    ================================= */}

                    <div className="hero-visual">

                        <div className="theatre">

                            <div className="curtain curtain-left"></div>

                            <div className="curtain curtain-right"></div>

                            <div className="screen-frame">

                                <div className="screen">

                                    <span className="screen-small">
                                        EVENTBOOK
                                    </span>

                                    <span className="screen-title">
                                        YOUR NEXT
                                        <br />
                                        EXPERIENCE
                                    </span>

                                </div>

                            </div>

                            <div className="stage"></div>

                        </div>


                        {/* Floating cards */}

                        <div className="floating-card card-one">

                            <span>●</span>

                            Live events

                        </div>


                        <div className="floating-card card-two">

                            <strong>
                                Seat
                            </strong>

                            <span>
                                awaits.
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
                FEATURES
            ================================= */}

            <section className="features-section">

                <div className="container">

                    <div className="features-header">

                        <p className="section-label">
                            WHY EVENTBOOK
                        </p>

                        <h2 className="section-title">
                            Simple booking. Better experiences.
                        </h2>

                    </div>


                    <div className="row g-4">

                        <div className="col-md-4">

                            <div className="feature-card">

                                <div className="feature-number">
                                    01
                                </div>

                                <h4>
                                    Discover
                                </h4>

                                <p>
                                    Find upcoming events and explore
                                    experiences that match your interests.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="feature-card">

                                <div className="feature-number">
                                    02
                                </div>

                                <h4>
                                    Choose
                                </h4>

                                <p>
                                    See the available seats and choose
                                    exactly where you want to sit.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="feature-card">

                                <div className="feature-number">
                                    03
                                </div>

                                <h4>
                                    Experience
                                </h4>

                                <p>
                                    Book securely and keep your digital
                                    ticket ready for the event.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;