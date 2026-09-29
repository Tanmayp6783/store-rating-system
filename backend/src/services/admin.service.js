const bcrypt = require("bcryptjs");
const pool = require("../config/database");



const getDashboardStats = async () => {
    const [users] = await pool.query(
        "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [stores] = await pool.query(
        "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [ratings] = await pool.query(
        "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    return {
        totalUsers: Number(users[0].totalUsers),
        totalStores: Number(stores[0].totalStores),
        totalRatings: Number(ratings[0].totalRatings)
    };
};




const createUser = async ({
    name,
    email,
    password,
    address,
    role = "USER"
}) => {

    const allowedRoles = [
        "USER",
        "ADMIN",
        "STORE_OWNER"
    ];

    if (!allowedRoles.includes(role)) {
        const error = new Error("Invalid user role");
        error.statusCode = 400;
        throw error;
    }

    const [existingUsers] = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    if (existingUsers.length > 0) {
        const error = new Error(
            "A user with this email already exists"
        );

        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(
        password,
        12
    );

    const [result] = await pool.query(
        `
        INSERT INTO users
        (
            name,
            email,
            password_hash,
            address,
            role
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            name,
            email,
            passwordHash,
            address,
            role
        ]
    );

    return {
        id: result.insertId,
        name,
        email,
        address,
        role
    };
};




const getUsers = async ({
    name,
    email,
    address,
    role,
    sortBy = "created_at",
    sortOrder = "DESC",
    page = 1,
    limit = 10
}) => {

    const conditions = [];
    const values = [];

  

    if (name) {
        conditions.push("u.name LIKE ?");
        values.push(`%${name}%`);
    }

    if (email) {
        conditions.push("u.email LIKE ?");
        values.push(`%${email}%`);
    }

    if (address) {
        conditions.push("u.address LIKE ?");
        values.push(`%${address}%`);
    }

    if (role) {
        conditions.push("u.role = ?");
        values.push(role);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";




    const allowedSortFields = {
        id: "u.id",
        name: "u.name",
        email: "u.email",
        address: "u.address",
        role: "u.role",
        created_at: "u.created_at"
    };

    const safeSortBy =
        allowedSortFields[sortBy] ||
        allowedSortFields.created_at;

    const safeSortOrder =
        String(sortOrder).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";




    const safePage = Math.max(
        Number(page) || 1,
        1
    );

    const safeLimit = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const offset = (safePage - 1) * safeLimit;




    const [countRows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM users u
        ${whereClause}
        `,
        values
    );

    const total = Number(countRows[0].total);




    const [users] = await pool.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            u.address,
            u.role,
            u.created_at,
            u.updated_at
        FROM users u
        ${whereClause}
        ORDER BY ${safeSortBy} ${safeSortOrder}
        LIMIT ? OFFSET ?
        `,
        [
            ...values,
            safeLimit,
            offset
        ]
    );

    return {
        data: users,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit)
        }
    };
};




const getUserById = async (userId) => {

    const [users] = await pool.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            u.address,
            u.role,
            u.created_at,
            u.updated_at
        FROM users u
        WHERE u.id = ?
        LIMIT 1
        `,
        [userId]
    );

    if (users.length === 0) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const user = users[0];



    if (user.role === "STORE_OWNER") {

        const [stores] = await pool.query(
            `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(AVG(r.rating), 0) AS averageRating,
                COUNT(r.id) AS totalRatings
            FROM stores s
            LEFT JOIN ratings r
                ON r.store_id = s.id
            WHERE s.owner_id = ?
            GROUP BY
                s.id,
                s.name,
                s.email,
                s.address
            `,
            [userId]
        );

        user.stores = stores.map((store) => ({
            ...store,
            averageRating: Number(
                Number(store.averageRating).toFixed(2)
            ),
            totalRatings: Number(
                store.totalRatings
            )
        }));
    }

    return user;
};




const createStore = async ({
    name,
    email,
    address,
    ownerId
}) => {



    const [owners] = await pool.query(
        `
        SELECT id, role
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [ownerId]
    );

    if (owners.length === 0) {
        const error = new Error(
            "Store owner not found"
        );

        error.statusCode = 404;
        throw error;
    }

    if (owners[0].role !== "STORE_OWNER") {
        const error = new Error(
            "Selected user is not a Store Owner"
        );

        error.statusCode = 400;
        throw error;
    }



    const [result] = await pool.query(
        `
        INSERT INTO stores
        (
            name,
            email,
            address,
            owner_id
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            name,
            email,
            address,
            ownerId
        ]
    );

    return {
        id: result.insertId,
        name,
        email,
        address,
        ownerId
    };
};




const getStores = async ({
    name,
    email,
    address,
    sortBy = "created_at",
    sortOrder = "DESC",
    page = 1,
    limit = 10
}) => {

    const conditions = [];
    const values = [];

    if (name) {
        conditions.push("s.name LIKE ?");
        values.push(`%${name}%`);
    }

    if (email) {
        conditions.push("s.email LIKE ?");
        values.push(`%${email}%`);
    }

    if (address) {
        conditions.push("s.address LIKE ?");
        values.push(`%${address}%`);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";




    const allowedSortFields = {
        id: "s.id",
        name: "s.name",
        email: "s.email",
        address: "s.address",
        rating: "average_rating",
        created_at: "s.created_at"
    };

    const safeSortBy =
        allowedSortFields[sortBy] ||
        allowedSortFields.created_at;

    const safeSortOrder =
        String(sortOrder).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";


 

    const safePage = Math.max(
        Number(page) || 1,
        1
    );

    const safeLimit = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const offset = (safePage - 1) * safeLimit;




    const [countRows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM stores s
        ${whereClause}
        `,
        values
    );

    const total = Number(countRows[0].total);




    const [stores] = await pool.query(
        `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            s.owner_id,
            COALESCE(
                ROUND(AVG(r.rating), 2),
                0
            ) AS average_rating,
            COUNT(r.id) AS total_ratings,
            s.created_at
        FROM stores s

        LEFT JOIN ratings r
            ON r.store_id = s.id

        ${whereClause}

        GROUP BY
            s.id,
            s.name,
            s.email,
            s.address,
            s.owner_id,
            s.created_at

        ORDER BY ${safeSortBy} ${safeSortOrder}

        LIMIT ? OFFSET ?
        `,
        [
            ...values,
            safeLimit,
            offset
        ]
    );

    return {
        data: stores.map((store) => ({
            ...store,
            average_rating: Number(
                store.average_rating
            ),
            total_ratings: Number(
                store.total_ratings
            )
        })),
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit)
        }
    };
};


module.exports = {
    getDashboardStats,
    createUser,
    getUsers,
    getUserById,
    createStore,
    getStores
};