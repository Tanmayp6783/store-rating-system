import { useEffect, useState } from "react";
import api from "../../services/api";

function Stores() {

    const [stores, setStores] = useState([]);

    const [searchName, setSearchName] = useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [selectedStore, setSelectedStore] = useState(null);

    const [selectedRating, setSelectedRating] = useState(0);

    const [submittingRating, setSubmittingRating] = useState(false);


    
    const fetchStores = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get(
                "/stores",
                {
                    params: {
                        name:
                            searchName.trim() ||
                            undefined,

                        page,

                        limit: 10
                    }
                }
            );


            console.log(
                "USER STORES API RESPONSE:",
                response.data
            );


            const data =
                response.data?.data;


        

            let storesData = [];

            if (Array.isArray(data)) {

                storesData = data;

            } else if (
                Array.isArray(data?.stores)
            ) {

                storesData = data.stores;

            } else if (
                Array.isArray(data?.rows)
            ) {

                storesData = data.rows;

            }


            setStores(storesData);


            if (data?.pagination) {

                setPagination(
                    data.pagination
                );

            } else {

                setPagination({

                    page,

                    limit: 10,

                    total:
                        storesData.length,

                    totalPages: 1

                });

            }

        } catch (err) {

            console.error(
                "USER STORES API ERROR:",
                err.response?.data || err
            );


            setError(
                err.response?.data?.message ||
                "Failed to load stores."
            );


            setStores([]);

        } finally {

            setLoading(false);

        }

    };


    
    useEffect(() => {

        fetchStores();

    }, [page]);


    

    const handleSearch = () => {

        setPage(1);

        fetchStores();

    };


    

    const handleReset = () => {

        setSearchName("");

        setPage(1);

        setTimeout(() => {

            fetchStores();

        }, 0);

    };


 

    const openRatingModal = (store) => {

        setSelectedStore(store);

        setSelectedRating(
            Number(
                store.userRating ??
                store.user_rating ??
                0
            )
        );

        setError("");

        setSuccess("");

    };


  

    const closeRatingModal = () => {

        setSelectedStore(null);

        setSelectedRating(0);

    };



    const handleRatingSubmit = async () => {

        if (!selectedStore) {
            return;
        }


        if (
            selectedRating < 1 ||
            selectedRating > 5
        ) {

            setError(
                "Please select a rating from 1 to 5."
            );

            return;

        }


        try {

            setSubmittingRating(true);

            setError("");

            setSuccess("");


            const existingRating =
                Number(
                    selectedStore.userRating ??
                    selectedStore.user_rating ??
                    0
                );


            if (existingRating > 0) {

               

                await api.put(
                    `/ratings/${selectedStore.id}`,
                    {
                        rating:
                            selectedRating
                    }
                );


                setSuccess(
                    "Your rating has been updated successfully."
                );

            } else {

               

                await api.post(
                    "/ratings",
                    {
                        storeId:
                            selectedStore.id,

                        rating:
                            selectedRating
                    }
                );


                setSuccess(
                    "Your rating has been submitted successfully."
                );

            }


            closeRatingModal();

            await fetchStores();


        } catch (err) {

            console.error(
                "RATING ERROR:",
                err.response?.data || err
            );


            setError(
                err.response?.data?.message ||
                "Failed to submit rating."
            );

        } finally {

            setSubmittingRating(false);

        }

    };


   

    const renderStars = (rating) => {

        const value =
            Number(rating || 0);


        return (

            <div className="stars">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <= value
                                    ? "star star-filled"
                                    : "star star-empty"
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </div>

        );

    };


    

    const formatRating = (rating) => {

        if (
            rating === null ||
            rating === undefined
        ) {

            return "0.00";

        }

        return Number(rating).toFixed(2);

    };


   

    if (loading) {

        return (

            <div className="loading-container">

                <div className="loading-content">

                    <div className="loading-spinner">
                    </div>

                    <span>
                        Loading stores...
                    </span>

                </div>

            </div>

        );

    }


    return (

        <div>

            
            <div className="page-header">

                <div>

                    <h1>
                        Stores
                    </h1>

                    <p>
                        Search stores and share your rating
                    </p>

                </div>

            </div>



            {success && (

                <div className="success-message">

                    {success}

                </div>

            )}


         

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


        
            <div className="filters">

                <div className="filter-group">

                    <label>
                        Store Name
                    </label>

                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) =>
                            setSearchName(
                                e.target.value
                            )
                        }
                        placeholder="Search stores by name..."
                    />

                </div>


                <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                >
                    Search
                </button>


                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                >
                    Reset
                </button>

            </div>



            {stores.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        No stores found
                    </h3>

                    <p>
                        No stores are currently available.
                    </p>

                </div>

            ) : (

                <div className="store-grid">

                    {stores.map((store) => {

                        const averageRating =
                            store.averageRating ??
                            store.average_rating ??
                            0;


                        const totalRatings =
                            store.totalRatings ??
                            store.total_ratings ??
                            0;


                        const userRating =
                            store.userRating ??
                            store.user_rating ??
                            0;


                        return (

                            <div
                                className="store-card"
                                key={store.id}
                            >

                                

                                <h3>
                                    {store.name}
                                </h3>


                               

                                <div className="store-email">

                                    {store.email ||
                                        "Email not available"
                                    }

                                </div>


                             

                                <div className="store-address">

                                    {store.address ||
                                        "Address not available"
                                    }

                                </div>


                              
                                <div className="store-rating-section">


                                   

                                    <div className="rating-row">

                                        <span className="rating-label">
                                            Overall Rating
                                        </span>

                                        <span className="rating-value">

                                            {formatRating(
                                                averageRating
                                            )}

                                        </span>

                                    </div>


                                    <div>

                                        {renderStars(
                                            averageRating
                                        )}

                                    </div>


                                    

                                    <div className="rating-row">

                                        <span className="rating-label">
                                            Total Ratings
                                        </span>

                                        <span className="rating-value">
                                            {totalRatings}
                                        </span>

                                    </div>


                                 

                                    <div className="rating-row">

                                        <span className="rating-label">
                                            Your Rating
                                        </span>

                                        <span className="rating-value">

                                            {userRating
                                                ? `${userRating}/5`
                                                : "Not Rated"
                                            }

                                        </span>

                                    </div>

                                </div>


                            

                                <div className="store-card-actions">

                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            openRatingModal(
                                                store
                                            )
                                        }
                                    >

                                        {userRating
                                            ? "Update Rating"
                                            : "Rate Store"
                                        }

                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}


  

            {stores.length > 0 && (

                <div className="pagination">

                    <div className="pagination-info">

                        Page{" "}
                        {pagination.page || page}
                        {" "}of{" "}
                        {pagination.totalPages || 1}

                    </div>


                    <div className="pagination-buttons">

                        <button
                            disabled={page <= 1}
                            onClick={() =>
                                setPage(
                                    (previous) =>
                                        previous - 1
                                )
                            }
                        >
                            Previous
                        </button>


                        <button className="active">

                            {page}

                        </button>


                        <button
                            disabled={
                                page >=
                                (
                                    pagination.totalPages ||
                                    1
                                )
                            }
                            onClick={() =>
                                setPage(
                                    (previous) =>
                                        previous + 1
                                )
                            }
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}


            

            {selectedStore && (

                <div className="modal-overlay">

                    <div className="rating-modal">

                        <div className="modal-header">

                            <h2>
                                Rate {selectedStore.name}
                            </h2>

                            <button
                                className="modal-close"
                                onClick={
                                    closeRatingModal
                                }
                            >
                                ×
                            </button>

                        </div>


                        <p
                            style={{
                                textAlign: "center",
                                color: "#64748b"
                            }}
                        >
                            Select your rating
                        </p>


                        {/* STARS */}

                        <div className="rating-modal-stars">

                            {[1, 2, 3, 4, 5].map(
                                (star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        className={
                                            star <=
                                            selectedRating
                                                ? "rating-star-button selected"
                                                : "rating-star-button"
                                        }
                                        onClick={() =>
                                            setSelectedRating(
                                                star
                                            )
                                        }
                                    >
                                        ★
                                    </button>

                                )
                            )}

                        </div>


                        <p
                            style={{
                                textAlign: "center",
                                fontWeight: "700",
                                marginBottom: "15px"
                            }}
                        >

                            {selectedRating > 0
                                ? `${selectedRating} / 5`
                                : "Select a rating"
                            }

                        </p>


                     

                        <div className="modal-actions">

                            <button
                                className="btn btn-secondary"
                                onClick={
                                    closeRatingModal
                                }
                                disabled={
                                    submittingRating
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="btn btn-primary"
                                onClick={
                                    handleRatingSubmit
                                }
                                disabled={
                                    submittingRating ||
                                    selectedRating === 0
                                }
                            >

                                {submittingRating
                                    ? "Saving..."
                                    : "Submit Rating"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Stores;