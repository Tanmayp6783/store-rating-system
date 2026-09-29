const express = require("express");

const adminController =
    require("../controllers/admin.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

const validate =
    require("../middleware/validation.middleware");

const {
    createAdminUserValidator,
    createStoreValidator
} = require("../validators/admin.validator");


const router = express.Router();



router.use(authenticate);
router.use(authorize("ADMIN"));




router.get(
    "/dashboard",
    adminController.getDashboard
);




router.post(
    "/users",
    createAdminUserValidator,
    validate,
    adminController.createUser
);


router.get(
    "/users",
    adminController.getUsers
);


router.get(
    "/users/:id",
    adminController.getUserById
);




router.post(
    "/stores",
    createStoreValidator,
    validate,
    adminController.createStore
);


router.get(
    "/stores",
    adminController.getStores
);


module.exports = router;