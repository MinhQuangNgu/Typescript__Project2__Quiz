const mongoose = require("mongoose");

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
};
