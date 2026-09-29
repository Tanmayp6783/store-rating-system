const express = require("express");

const authController = require("../controllers/auth.controller");

const {
    registerValidator,
    loginValidator,
    changePasswordValidator
} = require("../validators/auth.validator");

const validate = require("../middleware/validation.middleware");

const {
    authenticate
} = require("../middleware/auth.middleware");


const router = express.Router();




router.post(
    "/register",
    registerValidator,
    validate,
    authController.register
);




router.post(
    "/login",
    loginValidator,
    validate,
    authController.login
);




router.get(
    "/me",
    authenticate,
    authController.getMe
);




router.put(
    "/password",
    authenticate,
    changePasswordValidator,
    validate,
    authController.changePassword
);


module.exports = router;