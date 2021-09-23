const jwtToken = require("../functions/jwt");
const {
	adminPin,
	adminSecretKey,
	driverSecretKey,
} = require("../config/config");
const Bus = require("../models/transportUnitModel");
const User = require("../models/userModel");
var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * @desc  Register a bus and driver
 * @route POST /bus/register
 * @access Private/Admin
 */

const registerBus = async (req, res) => {
	const { bus_id, number_of_seat, password, username } = req.body;

	try {
		if ((await Bus.findOne({ bus_id })) || (await Bus.findOne({ username }))) {
			return res.sendStatus(400);
		}
		const bus = await new Bus({
			bus_id,
			password,
			number_of_seat,
			username,
		});

		await bus.save();
		return res.status(201).json({ message: "Bus registered successfully" });
	} catch (error) {
		return res.json({ message: error.message });
	}
};

/**
 * @desc  login to admin's acccount
 * @route POST /bus/admin/login
 * @access Public
 */
const adminLogin = async (req, res) => {
	try {
		const pin = req.body.pin;

		if (pin === adminPin) {
			const token = await jwtToken({ pin }, adminSecretKey);
			return res.json(token);
		}
		return res.sendStatus(400);
	} catch (error) {
		return res.json({ message: error.message });
	}
};

/**
 * @desc  Login to drivers account
 * @route POST /bus/driver/login
 * @access Public
 */
const driverLogin = async (req, res) => {
	const { username, password } = req.body;
	try {
		const bus = await Bus.findOne({ username: username.toLowerCase() });
		if (bus && (await bus.matchPassword(password))) {
			const token = await jwtToken({ id: bus._id }, driverSecretKey);

			return res.status(200).json({ token, bus_id: bus.bus_id });
		}
		return res.sendStatus(400);
	} catch (error) {
		res.sendStatus(400);
	}
};

/**
 * @desc  create  new trip and set driver status
 * @route POST /bus/driver/status
 * @access Private/Driver
 */
const setDriverStatus = async (req, res) => {
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
};

/**
 * @desc  Verify generated ticket
 * @route POST /bus/ticket/verify/:code
 * @access Private
 */
const verifyTicket = async (req, res) => {
	const code = req.params.code;
	try {
		const bus = await Bus.findById(req.data.id);
		const verified = bus.booked_seat.filter((item) => item.code == code);
		// return res.json(verified);
		if (verified != 0) {
			const user = await User.findById(verified[0].student_id);
			return res.json({
				seat: verified[0].seat,
				code: verified[0].code,
				matric_number: user.matric_number,
				destination: bus.destination,
				departure_time: dayjs(bus.departure_time)
					.tz("Africa/Lagos")
					.format("hh:mm A"),
			});
		}
		return res.status(404).json({ message: "Not Found" });
	} catch (error) {
		return res.json({ message: error.message });
	}
};

module.exports = {
	registerBus,
	adminLogin,
	driverLogin,
	setDriverStatus,
	verifyTicket,
};
