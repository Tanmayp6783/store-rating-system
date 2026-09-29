import { useEffect, useState } from "react";

import api from "../../services/api";

import Loading from "../../components/Loading";


function OwnerDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [ratings, setRatings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [ratingsLoading, setRatingsLoading] = useState(true);

    const [error, setError] = useState("");

    const [ratingsError, setRatingsError] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);


    const fetchDashboard = async () => {

        try {

            const response =
                await api.get(
                    "/store-owner/dashboard"
                );

            const data =
                response.data.data ||
                response.data;

            setDashboard(data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }
    };


   
    const fetchRatings = async () => {

        setRatingsLoading(true);

        setRatingsError("");

        try {

            const response =
                await api.get(
                    "/store-owner/ratings",
                    {
                        params: {
                            page,
                            limit: 10
                        }
                    }
                );


            const data =
                response.data.data ||
                response.data;


            setRatings(
                data.ratings ||
                data.rows ||
                []
            );


            setTotalPages(
                data.totalPages || 1
            );

        } catch (err) {

            console.error(err);

            setRatingsError(
                err.response?.data?.message ||
                "Failed to load ratings"
            );

        } finally {

            setRatingsLoading(false);

        }
    };


    useEffect(() => {

        fetchDashboard();

    }, []);


    useEffect(() => {

        fetchRatings();

    }, [page]);


    return (

        <div className="admin-layout">

            <Sidebar />

            <div className="main-section">

                <Navbar />

                <main className="dashboard-content">

                

                    <div className="page-header">

                        <div>

                            <h1>
                                Store Owner Dashboard
                            </h1>

                            <p className="page-subtitle">
                                Monitor your store ratings
                                and customer feedback
                            </p>

                        </div>

                    </div>


              

                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                  

                    {loading ? (

                        <Loading />

                    ) : dashboard ? (

                        <>

                         

                            <div className="owner-store-header">

                                <div>

                                    <p className="owner-label">
                                        Your Store
                                    </p>

                                    <h2>
                                        {
                                            dashboard.store?.name ||
                                            dashboard.storeName ||
                                            "My Store"
                                        }
                                    </h2>

                                    <p>
                                        {
                                            dashboard.store?.address ||
                                            dashboard.address ||
                                            ""
                                        }
                                    </p>

                                </div>

                            </div>



                            <div className="stats-grid">

                                <div className="stat-card">

                                    <div>

                                        <p className="stat-title">
                                            Average Rating
                                        </p>

                                        <h2>
                                            ⭐{" "}
                                            {Number(
                                                dashboard.averageRating ||
                                                dashboard.average_rating ||
                                                0
                                            ).toFixed(1)}
                                        </h2>

                                    </div>

                                    <div className="stat-icon">
                                        ⭐
                                    </div>

                                </div>


                                <div className="stat-card">

                                    <div>

                                        <p className="stat-title">
                                            Total Ratings
                                        </p>

                                        <h2>
                                            {
                                                dashboard.totalRatings ||
                                                dashboard.total_ratings ||
                                                0
                                            }
                                        </h2>

                                    </div>

                                    <div className="stat-icon">
                                        👥
                                    </div>

                                </div>


                                <div className="stat-card">

                                    <div>

                                        <p className="stat-title">
                                            Rating Status
                                        </p>

                                        <h2 className="owner-status">
                                            Active
                                        </h2>

                                    </div>

                                    <div className="stat-icon">
                                        📊
                                    </div>

                                </div>

                            </div>

                        </>

                    ) : null}



                    <div className="owner-ratings-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Customer Ratings
                                </h2>

                                <p>
                                    Users who rated your store
                                </p>

                            </div>

                        </div>


                        {ratingsError && (

                            <div className="error-message">
                                {ratingsError}
                            </div>

                        )}


                        <div className="table-card">

                            {ratingsLoading ? (

                                <Loading />

                            ) : ratings.length === 0 ? (

                                <div className="empty-state">

                                    <h3>
                                        No ratings yet
                                    </h3>

                                    <p>
                                        Customer ratings
                                        will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="table-wrapper">

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>
                                                    User
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    Rating
                                                </th>

                                                <th>
                                                    Date
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {ratings.map(
                                                (item, index) => (

                                                    <tr
                                                        key={
                                                            item.id ||
                                                            index
                                                        }
                                                    >

                                                        <td>

                                                            {
                                                                item.userName ||
                                                                item.user_name ||
                                                                item.name ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                item.email ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            <span className="rating-display">

                                                                {"★".repeat(
                                                                    Number(
                                                                        item.rating
                                                                    )
                                                                )}

                                                                <span className="empty-stars">

                                                                    {"★".repeat(
                                                                        5 -
                                                                        Number(
                                                                            item.rating
                                                                        )
                                                                    )}

                                                                </span>

                                                                {" "}
                                                                (
                                                                {
                                                                    item.rating
                                                                }/5)

                                                            </span>

                                                        </td>


                                                        <td>

                                                            {
                                                                item.createdAt
                                                                    ? new Date(
                                                                        item.createdAt
                                                                    ).toLocaleDateString()
                                                                    : item.created_at
                                                                        ? new Date(
                                                                            item.created_at
                                                                        ).toLocaleDateString()
                                                                        : "-"
                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>


                    

                        {!ratingsLoading &&
                            ratings.length > 0 && (

                                <div className="pagination">

                                    <button
                                        disabled={
                                            page === 1
                                        }
                                        onClick={() =>
                                            setPage(
                                                page - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </button>


                                    <span>
                                        Page {page} of{" "}
                                        {totalPages}
                                    </span>


                                    <button
                                        disabled={
                                            page >=
                                            totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                page + 1
                                            )
                                        }
                                    >
                                        Next
                                    </button>

                                </div>

                            )}

                    </div>

                </main>

            </div>

        </div>
    );
}


export default OwnerDashboard;