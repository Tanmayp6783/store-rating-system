const authService = require("../services/auth.service");


const register = async (req, res, next) => {
    try {

        const result = await authService.registerUser(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {

        const result = await authService.loginUser(
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


const getMe = async (req, res, next) => {
    try {

        const user = await authService.getCurrentUser(
            req.user.id
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


const changePassword = async (req, res, next) => {
    try {

        await authService.changePassword(
            req.user.id,
            req.body.currentPassword,
            req.body.newPassword
        );

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login,
    getMe,
    changePassword
};