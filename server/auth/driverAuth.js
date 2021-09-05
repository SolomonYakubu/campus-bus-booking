const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticateDriver = async (req, res, next) => {
	if (!req.headers["authorization"]) {
		return res.json({ message: "undefined" });
	}
	const authHeader = req.headers["authorization"].split(" ")[1];
	try {
		if (!authHeader) {
			return res.json({ message: "undefined" });
		}
		const token = await jwt.verify(authHeader, process.env.DRIVER_SECRET);
		req.data = token;
		next();
	} catch (err) {
		res.status(401).json({ message: "Unauthorized" });
	}
};
module.exports = authenticateDriver;
