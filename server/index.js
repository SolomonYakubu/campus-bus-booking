const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const busRoutes = require("./routes/transportUnit");
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

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/bus", busRoutes);
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));
