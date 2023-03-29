const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const config = require("../../config/jwt.config");
module.exports = {
	login: async (req, res) => {
		const { email, password } = req.body;
		const user = await userModel.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ msg: "Tài khoản hoặc mật khẩu không chính xác" });
		}
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res
				.status(400)
				.json({ msg: "Tài khoản hoặc mật khẩu không chính xác" });
		}
		const token = config.getAccessToken(user);
		return res.status(200).json({
			token: token,
			name: user.name,
			image: user.image,
			msg: "Đăng nhập thành công.",
		});
	},
	register: async (req, res) => {
		const { email, password, name } = req.body;
		const user = await userModel.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: "Tài khoản đã tồn tại." });
		}
		const hashPassword = await bcrypt.hash(password, 12);

		const newUser = new userModel({
			name,
			email,
			password: hashPassword,
		});
		await newUser.save();
		return res.status(200).json({
			msg: "Đăng ký thành công.",
		});
	},
	forgotPassword: async (req, res) => {
		const { email } = req.body;
		const user = await userModel.findOne({ email });
		const hashPassword = await bcrypt.hash("12345678", 12);
		if (user) {
			await userModel.findByIdAndUpdate(
				{ email },
				{
					password: hashPassword,
				}
			);
		}
		return res.status(200).json({
			msg: "Mật khẩu của bạn là 12345678",
		});
	},
};
