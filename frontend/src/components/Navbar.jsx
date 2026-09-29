import {
    useContext
} from "react";

import {
    AuthContext
} from "../context/AuthContext";


function Navbar() {

    const {
        user,
        logout
    } = useContext(AuthContext);


    const getRoleName = (role) => {

        if (role === "STORE_OWNER") {
            return "Store Owner";
        }

        if (role === "ADMIN") {
            return "Admin";
        }

        return "Normal User";

    };


    const handleLogout = () => {

        logout();

        window.location.href =
            "/login";

    };


    return (

        <header className="navbar">

            <div>

                <h3>
                    Store Rating Management System
                </h3>

            </div>


            <div className="navbar-user">

                <div className="navbar-user-info">

                    <strong>
                        {user?.name || "User"}
                    </strong>

                    <span>
                        {getRoleName(user?.role)}
                    </span>

                </div>


                <button
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </header>

    );
}


export default Navbar;