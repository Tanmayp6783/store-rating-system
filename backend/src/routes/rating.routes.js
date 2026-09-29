const express = require("express");

const ratingController =
    require("../controllers/rating.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

const validate =
    require("../middleware/validation.middleware");

const {
    createRatingValidator,
    updateRatingValidator
} = require("../validators/rating.validator");


const router = express.Router();




router.use(authenticate);




router.post(
    "/",
    authorize("USER"),
    createRatingValidator,
    validate,
    ratingController.createRating
);




router.put(
    "/:storeId",
    authorize("USER"),
    updateRatingValidator,
    validate,
    ratingController.updateRating
);




router.get(
    "/store/:storeId",
    authorize(
        "USER",
        "ADMIN",
        "STORE_OWNER"
    ),
    ratingController.getStoreRatings
);


module.exports = router;