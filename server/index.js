const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/transportUnitRoutes");
mongoose.Promise = global.Promise;
mongoose
	.connect("mongodb://localhost/bus-booking" || process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useFindAndModify: false,
		// useCreateIndex: true,
	})
	.then((res) => console.log(`connected to db!!!`))
	.catch((err) => console.log(err));
app.use(cors());

app.use(express.json());

app.use("/user", userRoutes);
app.use("/bus", busRoutes);
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));
