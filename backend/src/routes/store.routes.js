const express = require("express");

const storeController =
    require("../controllers/store.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");


const router = express.Router();




router.use(authenticate);



router.get(
    "/",
    authorize("USER", "ADMIN"),
    storeController.getStores
);




router.get(
    "/:id",
    authorize("USER", "ADMIN"),
    storeController.getStoreById
);


module.exports = router;