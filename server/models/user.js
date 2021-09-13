const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	matric_number: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	history: {
		type: Array,
	},
	password: {
		type: String,
		required: true,
	},
	wallet: {
		type: Number,
		default: 0,
	},
	booked: {
		hostel: {
			bus_id: Number,
			departure_time: Date,
			destination: {
				type: String,
				default: "Hostel",
			},
		},
		campus: {
			bus_id: Number,
			departure_time: Date,
			destination: {
				type: String,
				default: "Campus",
			},
		},
	},
});

module.exports = mongoose.model("User", userSchema);
