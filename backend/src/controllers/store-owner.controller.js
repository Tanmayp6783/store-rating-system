const storeOwnerService = require("../services/store-owner.service");



const getDashboard = async (req, res, next) => {
    try {
        const data = await storeOwnerService.getDashboard(
            req.user.id
        );

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};




const getRatings = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10
        } = req.query;

        const data =
            await storeOwnerService.getOwnerRatings(
                req.user.id,
                Number(page),
                Number(limit)
            );

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    getDashboard,
    getRatings
};