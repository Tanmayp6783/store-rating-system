const {
    body,
    param
} = require("express-validator");


const createRatingValidator = [
    body("storeId")
        .isInt({ min: 1 })
        .withMessage(
            "A valid store ID is required"
        ),

    body("rating")
        .isInt({
            min: 1,
            max: 5
        })
        .withMessage(
            "Rating must be between 1 and 5"
        )
];


const updateRatingValidator = [
    param("storeId")
        .isInt({ min: 1 })
        .withMessage(
            "A valid store ID is required"
        ),

    body("rating")
        .isInt({
            min: 1,
            max: 5
        })
        .withMessage(
            "Rating must be between 1 and 5"
        )
];


module.exports = {
    createRatingValidator,
    updateRatingValidator
};