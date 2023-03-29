const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
module.exports = {
	verifyToken: (req, res, next) => {
		const token = req.headers.token;
		if (!token) {
			return res.status(400).json({
				msg: "Vui lòng đăng nhập",
			});
		}
		const realToken = token.split(" ")[1];
		if (!realToken) {
			return res.status(400).json({
				msg: "Vui lòng đăng nhập",
			});
		}
		jwt.verify(realToken, process.env.ACCESSTOKEN, async (err, infor) => {
			if (err) {
				return res.status(400).json({ msg: "Vui lòng đăng nhập or re-login" });
			}
			const user = await userModel.findById(infor.id);
			if (!user) {
				return res.status(400).json({ msg: "Vui lòng đăng nhập or re-login" });
			}
			req.user = user;
			next();
		});
	},
	verifyAdmin: (req, res, next) => {
		const user = req.user;
		if (user.role === "admin") {
			return next();
		}
		res.status(400).json({
			msg: "Bạn không có quyền truy cập vào đây.",
		});
	},
};
