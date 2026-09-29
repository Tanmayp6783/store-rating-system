import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

function UserDetails() {

    const { id } = useParams();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchUser = async () => {

            try {

                const response =
                    await api.get(
                        `/admin/users/${id}`
                    );

                const data =
                    response.data.data ||
                    response.data;

                setUser(
                    data.user ||
                    data
                );

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load user"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchUser();

    }, [id]);


    return (

        <div className="admin-layout">

            <Sidebar />

            <div className="main-section">

                <Navbar />

                <main className="dashboard-content">

                    <Link
                        to="/admin/users"
                        className="back-link"
                    >
                        ← Back to Users
                    </Link>

                    <h1>
                        User Details
                    </h1>


                    {loading && <Loading />}


                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                    {user && (

                        <div className="details-card">

                            <div className="detail-row">

                                <strong>
                                    ID
                                </strong>

                                <span>
                                    {user.id}
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Name
                                </strong>

                                <span>
                                    {user.name}
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Email
                                </strong>

                                <span>
                                    {user.email}
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Address
                                </strong>

                                <span>
                                    {user.address || "-"}
                                </span>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Role
                                </strong>

                                <span>
                                    {user.role}
                                </span>

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}

export default UserDetails;