const mongoose = require("mongoose");
const redis = require("redis");
const cloudinary = require("cloudinary").v2;
module.exports = {
	mongoDB: () => {
		mongoose
			.connect(process.env.MONGOOSE_URL, {
				useNewUrlParser: true,
			})
			.then((res) => {
				console.log("Connected to database");
			})
			.catch((err) => {
				console.log("Database erorr ", err);
			});
	},
	redisDB: () => {
		const client = redis.createClient({
			url: process.env.REDIS_URL,
		});
		client.on("connect", () => {
			console.log("Connected redis");
		});
		client.on("error", (err) => {
			console.log(`Redis error ${err}`);
		});
		return client;
	},
	cloudinaryConfig: () => {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SERCET,
		});
	},
};
