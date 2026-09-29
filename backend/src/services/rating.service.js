const pool = require("../config/database");




const createRating = async ({
    userId,
    storeId,
    rating
}) => {



    const [stores] = await pool.query(
        `
        SELECT id
        FROM stores
        WHERE id = ?
        LIMIT 1
        `,
        [storeId]
    );

    if (stores.length === 0) {
        const error =
            new Error("Store not found");

        error.statusCode = 404;

        throw error;
    }



    const [existingRatings] =
        await pool.query(
            `
            SELECT id
            FROM ratings
            WHERE user_id = ?
            AND store_id = ?
            LIMIT 1
            `,
            [
                userId,
                storeId
            ]
        );


    if (existingRatings.length > 0) {
        const error =
            new Error(
                "You have already rated this store"
            );

        error.statusCode = 409;

        throw error;
    }




    const [result] =
        await pool.query(
            `
            INSERT INTO ratings
            (
                user_id,
                store_id,
                rating
            )
            VALUES (?, ?, ?)
            `,
            [
                userId,
                storeId,
                rating
            ]
        );


    return {
        id: result.insertId,
        userId,
        storeId,
        rating
    };
};




const updateRating = async ({
    userId,
    storeId,
    rating
}) => {



    const [existingRatings] =
        await pool.query(
            `
            SELECT id
            FROM ratings
            WHERE user_id = ?
            AND store_id = ?
            LIMIT 1
            `,
            [
                userId,
                storeId
            ]
        );


    if (existingRatings.length === 0) {
        const error =
            new Error(
                "You have not rated this store yet"
            );

        error.statusCode = 404;

        throw error;
    }



    await pool.query(
        `
        UPDATE ratings
        SET rating = ?
        WHERE user_id = ?
        AND store_id = ?
        `,
        [
            rating,
            userId,
            storeId
        ]
    );


    return {
        userId,
        storeId,
        rating
    };
};



const getStoreRatings = async (
    storeId
) => {

    const [ratings] =
        await pool.query(
            `
            SELECT
                r.id,
                r.rating,
                r.created_at,
                r.updated_at,

                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email

            FROM ratings r

            INNER JOIN users u
                ON u.id = r.user_id

            WHERE r.store_id = ?

            ORDER BY
                r.created_at DESC
            `,
            [storeId]
        );


    return ratings;
};


module.exports = {
    createRating,
    updateRating,
    getStoreRatings
};