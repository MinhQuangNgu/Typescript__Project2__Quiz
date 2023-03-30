const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "user",
		},
		image: {
			type: String,
			default:
				"https://res.cloudinary.com/sttruyen/image/upload/v1679824074/oabahznlsy5dvjn11mka.jpg",
		},
		name: {
			type: String,
			required: true,
		},
		histories: [
			{
				type: {
					type: mongoose.Types.ObjectId,
					ref: "quizzes",
				},
				point: {
					type: Number,
					default: 0,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);
userSchema.index({ name: "text", email: "text" });
const userModel = mongoose.model("Accounts", userSchema);
userModel.createIndexes({ name: "text", email: "text" });
module.exports = userModel;
