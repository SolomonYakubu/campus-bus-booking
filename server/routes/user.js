const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.get("/", (req, res) => {
	res.send("testing user");
});
router.post("/register", async (req, res) => {
	// if (req.body.name == 0) {
	// 	return res.sendStatus(400);
	// }

	const { name, matric_number, email } = req.body;
	try {
		if (await User.findOne({ email })) {
			return res.sendStatus(400);
		}
		const newUser = {
			name,
			matric_number,
			email,
		};
		const user = new User(newUser);
		const newRegisteredUser = await user.save();
		return res.status(201).json(newRegisteredUser);
	} catch (error) {
		res.json({ message: error.message });
	}
});

module.exports = router;
