require("dotenv").config();
module.exports = {
	adminPin: process.env.ADMIN_PIN,
	driverSecretKey: process.env.DRIVER_SECRET,
	adminSecretKey: process.env.ADMIN_SECRET,
	userSecretKey: process.env.USER_SECRET,
};
