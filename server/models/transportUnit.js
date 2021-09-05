const mongoose = require("mongoose");

const busSchema = mongoose.Schema({
	bus_id: {
		type: Number,
		required: true,
	},
	destination: {
		type: String,
	},
	driver_id: {
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
		},
	],

	departure_time: {
		type: Date,
	},
});

module.exports = mongoose.model("Bus", busSchema);
