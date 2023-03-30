const mongoose = require("mongoose");
const schema = mongoose.Schema;

const questionModel = new schema(
	{
		name: {
			type: String,
		},
		answers: {
			type: [],
			default: [],
		},
		correctAnswer: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model("questions", questionModel);
