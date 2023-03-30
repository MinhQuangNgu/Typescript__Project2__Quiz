const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./api/routes/index");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const config = require("./config/database.config");
config.mongoDB();
config.redisDB().connect();

router(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`You are connecting in port :${PORT}`);
});
