const pool = require("../config/database");



const getStores = async ({
    userId,
    name,
    address,
    sortBy = "name",
    sortOrder = "ASC",
    page = 1,
    limit = 10
}) => {

    const conditions = [];
    const values = [];



    if (name) {
        conditions.push("s.name LIKE ?");
        values.push(`%${name}%`);
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
        address: "s.address",
        rating: "average_rating",
        created_at: "s.created_at"
    };

    const safeSortBy =
        allowedSortFields[sortBy] ||
        allowedSortFields.name;

    const safeSortOrder =
        String(sortOrder).toUpperCase() === "DESC"
            ? "DESC"
            : "ASC";




    const safePage = Math.max(
        Number(page) || 1,
        1
    );

    const safeLimit = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const offset =
        (safePage - 1) * safeLimit;




    const [countRows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM stores s
        ${whereClause}
        `,
        values
    );

    const total =
        Number(countRows[0].total);




    const [stores] = await pool.query(
        `
        SELECT
            s.id,
            s.name,
            s.address,

            COALESCE(
                ROUND(AVG(all_ratings.rating), 2),
                0
            ) AS average_rating,

            COUNT(all_ratings.id)
                AS total_ratings,

            user_rating.rating
                AS user_rating

        FROM stores s

        LEFT JOIN ratings all_ratings
            ON all_ratings.store_id = s.id

        LEFT JOIN ratings user_rating
            ON user_rating.store_id = s.id
            AND user_rating.user_id = ?

        ${whereClause}

        GROUP BY
            s.id,
            s.name,
            s.address,
            user_rating.rating

        ORDER BY
            ${safeSortBy}
            ${safeSortOrder}

        LIMIT ? OFFSET ?
        `,
        [
            userId,
            ...values,
            safeLimit,
            offset
        ]
    );


    return {
        data: stores.map((store) => ({
            id: store.id,
            name: store.name,
            address: store.address,
            averageRating:
                Number(store.average_rating),
            totalRatings:
                Number(store.total_ratings),
            userRating:
                store.user_rating === null
                    ? null
                    : Number(store.user_rating)
        })),

        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages:
                Math.ceil(total / safeLimit)
        }
    };
};




const getStoreById = async (
    storeId,
    userId
) => {

    const [stores] = await pool.query(
        `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,

            COALESCE(
                ROUND(AVG(r.rating), 2),
                0
            ) AS average_rating,

            COUNT(r.id)
                AS total_ratings,

            (
                SELECT rating
                FROM ratings
                WHERE store_id = ?
                AND user_id = ?
                LIMIT 1
            ) AS user_rating

        FROM stores s

        LEFT JOIN ratings r
            ON r.store_id = s.id

        WHERE s.id = ?

        GROUP BY
            s.id,
            s.name,
            s.email,
            s.address
        `,
        [
            storeId,
            userId,
            storeId
        ]
    );


    if (stores.length === 0) {
        const error =
            new Error("Store not found");

        error.statusCode = 404;

        throw error;
    }


    const store = stores[0];


    return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating:
            Number(store.average_rating),
        totalRatings:
            Number(store.total_ratings),
        userRating:
            store.user_rating === null
                ? null
                : Number(store.user_rating)
    };
};


module.exports = {
    getStores,
    getStoreById
};