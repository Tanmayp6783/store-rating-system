import {
    NavLink
} from "react-router-dom";

import {
    useContext
} from "react";

import {
    AuthContext
} from "../context/AuthContext";


function Sidebar() {

    const {
        user
    } = useContext(AuthContext);


    const role =
        user?.role;


    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                <h2>
                    StoreRate
                </h2>

                <p>
                    Management System
                </p>

            </div>


            <nav>


                {/* ADMIN */}

                {role === "ADMIN" && (

                    <>

                        <NavLink to="/admin">
                            Dashboard
                        </NavLink>

                        <NavLink to="/admin/users">
                            Users
                        </NavLink>

                        <NavLink to="/admin/stores">
                            Stores
                        </NavLink>

                    </>

                )}


                {/* NORMAL USER */}

                {role === "USER" && (

                    <NavLink to="/stores">
                        Stores
                    </NavLink>

                )}


                {/* STORE OWNER */}

                {role === "STORE_OWNER" && (

                    <NavLink to="/owner">
                        Dashboard
                    </NavLink>

                )}


                {/* PROFILE */}

                <NavLink to="/profile">
                    Profile
                </NavLink>


            </nav>

        </aside>

    );
}


export default Sidebar;