const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const Bus = require("../models/transportUnit");
const authenticateUser = require("../auth/userAuth");
router.get("/", (req, res) => {
	res.send("testing user");
});
router.post("/register", async (req, res) => {
	// if (req.body.name == 0) {
	// 	return res.sendStatus(400);
	// }

	const { name, matric_number, email, password } = req.body;
	try {
		if (await User.findOne({ email })) {
			return res.sendStatus(400);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = {
			name,
			matric_number,
			email,
			password: hashedPassword,
		};
		const user = new User(newUser);
		await user.save();
		return res.sendStatus(201);
	} catch (error) {
		res.json({ message: error.message });
	}
});
router.post("/login", async (req, res) => {
	const { id, password } = req.body;
	let verified;
	let user;
	let token;
	try {
		if (await User.findOne({ email: id })) {
			user = await User.findOne({ email: id });
			verified = await bcrypt.compare(password, user.password);
		} else {
			user = await User.findOne({ matric_number: id });
			verified = await bcrypt.compare(password, user.password);
		}
		if (verified) {
			token = jwt.sign({ id: user._id }, process.env.USER_SECRET, {
				expiresIn: "5h",
			});
			return res.json(token);
		}
		return res.sendStatus(401);
	} catch (error) {
		res.json({ message: error.message });
	}
});
router.get("/bus", authenticateUser, async (req, res) => {
	try {
		const bus = await Bus.find();
		const availableBuses = bus.filter((item) => item.available);
		res.json(availableBuses);
	} catch (error) {
		res.json({ message: error.message });
	}
});
router.post("/book/:id", authenticateUser, async (req, res) => {
	const bus_id = req.params.id;
	try {
		const bus = await Bus.findOne({ bus_id });
		const code = crypto.randomBytes(2).toString("hex");
		const seat = bus.booked_seat.length + 1;
		bus.booked_seat.push({
			seat,
			code,
		});

		if (bus.booked_seat.length - 1 >= bus.number_of_seat) {
			await bus.updateOne({ available: false });
			return res.json({ message: "No more seats" });
		}
		await bus.save();
		return res.json({ bus_id, seat, code });
	} catch (error) {
		res.json({ message: error.message });
	}
});
module.exports = router;
