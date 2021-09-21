const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

busSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

busSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("Bus", busSchema);
