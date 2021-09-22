const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middlewares/auth/adminAuth");
const authenticateDriver = require("../middlewares/auth/driverAuth");
const transportUnitController = require("../controllers/transportUnit.controller");
router.post(
	"/register",
	authenticateAdmin,
	transportUnitController.registerBus
);
router.post("/admin/login", transportUnitController.adminLogin);
router.post("/driver/login", transportUnitController.driverLogin);
router.post(
	"/driver/status",
	authenticateDriver,
	transportUnitController.setDriverStatus
);
router.get(
	"/ticket/verify/:code",
	authenticateDriver,
	transportUnitController.verifyTicket
);
module.exports = router;
