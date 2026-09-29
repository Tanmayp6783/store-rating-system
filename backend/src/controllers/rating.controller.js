const ratingService =
    require("../services/rating.service");



const createRating = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await ratingService.createRating({
                userId: req.user.id,
                storeId: req.body.storeId,
                rating: req.body.rating
            });

        res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
            data: {
                rating: result
            }
        });

    } catch (error) {
        next(error);
    }
};




const updateRating = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await ratingService.updateRating({
                userId: req.user.id,
                storeId: req.params.storeId,
                rating: req.body.rating
            });

        res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            data: {
                rating: result
            }
        });

    } catch (error) {
        next(error);
    }
};




const getStoreRatings = async (
    req,
    res,
    next
) => {

    try {

        const ratings =
            await ratingService.getStoreRatings(
                req.params.storeId
            );

        res.status(200).json({
            success: true,
            data: {
                ratings
            }
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createRating,
    updateRating,
    getStoreRatings
};