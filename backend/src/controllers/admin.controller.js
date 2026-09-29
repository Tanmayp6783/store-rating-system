const adminService = require("../services/admin.service");


const getDashboard = async (req, res, next) => {
    try {

        const stats =
            await adminService.getDashboardStats();

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        next(error);
    }
};



const createUser = async (req, res, next) => {
    try {

        const user =
            await adminService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user
            }
        });

    } catch (error) {
        next(error);
    }
};



const getUsers = async (req, res, next) => {
    try {

        const result =
            await adminService.getUsers(req.query);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};




const getUserById = async (req, res, next) => {
    try {

        const user =
            await adminService.getUserById(
                req.params.id
            );

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        next(error);
    }
};




const createStore = async (req, res, next) => {
    try {

        const store =
            await adminService.createStore(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Store created successfully",
            data: {
                store
            }
        });

    } catch (error) {
        next(error);
    }
};




const getStores = async (req, res, next) => {
    try {

        const result =
            await adminService.getStores(req.query);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getDashboard,
    createUser,
    getUsers,
    getUserById,
    createStore,
    getStores
};