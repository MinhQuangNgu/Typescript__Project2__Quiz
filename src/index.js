const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./api/routes/index");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
const url = "https://quangquiz.netlify.app";
app.use(
	cors({
		origin: url,
	})
);
dotenv.config();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
const config = require("./config/database.config");
config.mongoDB();
config.cloudinaryConfig();
router(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`You are connecting in port :${PORT}`);
});
