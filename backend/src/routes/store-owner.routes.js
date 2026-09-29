const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/store-owner.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");


router.get(
    "/dashboard",
    authenticate,
    authorize("STORE_OWNER"),
    controller.getDashboard
);


router.get(
    "/ratings",
    authenticate,
    authorize("STORE_OWNER"),
    controller.getRatings
);


module.exports = router;