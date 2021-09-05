require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Bus = require("../models/transportUnit");
router.post("/register", async (req, res) => {
	const { bus_id } = req.body;
	try {
		const driver_id = await crypto.randomBytes(3).toString("hex");
		const bus = await new Bus({ bus_id, driver_id });

		const newBus = bus.save();
		const token = jwt.sign({ driver_id, bus_id }, process.env.TOKEN_SECRET, {
			expiresIn: "1h",
		});
		return res
			.status(201)
			.json({ message: "Bus registered successfully", token });
	} catch (error) {
		return res.json({ message: error.message });
	}
});
router.post("/driver/register", (req, res) => {});

module.exports = router;
