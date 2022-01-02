const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middlewares/auth/adminAuth");
const authenticateDriver = require("../middlewares/auth/driverAuth");
const transportUnitController = require("../controllers/transportUnit.controller");

router.get("/", authenticateAdmin, transportUnitController.getBuses);
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
router.get(
	"/driver/ongoing-trip",
	authenticateDriver,
	transportUnitController.ongoingTrip
);
router.delete(
	"/admin/delete-driver",
	authenticateAdmin,
	transportUnitController.deleteDriver
);
module.exports = router;
