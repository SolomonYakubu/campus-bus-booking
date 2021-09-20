const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/auth/userAuth");

const userController = require("../controllers/user.controller");

router.get("/", authenticateUser, userController.getUserInfo);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get(
	"/bus/:destination",
	authenticateUser,
	userController.getBusesByDestination
);
router.post("/book/:id", authenticateUser, userController.bookBusById);
router.post("/wallet/fund", authenticateUser, userController.fundUserWallet);
module.exports = router;
