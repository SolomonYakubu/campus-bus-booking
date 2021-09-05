const mongoose = require("mongoose");

const busSchema = mongoose.Schema({
	bus_id: {
		type: Number,
		required: true,
	},
	driver_id: {
		type: String,
		unique: true,
	},
	status: {
		type: Boolean,
		default: false,
	},
	number_of_seat: Number,
	booked_seat: [],
	destination: String, //HtoC or CtoH
});

module.exports = mongoose.model("Bus", busSchema);
