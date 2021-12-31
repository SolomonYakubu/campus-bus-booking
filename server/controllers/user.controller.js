const jwtToken = require("../functions/jwt");
const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/userModel");
const Bus = require("../models/transportUnitModel");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
const { userSecretKey, secretKey } = require("../config/config");
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * @desc  Get user info
 * @route GET /user/
 * @access Private
 */
const getUserInfo = async (req, res) => {
	try {
		const user = await User.findById(req.data.id);

		const data = {
			name: user.name,
			email: user.email,
			matric_number: user.matric_number,

			wallet: user.wallet,
		};

		return res.json(data);
	} catch (error) {
		return res.json({ message: error.message });
	}
};

/**
 * @desc  Register a new user
 * @route POST /user/register
 * @access Public
 */
const registerUser = async (req, res) => {
	const { name, matric_number, email, password } = req.body;
	try {
		if (await User.findOne({ email })) {
			return res.sendStatus(400);
		}
		if (await User.findOne({ matric_number })) {
			return res.sendStatus(400);
		}
		// const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = {
			name,
			matric_number,
			email,
			password,
		};
		const user = new User(newUser);
		await user.save();
		return res.sendStatus(201);
	} catch (error) {
		res.json({ message: error.message });
	}
};

/**
 * @desc  Login to account
 * @route POST /user/login
 * @access Public
 */
const loginUser = async (req, res) => {
	const { id, password } = req.body;
	let user;
	let token;
	try {
		if (await User.findOne({ email: id })) {
			user = await User.findOne({ email: id });
		} else {
			user = await User.findOne({ matric_number: id });
		}
		if (user && (await user.matchPassword(password))) {
			token = await jwtToken({ id: user._id }, userSecretKey);
			return res.json(token);
		}
		return res.sendStatus(400);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

/**
 * @desc  Filter out available buses by destination
 * @route GET /user/bus/:destination
 * @access Private
 */
const getBusesByDestination = async (req, res) => {
	const { destination } = req.params;

	try {
		let bus = await Bus.find();
		const user = await User.findById(req.data.id);
		const availableBuses = bus.filter(
			(item) =>
				dayjs(item.departure_time).tz("Africa/Lagos") >
				dayjs(dayjs().subtract(1, "minutes")).tz("Africa/Lagos")
		);

		if (destination == "Hostel") {
			if (
				dayjs(user.booked.hostel.departure_time).tz("Africa/Lagos") >
				dayjs(dayjs().subtract(7, "minutes")).tz("Africa/Lagos")
			) {
				const bus = await Bus.findOne({ bus_id: user.booked.hostel.bus_id });
				const ticket = bus.booked_seat.filter(
					(item) => item.student_id == req.data.id
				)[0];

				return res.json({ hostel: user.booked.hostel, ticket });
			}
		}
		if (destination == "Campus") {
			if (
				dayjs(user.booked.campus.departure_time).tz("Africa/Lagos") >
				dayjs(dayjs().subtract(7, "minutes")).tz("Africa/Lagos")
			) {
				const bus = await Bus.findOne({ bus_id: user.booked.campus.bus_id });
				const ticket = bus.booked_seat.filter(
					(item) => item.student_id == req.data.id
				)[0];

				return res.json({ campus: user.booked.campus, ticket });
			}
		}

		const availableBusesDestination = availableBuses.filter(
			(item) => item.destination == destination
		);
		res.json(
			availableBusesDestination.map((item) => ({
				bus_id: item.bus_id,
				departure_time: item.departure_time,
			}))
		);
		console.log(await bus.save());
	} catch (error) {
		res.json({ message: error.message });
	}
};

/**
 * @desc  Book a bus by bus ID
 * @route POST /user/book/:id
 * @access Private
 */
const bookBusById = async (req, res) => {
	const bus_id = req.params.id;
	const reference_id = req.body.reference_id;
	const chargeType = req.body.chargeType;
	const book = async () => {
		try {
			const bus = await Bus.findOne({ bus_id });
			const user = await User.findById(req.data.id);
			const code = crypto.randomBytes(2).toString("hex");
			const seat = bus.booked_seat.length + 1;
			const departure_time = bus.departure_time;
			const destination = bus.destination;
			bus.booked_seat.push({
				seat,
				code,
				student_id: req.data.id,
				departure_time,
				destination,
			});

			if (bus.booked_seat.length == bus.number_of_seat) {
				await bus.updateOne({ available: false });
				await bus.save();
				// return res.json({ bus_id, seat, code });
				// return res.json({ message: "No more seats" });
			}
			if (destination == "Hostel") {
				await user.updateOne({
					booked: {
						campus: user.booked.campus,
						hostel: {
							bus_id,
							departure_time,
						},
					},
				});
			}
			if (destination == "Campus") {
				await user.updateOne({
					booked: {
						hostel: user.booked.hostel,
						campus: {
							bus_id,
							departure_time,
						},
					},
				});
			}

			await bus.save();
			return res.json({ bus_id, seat, code, departure_time, destination });
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
						Authorization: `Bearer ${secretKey}`,
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
};

/**
 * @desc  Fund user wallet
 * @route POST /user/wallet/fund
 * @access Private
 */
const fundUserWallet = async (req, res) => {
	const { reference_id } = req.body;
	try {
		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${reference_id}`,
			{
				headers: {
					Authorization: `Bearer ${secretKey}`,
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
};
/**
 * @desc  Cancel a trip
 * @route POST /user/cancel-trip/:destination/:bus_id
 * @access Private
 */
const cancelTrip = async (req, res) => {
	const { destination, bus_id } = req.params;

	console.log(bus_id);
	try {
		const user = await User.findById(req.data.id);
		const bus = await Bus.findOne({ bus_id });
		console.log(bus);
		const runAction = () => {
			user.wallet += 50;
			for (let i = 0; i < bus.booked_seat.length; i++) {
				if (bus.booked_seat[i].student_id === req.data.id) {
					bus.booked_seat.splice(i, 1);
				}
			}
		};
		switch (destination) {
			case "hostel":
				user.booked.hostel = {
					departure_time: 0,
					destination: "Hostel",
					bus_id: 0,
				};

				runAction();
				break;
			case "campus":
				user.book.campus = {};
				runAction();

				break;
			default:
				return res.sendStatus(400);
		}
		await user.save();
		await bus.save();
		return res.sendStatus(200);
	} catch (error) {
		return res.json({ message: error.message });
	}
};
module.exports = {
	getUserInfo,
	registerUser,
	loginUser,
	getBusesByDestination,
	bookBusById,
	fundUserWallet,
	cancelTrip,
};
