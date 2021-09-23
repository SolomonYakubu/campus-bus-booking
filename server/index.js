require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const { mongoURI } = require("./config/config");
const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/transportUnitRoutes");

const mongoDBURI =
	process.env.NODE_ENV === "development"
		? "mongodb://localhost/bus-booking"
		: mongoURI;

mongoose.Promise = global.Promise;
mongoose
	.connect(mongoDBURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useFindAndModify: false,
		// useCreateIndex: true,
	})
	.then((res) => console.log(`connected to db!!!`))
	.catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/bus", busRoutes);
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));
