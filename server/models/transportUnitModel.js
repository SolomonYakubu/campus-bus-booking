const mongoose = require("mongoose");

const busSchema = mongoose.Schema({
	bus_id: {
		type: Number,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	destination: {
		type: String,
	},
	password: {
		type: String,
		unique: true,
	},
	available: {
		type: Boolean,
		default: false,
	},
	number_of_seat: Number,
	booked_seat: [
		{
			seat: Number,
			code: String,
			student_id: String,
			departure_time: Date,
		},
	],

	departure_time: {
		type: Date,
	},
});

module.exports = mongoose.model("Bus", busSchema);
