const storeService = require("../services/store.service");




const getStores = async (req, res, next) => {
    try {

        const result =
            await storeService.getStores({
                userId: req.user.id,
                ...req.query
            });

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};




const getStoreById = async (req, res, next) => {
    try {

        const store =
            await storeService.getStoreById(
                req.params.id,
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: {
                store
            }
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getStores,
    getStoreById
};