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
	card_details: [
		{
			name: String,
			card_no: Number,
			cvv: Number,
			expiry: String,
		},
	],
	password: {
		type: String,
		required: true,
	},
	wallet: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("User", userSchema);
