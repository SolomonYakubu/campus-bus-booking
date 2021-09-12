const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/user");
const Bus = require("../models/transportUnit");
const authenticateUser = require("../auth/userAuth");
const { resourceLimits } = require("worker_threads");

router.get("/", authenticateUser, async (req, res) => {
	try {
		const user = await User.findById(req.data.id);
		const bus = await Bus.find();
		const availableBuses = bus.filter(
			(item) => item.available && item.destination == "HtoC"
		);

		const data = {
			name: user.name,
			email: user.email,
			matric_number: user.matric_number,
			buses: availableBuses.map((item) => ({
				bus_id: item.bus_id,
				departure_time: item.departure_time,
			})),
			wallet: user.wallet,
		};

		return res.json(data);
	} catch (error) {
		return res.json({ message: error.message });
	}
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
		if (await User.findOne({ matric_number })) {
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
				expiresIn: "30m",
			});
			return res.json(token);
		}
		return res.sendStatus(400);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get("/bus/:destination", authenticateUser, async (req, res) => {
	const { destination } = req.params;
	try {
		const bus = await Bus.find();
		const availableBuses = bus.filter((item) => item.available);
		const availableBusesDestination = availableBuses.filter(
			(item) => item.destination == destination
		);
		res.json(
			availableBusesDestination.map((item) => ({
				bus_id: item.bus_id,
				departure_time: item.departure_time,
			}))
		);
	} catch (error) {
		res.json({ message: error.message });
	}
});
router.post("/book/:id", authenticateUser, async (req, res) => {
	const bus_id = req.params.id;
	const reference_id = req.body.reference_id;
	const chargeType = req.body.chargeType;
	const book = async () => {
		try {
			const bus = await Bus.findOne({ bus_id });
			const code = crypto.randomBytes(2).toString("hex");
			const seat = bus.booked_seat.length + 1;
			bus.booked_seat.push({
				seat,
				code,
			});

			if (bus.booked_seat.length == bus.number_of_seat) {
				await bus.updateOne({ available: false });
				await bus.save();
				// return res.json({ bus_id, seat, code });
				// return res.json({ message: "No more seats" });
			}
			await bus.save();
			return res.json({ bus_id, seat, code });
		} catch (error) {
			return res.json({ message: error.message });
		}
	};
	try {
		if (chargeType == "bank") {
			const response = await axios.get(
				`https://api.paystack.co/transaction/verify/${reference_id}`,
				{
					headers: {
						Authorization:
							"Bearer sk_test_f5a685bf870d1f2fb1ed21c6f02871d401ec24af",
					},
				}
			);
			const data = response.data.status;
			if (data) {
				book();
			}
		}
		if (chargeType == "wallet") {
			const user = await User.findById(req.data.id);
			if (user.wallet >= 50) {
				user.wallet -= 50;
				user.wallet = user.wallet.toFixed(2);
				user.save();
				book();
			} else {
				return res.sendStatus(406);
			}
		}
	} catch (error) {
		res.json({ message: error.message });
	}
});
router.post("/wallet/fund", authenticateUser, async (req, res) => {
	const { reference_id } = req.body;
	try {
		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${reference_id}`,
			{
				headers: {
					Authorization:
						"Bearer sk_test_f5a685bf870d1f2fb1ed21c6f02871d401ec24af",
				},
			}
		);
		const data = response.data;
		if (data.status) {
			const user = await User.findById(req.data.id);
			const newAmount = (+user.wallet + +(data.data.amount / 100)).toFixed(2);
			user.wallet = newAmount;
			user.save();
			res.json({ wallet: user.wallet });
		}
	} catch (error) {
		return res.json({ message: error.message });
	}
});
module.exports = router;
