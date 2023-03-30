const quizModel = require("../models/quiz.model");
const questionModel = require("../models/question.model");

module.exports = {
	createNewQuiz: async (req, res) => {
		const { quiz } = req.body;
		const ques = [];
		console.log(quiz);
		// for (const item of questions) {
		// 	const quesion = new questionModel({
		// 		answers: item.answers,
		// 		name: item.name,
		// 		correctAnswer: item.correctAnswer,
		// 	});
		// 	ques.push(quesion._id);
		// 	await quesion.save();
		// }
		// const quiz = new quizModel({
		// 	questions: ques,
		// 	name: name,
		// });
		// await quiz.save();
		return res.status(200).json({ msg: "Tạo mới quiz thành công." });
	},
	getQuiz: async (req, res) => {
		const { id } = req.params;
		const quizs = await quizModel.findById(id).populate({
			path: "questions",
			select: "-createdAt -updatedAt",
		});
		return res.status(200).json({
			quizs,
		});
	},
	deleteQuiz: async (req, res) => {
		const { id } = req.params;
		const quiz = await quizModel.findById(id);
		if (!quiz) {
			return;
		}
		for (const item of quiz.questions) {
			await questionModel.findByIdAndDelete(item);
		}
		await quizModel.findByIdAndDelete(id);
		return res.status(200).json({
			msg: "Xóa thành công.",
		});
	},
	updateQuiz: async (req, res) => {
		const { id } = req.params;
		const { quiz } = req.body;
		const oldQuiz = await quizModel.findById(id);
		if (!oldQuiz) {
			return;
		}
		for (const item of quiz.questions) {
			await questionModel.findByIdAndUpdate(item, {
				...item,
			});
		}
		await quizModel.findByIdAndUpdate(id, {
			name: quiz.name,
		});
		return res.status(200).json({ msg: "Cật nhật thành công." });
	},
};
