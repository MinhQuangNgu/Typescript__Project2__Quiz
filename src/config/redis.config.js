const Redis = require("redis");
require("dotenv").config();
let redisClient = "";
(async () => {
	redisClient = Redis.createClient({
		url: process.env.REDIS_URL,
	});
	redisClient.on("error", (err) => console.error("Redis Client Error", err));
	redisClient.on("ready", function () {
		console.log("redis is running");
	});
	await redisClient.connect();
})();

module.exports = redisClient;
