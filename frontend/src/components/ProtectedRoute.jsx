import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";


function ProtectedRoute({
    allowedRoles,
    children
}) {

    const {
        user,
        isAuthenticated,
        loading
    } = useContext(AuthContext);


    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>

                    <span>
                        Loading...
                    </span>
                </div>
            </div>
        );
    }


    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );

    }


    /*
     * If children are provided, render them.
     * Otherwise render nested routes.
     */

    return children || <Outlet />;
}


export default ProtectedRoute;