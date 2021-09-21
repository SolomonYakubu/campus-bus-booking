const jwt = require("jsonwebtoken");
const jwtToken = async (data, signature) => {
	return jwt.sign(data, signature, {
		expiresIn: "1h",
	});
};

module.exports = jwtToken;
