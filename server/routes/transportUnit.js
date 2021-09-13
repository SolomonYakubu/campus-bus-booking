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
	const { bus_id, number_of_seat, password, username } = req.body;

	try {
		if ((await Bus.findOne({ bus_id })) || (await Bus.findOne({ username }))) {
			return res.sendStatus(400);
		}
		// const driver_id = await crypto.randomBytes(3).toString("hex");
		const hashedPassword = await bcrypt.hash(password, 10);
		const bus = await new Bus({
			bus_id,
			password: hashedPassword,
			number_of_seat,
			username,
		});

		const newBus = bus.save();
		return res.status(201).json({ message: "Bus registered successfully" });
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
	const { username, password } = req.body;
	try {
		const bus = await Bus.findOne({ username: username.toLowerCase() });
		const verified = await bcrypt.compare(password, bus.password);
		if (verified) {
			const token = jwt.sign({ id: bus._id }, process.env.DRIVER_SECRET, {
				expiresIn: "1h",
			});
			return res.status(200).json({ token });
		}
		return res.sendStatus(400);
	} catch (error) {
		res.json({ message: error.message });
	}
});
router.post("/driver/status", authenticateDriver, async (req, res) => {
	const bus_id = req.data.id;
	// const available = req.body.available;
	const destination = req.body.destination;
	const departure_time = req.body.departure_time;
	if (!destination || !departure_time) {
		res.sendStatus(400);
	}
	try {
		const bus = await Bus.findById(bus_id);
		if (bus.available) {
			return res.sendStatus(400);
		}
		await bus.updateOne({
			available: true,
			destination,
			departure_time,
			booked_seat: [],
		});
		await bus.save();
		return res.sendStatus(201);
	} catch (error) {
		return res.json({ message: error.message });
	}
});
router.post("/ticket/verify/:code", authenticateDriver, async (req, res) => {
	const code = req.params.code;
	try {
		const bus = await Bus.findById(req.data.id);
		const verified = bus.booked_seat.filter((item) => item.code == code);
		// return res.json(verified);
		if (verified != 0) {
			return res.json(verified[0]);
		}
		return res.status(404).json({ message: "Not Found" });
	} catch (error) {
		return res.json({ message: error.message });
	}
});

module.exports = router;
