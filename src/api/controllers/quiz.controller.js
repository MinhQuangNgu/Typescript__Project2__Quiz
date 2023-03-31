const quizModel = require("../models/quiz.model");
const questionModel = require("../models/question.model");

module.exports = {
	createNewQuiz: async (req, res) => {
		const { quiz } = req.body;
		const ques = [];
		for (const item of quiz.questions) {
			const quesion = new questionModel({
				answers: item.answers,
				name: item.name,
				image: item.image,
				correctAnswer: item.correctAnswer,
			});
			ques.push(quesion._id);
			await quesion.save();
		}
		const quizNew = new quizModel({
			questions: ques,
			name: quiz.name,
			image: quiz.image,
		});
		await quizNew.save();
		return res.status(200).json({ msg: "Tạo mới quiz thành công." });
	},
	getQuiz: async (req, res) => {
		const { id } = req.params;
		const quizs = await quizModel.findById(id).populate({
			path: "questions",
			select: "-updatedAt",
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
	getAll: async (_, res) => {
		const quiz = await quizModel
			.find()
			.select("-createdAt -updatedAt -__v")
			.populate({
				path: "questions",
				select: "-updatedAt -__v -createdAt",
			});
		return res.status(200).json({ quiz });
	},
	updateListQuestion: async (req, res) => {
		const { id } = req.params;
		const { questions } = req.body;
		const quiz = await quizModel.findById(id);
		if (!quiz) {
			return res.status(400).json({ msg: "Không tìm thấy" });
		}
		await quizModel.findByIdAndUpdate(id, {
			questions: questions,
		});
		return res.status(200).json({ msg: "Cập nhật quiz thành công." });
	},
	updateQuestion: async (req, res) => {
		const { id } = req.params;
		const { question } = req.body;
		const questionOld = await questionModel.findById(id);
		if (!questionOld) {
			return res.status(400).json({ msg: "Không tồn tại." });
		}
		await questionModel.findByIdAndUpdate(id, {
			...question,
		});
		return res.status(200).json({ msg: "Cập nhật thành công." });
	},
	deleteQuestion: async (req, res) => {
		const { id, quizId } = req.params;
		const questionOld = await questionModel.findById(id);
		const quiz = await quizModel.findById(quizId);
		if (!questionOld || !quiz) {
			return res.status(400).json({ msg: "Không tồn tại." });
		}
		const questions = quiz.questions.filter(
			(item) => item?._id?.toString() !== id?.toString()
		);
		await quizModel.findByIdAndUpdate(quizId, {
			questions,
		});
		await questionModel.findByIdAndDelete(id);
		return res.status(200).json({ msg: "Xóa thành công." });
	},
};
