const express = require("express");
const router = express.Router();
const authenticateOfficer = require("../middlewares/auth/transportOfficerAuth");
const authenticateDriver = require("../middlewares/auth/driverAuth");
const transportUnitController = require("../controllers/transportUnit.controller");
router.post(
	"/register",
	authenticateOfficer,
	transportUnitController.registerBus
);
router.post("/officer/login", transportUnitController.officerLogin);
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
