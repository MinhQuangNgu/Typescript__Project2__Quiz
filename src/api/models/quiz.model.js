const mongoose = require("mongoose");
const schema = mongoose.Schema;

const quizModel = new schema(
	{
		questions: {
			type: [
				{
					type: mongoose.Types.ObjectId,
					ref: "questions",
				},
			],
			default: [],
		},
		name: {
			type: String,
		},
		image: {
			type: String,
			default: "",
		},
		times: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("quizzes", quizModel);
