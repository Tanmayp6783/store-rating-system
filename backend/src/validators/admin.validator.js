const { body } = require("express-validator");


const createAdminUserValidator = [
    body("name")
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage(
            "Name must be between 20 and 60 characters"
        ),

    body("email")
        .trim()
        .isEmail()
        .withMessage(
            "Please provide a valid email address"
        )
        .normalizeEmail(),

    body("address")
        .trim()
        .isLength({ max: 400 })
        .withMessage(
            "Address cannot exceed 400 characters"
        ),

    body("password")
        .isLength({ min: 8, max: 16 })
        .withMessage(
            "Password must be between 8 and 16 characters"
        )
        .matches(/[A-Z]/)
        .withMessage(
            "Password must contain an uppercase letter"
        )
        .matches(/[^A-Za-z0-9]/)
        .withMessage(
            "Password must contain a special character"
        ),

    body("role")
        .optional()
        .isIn([
            "USER",
            "ADMIN",
            "STORE_OWNER"
        ])
        .withMessage("Invalid user role")
];


const createStoreValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Store name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage(
            "Please provide a valid store email"
        )
        .normalizeEmail(),

    body("address")
        .trim()
        .isLength({ max: 400 })
        .withMessage(
            "Address cannot exceed 400 characters"
        ),

    body("ownerId")
        .isInt({ min: 1 })
        .withMessage(
            "A valid store owner ID is required"
        )
];


module.exports = {
    createAdminUserValidator,
    createStoreValidator
};