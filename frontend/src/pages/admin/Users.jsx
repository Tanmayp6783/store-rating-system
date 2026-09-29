import { useEffect, useState } from "react";
import api from "../../services/api";

function Users() {


    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

   

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [role, setRole] = useState("");

    const [sortBy, setSortBy] = useState("name");

    const [sortOrder, setSortOrder] = useState("asc");

   

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });




    const [selectedUser, setSelectedUser] = useState(null);

    const [loadingDetails, setLoadingDetails] =
        useState(false);

    const [detailsError, setDetailsError] =
        useState("");


    

    const fetchUsers = async () => {
        try {
            setLoading(true);

            setError("");

            const response = await api.get(
                "/admin/users",
                {
                    params: {
                        name: name.trim() || undefined,

                        email:
                            email.trim() ||
                            undefined,

                        role:
                            role ||
                            undefined,

                        sortBy,

                        sortOrder,

                        page,

                        limit: 10
                    }
                }
            );


            console.log(
                "ADMIN USERS API RESPONSE:",
                response.data
            );


          


            const data =
                response.data?.data;


            let usersData = [];


            if (Array.isArray(data)) {

                usersData = data;

            } else if (
                Array.isArray(data?.users)
            ) {

                usersData = data.users;

            } else if (
                Array.isArray(data?.rows)
            ) {

                usersData = data.rows;

            }


            setUsers(usersData);


            if (data?.pagination) {

                setPagination(
                    data.pagination
                );

            } else {

                setPagination({

                    page,

                    limit: 10,

                    total:
                        usersData.length,

                    totalPages: 1

                });

            }

        } catch (err) {

            console.error(
                "ADMIN USERS ERROR:",
                err.response?.data || err
            );


            setError(
                err.response?.data?.message ||
                "Failed to load users."
            );


            setUsers([]);

        } finally {

            setLoading(false);

        }
    };




    useEffect(() => {

        fetchUsers();

    }, [
        page,
        sortBy,
        sortOrder
    ]);


  

    const handleSearch = () => {

        setPage(1);

        fetchUsers();

    };


  

    const handleReset = () => {

        setName("");

        setEmail("");

        setRole("");

        setSortBy("name");

        setSortOrder("asc");

        setPage(1);


        setTimeout(() => {

            fetchUsers();

        }, 0);

    };


  
    const handleViewUser = async (id) => {

        try {

            setLoadingDetails(true);

            setDetailsError("");

            setSelectedUser(null);


            const response = await api.get(
                `/admin/users/${id}`
            );


            console.log(
                "USER DETAILS API RESPONSE:",
                response.data
            );



            const rawUser =
                response.data?.data?.user ||
                response.data?.data ||
                response.data?.user ||
                response.data;


            const user = {

                id:
                    rawUser?.id ??
                    rawUser?.user_id ??
                    "-",

                name:
                    rawUser?.name ??
                    rawUser?.full_name ??
                    rawUser?.user_name ??
                    "-",

                email:
                    rawUser?.email ??
                    rawUser?.user_email ??
                    "-",

                address:
                    rawUser?.address ??
                    "-",

                role:
                    rawUser?.role ??
                    "-",

                createdAt:
                    rawUser?.createdAt ??
                    rawUser?.created_at ??
                    "-"

            };


            console.log(
                "NORMALIZED USER:",
                user
            );


            setSelectedUser(user);

        } catch (err) {

            console.error(
                "USER DETAILS ERROR:",
                err.response?.data || err
            );


            setDetailsError(
                err.response?.data?.message ||
                "Failed to load user details."
            );

        } finally {

            setLoadingDetails(false);

        }

    };


   

    const handleCloseDetails = () => {

        setSelectedUser(null);

        setDetailsError("");

    };


   

    const getRoleName = (userRole) => {

        if (
            userRole === "STORE_OWNER"
        ) {

            return "Store Owner";

        }

        if (
            userRole === "ADMIN"
        ) {

            return "Admin";

        }

        return "Normal User";

    };




    const getRoleClass = (userRole) => {

        if (
            userRole === "STORE_OWNER"
        ) {

            return "role-store-owner";

        }

        if (
            userRole === "ADMIN"
        ) {

            return "role-admin";

        }

        return "role-user";

    };


  
    const formatDate = (date) => {

        if (
            !date ||
            date === "-"
        ) {

            return "-";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "-";

        }


        return parsedDate.toLocaleDateString(
            "en-IN"
        );

    };



    if (loading) {

        return (

            <div className="loading-container">

                <div className="loading-content">

                    <div className="loading-spinner">
                    </div>

                    <span>
                        Loading users...
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
                        Users Management
                    </h1>

                    <p>
                        Manage registered users and their roles
                    </p>

                </div>

            </div>


           

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


           

            <div className="filters">

          

                <div className="filter-group">

                    <label>
                        Name
                    </label>

                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                    />

                </div>



                <div className="filter-group">

                    <label>
                        Email
                    </label>

                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                    />

                </div>



                <div className="filter-group">

                    <label>
                        Role
                    </label>

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Roles
                        </option>

                        <option value="USER">
                            Normal User
                        </option>

                        <option value="STORE_OWNER">
                            Store Owner
                        </option>

                        <option value="ADMIN">
                            Admin
                        </option>

                    </select>

                </div>


               

                <div className="filter-group">

                    <label>
                        Sort By
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) => {

                            setSortBy(
                                e.target.value
                            );

                            setPage(1);

                        }}
                    >

                        <option value="name">
                            Name
                        </option>

                        <option value="email">
                            Email
                        </option>

                        <option value="role">
                            Role
                        </option>

                        <option value="created_at">
                            Created Date
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

                            setSortOrder(
                                e.target.value
                            );

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


           

            {users.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        No users found
                    </h3>

                    <p>
                        Try changing your search or filters.
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
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Address
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Created
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.map((user) => (

                                <tr
                                    key={
                                        user.id
                                    }
                                >

                                   
                                    <td>
                                        {user.id}
                                    </td>


                                   

                                    <td>

                                        <strong>
                                            {user.name ||
                                                "-"
                                            }
                                        </strong>

                                    </td>


                                  

                                    <td>

                                        {user.email ||
                                            "-"
                                        }

                                    </td>


                                   

                                    <td>

                                        {user.address ||
                                            "-"
                                        }

                                    </td>


                                  

                                    <td>

                                        <span
                                            className={
                                                `role-badge ${
                                                    getRoleClass(
                                                        user.role
                                                    )
                                                }`
                                            }
                                        >

                                            {getRoleName(
                                                user.role
                                            )}

                                        </span>

                                    </td>


                                    

                                    <td>

                                        {formatDate(
                                            user.createdAt ??
                                            user.created_at
                                        )}

                                    </td>


                               

                                    <td>

                                        <button
                                            className="btn btn-primary btn-small"
                                            onClick={() =>
                                                handleViewUser(
                                                    user.id
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}



            {users.length > 0 && (

                <div className="pagination">

                    <div className="pagination-info">

                        Page{" "}
                        {pagination.page ||
                            page}

                        {" "}of{" "}

                        {pagination.totalPages ||
                            1}

                    </div>


                    <div className="pagination-buttons">

                        <button
                            disabled={
                                page <= 1
                            }
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



            {(selectedUser ||
                loadingDetails ||
                detailsError) && (

                <div
                    className="modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            handleCloseDetails();

                        }

                    }}
                >

                    <div className="details-modal">

                      

                        <div className="modal-header">

                            <h2>
                                User Details
                            </h2>

                            <button
                                className="modal-close"
                                onClick={
                                    handleCloseDetails
                                }
                            >
                                ×
                            </button>

                        </div>


                      

                        {loadingDetails && (

                            <div className="loading-content">

                                <div className="loading-spinner">
                                </div>

                                <span>
                                    Loading user details...
                                </span>

                            </div>

                        )}


                       

                        {!loadingDetails &&
                            detailsError && (

                                <div className="error-message">

                                    {detailsError}

                                </div>

                            )}


                      

                        {!loadingDetails &&
                            !detailsError &&
                            selectedUser && (

                                <div className="details-content">

                                    {/* ID */}

                                    <div className="details-row">

                                        <span>
                                            ID
                                        </span>

                                        <strong>
                                            {selectedUser.id ||
                                                "-"
                                            }
                                        </strong>

                                    </div>


                                  

                                    <div className="details-row">

                                        <span>
                                            Name
                                        </span>

                                        <strong>
                                            {selectedUser.name ||
                                                "-"
                                            }
                                        </strong>

                                    </div>


                                   

                                    <div className="details-row">

                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {selectedUser.email ||
                                                "-"
                                            }
                                        </strong>

                                    </div>


                                 

                                    <div className="details-row">

                                        <span>
                                            Address
                                        </span>

                                        <strong>
                                            {selectedUser.address ||
                                                "-"
                                            }
                                        </strong>

                                    </div>


                                 

                                    <div className="details-row">

                                        <span>
                                            Role
                                        </span>

                                        <span
                                            className={
                                                `role-badge ${
                                                    getRoleClass(
                                                        selectedUser.role
                                                    )
                                                }`
                                            }
                                        >

                                            {getRoleName(
                                                selectedUser.role
                                            )}

                                        </span>

                                    </div>


                                   

                                    <div className="details-row">

                                        <span>
                                            Created
                                        </span>

                                        <strong>
                                            {formatDate(
                                                selectedUser.createdAt
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            )}


                      
                        <div className="modal-actions">

                            <button
                                className="btn btn-secondary"
                                onClick={
                                    handleCloseDetails
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Users;