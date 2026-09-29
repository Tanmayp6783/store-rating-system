const pool = require("../config/database");




const getOwnerStore = async (ownerId) => {

    const [stores] = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            address,
            owner_id
        FROM stores
        WHERE owner_id = ?
        LIMIT 1
        `,
        [ownerId]
    );


    if (stores.length === 0) {

        const error = new Error(
            "No store found for this store owner."
        );

        error.statusCode = 404;

        throw error;
    }


    return stores[0];
};




const getDashboard = async (ownerId) => {

    const store =
        await getOwnerStore(ownerId);


    const [ratingStats] =
        await pool.query(
            `
            SELECT
                COUNT(r.id) AS total_ratings,

                COALESCE(
                    AVG(r.rating),
                    0
                ) AS average_rating

            FROM ratings r

            WHERE r.store_id = ?
            `,
            [store.id]
        );


    return {

        store: {

            id: store.id,

            name: store.name,

            email: store.email,

            address: store.address

        },

        totalRatings:
            Number(
                ratingStats[0].total_ratings
            ),

        averageRating:
            Number(
                ratingStats[0].average_rating
            )

    };
};




const getOwnerRatings = async (
    ownerId,
    page = 1,
    limit = 10
) => {

    const store =
        await getOwnerStore(ownerId);


    const offset =
        (Number(page) - 1) *
        Number(limit);


    const [ratings] =
        await pool.query(
            `
            SELECT

                r.id,

                r.rating,

                r.created_at,

                u.id AS user_id,

                u.name AS user_name,

                u.email AS user_email

            FROM ratings r

            INNER JOIN users u
                ON r.user_id = u.id

            WHERE r.store_id = ?

            ORDER BY
                r.created_at DESC

            LIMIT ?
            OFFSET ?
            `,
            [
                store.id,
                Number(limit),
                Number(offset)
            ]
        );


    const [countRows] =
        await pool.query(
            `
            SELECT
                COUNT(*) AS total

            FROM ratings

            WHERE store_id = ?
            `,
            [store.id]
        );


    const total =
        Number(
            countRows[0].total
        );


    return {

        ratings:
            ratings.map((rating) => ({

                id:
                    rating.id,

                userId:
                    rating.user_id,

                userName:
                    rating.user_name,

                userEmail:
                    rating.user_email,

                rating:
                    Number(
                        rating.rating
                    ),

                createdAt:
                    rating.created_at

            })),

        pagination: {

            page:
                Number(page),

            limit:
                Number(limit),

            total,

            totalPages:
                Math.ceil(
                    total /
                    Number(limit)
                )

        }

    };
};


module.exports = {

    getDashboard,

    getOwnerRatings

};