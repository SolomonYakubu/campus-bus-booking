require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const authenticateOfficer = require("../auth/transportOfficerAuth");
const authenticateDriver = require("../auth/driverAuth");
const Bus = require("../models/transportUnit");
const { syncBuiltinESMExports } = require("module");
router.post("/register", authenticateOfficer, async (req, res) => {
	const { bus_id, number_of_seat } = req.body;

	try {
		if (await Bus.findOne({ bus_id })) {
			return res.sendStatus(403);
		}
		const driver_id = await crypto.randomBytes(3).toString("hex");
		const hashed_id = await bcrypt.hash(driver_id, 10);
		const bus = await new Bus({ bus_id, driver_id: hashed_id, number_of_seat });

		const newBus = bus.save();
		const token = jwt.sign({ bus_id }, process.env.DRIVER_SECRET, {
			expiresIn: "1h",
		});
		return res
			.status(201)
			.json({ message: "Bus registered successfully", token, driver_id });
	} catch (error) {
		return res.json({ message: error.message });
	}
});
router.post("/officer/login", (req, res) => {
	try {
		const id = req.body.id;
		let token;
		if (id === process.env.TRANSPORT_OFFICER_SECRET) {
			token = jwt.sign({ id }, process.env.OFFICER_SECRET, {
				expiresIn: "5h",
			});
			return res.json({ token });
		}
		return res.sendStatus(401);
	} catch (error) {
		return res.json({ message: error.message });
	}
});
router.post("/driver/login", async (req, res) => {
	const { bus_id, driver_id } = req.body;
	try {
		const bus = await Bus.findOne({ bus_id });
		const verified = await bcrypt.compare(driver_id, bus.driver_id);
		if (verified) {
			const token = jwt.sign({ driver_id, bus_id }, process.env.DRIVER_SECRET, {
				expiresIn: "1h",
			});
			return res.status(201).json({ message: "Logged in successfully", token });
		}
		return res.sendStatus(403);
	} catch (error) {
		res.json({ message: error.message });
	}
});
router.post("/driver/status", authenticateDriver, async (req, res) => {
	const bus_id = req.data.bus_id;
	const available = req.body.available;
	const destination = req.body.destination;
	const departure_time = req.body.departure_time;
	try {
		const bus = await Bus.findOne({ bus_id });
		await bus.updateOne({
			available,
			destination,
			departure_time,
		});
		await bus.save();
		return res.sendStatus(200);
	} catch (error) {
		return res.json({ message: error.message });
	}
});

module.exports = router;
