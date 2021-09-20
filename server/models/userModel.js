const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
