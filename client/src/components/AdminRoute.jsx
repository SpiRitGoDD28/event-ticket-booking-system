import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function AdminRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const checkAdmin = async () => {

            try {

                const response =
                    await api.get("/auth/me");

                const role =
                    response.data.user?.role;

                if (role === "ADMIN") {
                    setIsAdmin(true);
                }

            } catch (error) {

                console.error(
                    "Admin authentication failed:",
                    error
                );

                setIsAdmin(false);

            } finally {

                setLoading(false);

            }

        };

        checkAdmin();

    }, []);

    if (loading) {

        return (
            <div className="events-loading">
                Checking permissions...
            </div>
        );

    }

    if (!isAdmin) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }

    return children;
}

export default AdminRoute;