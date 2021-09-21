require("dotenv").config();
module.exports = {
	officerPin: process.env.OFFICER_PIN,
	driverSecretKey: process.env.DRIVER_SECRET,
	officerSecretKey: process.env.OFFICER_SECRET,
	userSecretKey: process.env.USER_SECRET,
};
