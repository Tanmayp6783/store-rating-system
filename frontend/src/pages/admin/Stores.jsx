import { useEffect, useState } from "react";
import api from "../../services/api";

function Stores() {
    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchName, setSearchName] = useState("");

    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: ""
    });

    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [creating, setCreating] = useState(false);


  

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/stores", {
                params: {
                    name: searchName || undefined,
                    sortBy,
                    sortOrder,
                    page,
                    limit: 10
                }
            });

            console.log(
                "ADMIN STORES API RESPONSE:",
                response.data
            );

            const data = response.data?.data;

           

            let storesData = [];

            if (Array.isArray(data)) {
                storesData = data;
            } else if (Array.isArray(data?.stores)) {
                storesData = data.stores;
            } else if (Array.isArray(data?.rows)) {
                storesData = data.rows;
            }

            setStores(storesData);

            if (data?.pagination) {
                setPagination(data.pagination);
            } else {
                setPagination({
                    page,
                    limit: 10,
                    total: storesData.length,
                    totalPages:
                        storesData.length > 0 ? 1 : 1
                });
            }

        } catch (err) {
            console.error(
                "ADMIN STORES API ERROR:",
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
    }, [page, sortBy, sortOrder]);



    const handleSearch = () => {
        setPage(1);
        fetchStores();
    };


 

    const handleReset = () => {
        setSearchName("");
        setSortBy("name");
        setSortOrder("asc");
        setPage(1);

        setTimeout(() => {
            fetchStores();
        }, 0);
    };


    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };



    const handleCreateStore = async (e) => {
        e.preventDefault();

        setFormError("");
        setFormSuccess("");

        if (!formData.name.trim()) {
            setFormError("Store name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setFormError("Store email is required.");
            return;
        }

        if (!formData.address.trim()) {
            setFormError("Store address is required.");
            return;
        }

        if (!formData.ownerId) {
            setFormError("Store owner ID is required.");
            return;
        }

        try {
            setCreating(true);

            const response = await api.post(
                "/admin/stores",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    address: formData.address.trim(),
                    ownerId: Number(formData.ownerId)
                }
            );

            console.log(
                "CREATE STORE RESPONSE:",
                response.data
            );

            setFormSuccess(
                "Store created successfully."
            );

            setFormData({
                name: "",
                email: "",
                address: "",
                ownerId: ""
            });

            setShowForm(false);

            setPage(1);

            await fetchStores();

        } catch (err) {
            console.error(
                "CREATE STORE ERROR:",
                err.response?.data || err
            );

            const responseData =
                err.response?.data;

            if (
                responseData?.errors &&
                responseData.errors.length > 0
            ) {
                setFormError(
                    responseData.errors
                        .map((item) => item.msg)
                        .join(" ")
                );
            } else {
                setFormError(
                    responseData?.message ||
                    "Failed to create store."
                );
            }

        } finally {
            setCreating(false);
        }
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
                    <div className="loading-spinner"></div>

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
                        Stores Management
                    </h1>

                    <p>
                        Manage registered stores and their ratings
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowForm(!showForm);
                        setFormError("");
                        setFormSuccess("");
                    }}
                >
                    {showForm
                        ? "Close"
                        : "+ Add Store"
                    }
                </button>

            </div>


            {showForm && (
                <div className="form-card">

                    <h2>
                        Create New Store
                    </h2>

                    {formError && (
                        <div className="error-message">
                            {formError}
                        </div>
                    )}

                    {formSuccess && (
                        <div className="success-message">
                            {formSuccess}
                        </div>
                    )}

                    <form
                        onSubmit={handleCreateStore}
                    >

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Store Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter store name"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Store Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter store email"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter store address"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Store Owner ID
                                </label>

                                <input
                                    type="number"
                                    name="ownerId"
                                    value={formData.ownerId}
                                    onChange={handleChange}
                                    placeholder="Example: 3"
                                    min="1"
                                />

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={creating}
                            >
                                {creating
                                    ? "Creating..."
                                    : "Create Store"
                                }
                            </button>

                        </div>

                    </form>

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
                        placeholder="Search store name..."
                        value={searchName}
                        onChange={(e) =>
                            setSearchName(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="filter-group">

                    <label>
                        Sort By
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setPage(1);
                        }}
                    >

                        <option value="name">
                            Name
                        </option>

                        <option value="address">
                            Address
                        </option>

                        <option value="average_rating">
                            Average Rating
                        </option>

                        <option value="total_ratings">
                            Total Ratings
                        </option>

                    </select>

                </div>


                <div className="filter-group">

                    <label>
                        Order
                    </label>

                    <select
                        value={sortOrder}
                        onChange={(e) => {
                            setSortOrder(e.target.value);
                            setPage(1);
                        }}
                    >

                        <option value="asc">
                            Ascending
                        </option>

                        <option value="desc">
                            Descending
                        </option>

                    </select>

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
                        Create a store or change your search.
                    </p>

                </div>

            ) : (

                <div className="table-container">

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Store Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Address
                                </th>

                                <th>
                                    Owner
                                </th>

                                <th>
                                    Average Rating
                                </th>

                                <th>
                                    Total Ratings
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {stores.map((store) => (

                                <tr key={store.id}>

                                    <td>
                                        {store.id}
                                    </td>

                                    <td>
                                        <strong>
                                            {store.name}
                                        </strong>
                                    </td>

                                    <td>
                                        {store.email || "-"}
                                    </td>

                                    <td>
                                        {store.address || "-"}
                                    </td>

                                    <td>
                                        {store.owner_name ||
                                            store.owner_id ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        ⭐{" "}
                                        {formatRating(
                                            store.averageRating ??
                                            store.average_rating
                                        )}
                                    </td>

                                    <td>
                                        {store.totalRatings ??
                                            store.total_ratings ??
                                            0
                                        }
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

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

        </div>
    );
}

export default Stores;