import { useContext, useState } from "react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";


import { AuthContext } from "../context/AuthContext";


function Profile() {

    const { user } = useContext(AuthContext);


    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");



    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData({
            ...formData,
            [name]: value
        });


        setError("");

        setSuccess("");

    };


    
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


   
        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            setError(
                "New password and confirm password do not match."
            );

            return;
        }


    
        if (
            formData.currentPassword ===
            formData.newPassword
        ) {

            setError(
                "New password must be different from the current password."
            );

            return;
        }


        setLoading(true);


        try {

            await api.put(
                "/auth/password",
                {
                    currentPassword:
                        formData.currentPassword,

                    newPassword:
                        formData.newPassword
                }
            );


            setSuccess(
                "Password updated successfully."
            );


            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });


        } catch (err) {

            console.error(
                "PASSWORD UPDATE ERROR:",
                err
            );


            const responseData =
                err.response?.data;


            if (
                responseData?.errors &&
                Array.isArray(
                    responseData.errors
                )
            ) {

                setError(
                    responseData.errors
                        .map(
                            (item) =>
                                `${item.field}: ${item.message}`
                        )
                        .join(" | ")
                );

            } else {

                setError(
                    responseData?.message ||
                    "Failed to update password."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="admin-layout">

    


            <div className="main-section">

        


                <main className="dashboard-content">



                    <div className="page-header">

                        <div>

                            <h1>
                                My Profile
                            </h1>

                            <p className="page-subtitle">
                                Manage your account
                                information and password
                            </p>

                        </div>

                    </div>



                    <div className="details-card">

                        <h2>
                            Account Information
                        </h2>


                        <div className="detail-row">

                            <strong>
                                Name
                            </strong>

                            <span>
                                {user?.name || "-"}
                            </span>

                        </div>


                        <div className="detail-row">

                            <strong>
                                Email
                            </strong>

                            <span>
                                {user?.email || "-"}
                            </span>

                        </div>


                        <div className="detail-row">

                            <strong>
                                Address
                            </strong>

                            <span>
                                {user?.address || "-"}
                            </span>

                        </div>


                        <div className="detail-row">

                            <strong>
                                Role
                            </strong>

                            <span
                                className={
                                    `role-badge role-${user?.role}`
                                }
                            >
                                {user?.role ===
                                "STORE_OWNER"
                                    ? "Store Owner"
                                    : user?.role ===
                                      "ADMIN"
                                    ? "Admin"
                                    : "Normal User"}
                            </span>

                        </div>

                    </div>


                
                    <div
                        className="form-card"
                        style={{
                            marginTop: "25px"
                        }}
                    >

                        <h2>
                            Change Password
                        </h2>


                        {error && (

                            <div className="error-message">

                                {error}

                            </div>

                        )}


                        {success && (

                            <div className="success-message">

                                {success}

                            </div>

                        )}


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="store-form"
                        >


                   
                            <div className="form-group">

                                <label>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={
                                        formData.currentPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter current password"
                                    required
                                />

                            </div>


                          

                            <div className="form-group">

                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    value={
                                        formData.newPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter new password"
                                    required
                                />

                            </div>


                            

                            <div className="form-group">

                                <label>
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Confirm new password"
                                    required
                                />

                            </div>


                            <p
                                style={{
                                    color:
                                        "#6b7280",
                                    fontSize:
                                        "13px"
                                }}
                            >
                                Password must be 8–16
                                characters and contain
                                an uppercase letter and
                                a special character.
                            </p>


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={
                                    loading
                                }
                            >

                                {loading
                                    ? "Updating..."
                                    : "Update Password"}

                            </button>

                        </form>

                    </div>

                </main>

            </div>

        </div>
    );
}


export default Profile;