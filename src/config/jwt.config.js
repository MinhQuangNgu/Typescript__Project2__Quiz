const jwt = require("jsonwebtoken");
module.exports = {
	getAccessToken: (user) => {
		return jwt.sign(
			{ id: user._id, role: user.role },
			process.env.ACCESSTOKEN,
			{
				expiresIn: "30d",
			}
		);
	},
};
