const mongoose = require("mongoose");
const redis = require("redis");
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
			url: "redis://default:RcScKV39SVEBbNaKfinFwEMKp9Abwi94@redis-11661.c1.asia-northeast1-1.gce.cloud.redislabs.com:11661",
		});
		client.on("connect", () => {
			console.log("Connected redis");
		});
		client.on("error", (err) => {
			console.log(`Redis error ${err}`);
		});
		return client;
	},
};
