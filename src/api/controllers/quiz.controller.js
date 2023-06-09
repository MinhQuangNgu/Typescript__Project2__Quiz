const quizModel = require("../models/quiz.model");
const questionModel = require("../models/question.model");
const userModel = require("../models/user.model");
const client = require("../../config/redis.config");
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
		client.DEL("quizs");
		return res.status(200).json({ msg: "Tạo mới quiz thành công." });
	},
	getQuiz: async (req, res) => {
		const { id } = req.params;
		const data = await client.get(id);
		if (data) {
			return res.status(200).json({ quizs: JSON.parse(data) });
		}
		const quizs = await quizModel.findById(id).populate({
			path: "questions",
			select: "-updatedAt",
		});
		client.set(id, JSON.stringify(quizs));
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
		client.DEL("quizs");
		client.DEL(id);
		return res.status(200).json({
			msg: "Xóa thành công.",
		});
	},
	updateQuiz: async (req, res) => {
		const { id } = req.params;
		const { name, image } = req.body;
		const oldQuiz = await quizModel.findById(id);
		if (!oldQuiz) {
			return;
		}
		await quizModel.findByIdAndUpdate(id, {
			name: name,
			image: image,
		});
		client.DEL("quizs");
		client.DEL(id);
		return res.status(200).json({ msg: "Cật nhật thành công." });
	},
	getAll: async (_, res) => {
		const data = await client.get("quizs");
		if (data) {
			return res.status(200).json({ quiz: JSON.parse(data) });
		}
		const quiz = await quizModel
			.find()
			.select("-createdAt -updatedAt -__v")
			.populate({
				path: "questions",
				select: "-updatedAt -__v -createdAt",
			});
		client.set("quizs", JSON.stringify(quiz));
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
		client.DEL("quizs");
		client.DEL(id);
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
			answers: question.answers,
			name: question.name,
			image: question.image,
			correctAnswer: question.correctAnswer,
		});
		client.DEL("quizs");
		client.DEL(id);
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
		client.DEL("quizs");
		client.DEL(id);
		return res.status(200).json({ msg: "Xóa thành công." });
	},
	createNewQuestion: async (req, res) => {
		const { id } = req.params;
		const { question } = req.body;
		const quiz = await quizModel.findById(id);
		if (!quiz) {
			return res.status(400).json({ msg: "Không tìm thấy" });
		}
		const newQuesion = new questionModel({
			answers: question.answers,
			name: question.name,
			image: question.image,
			correctAnswer: question.correctAnswer,
		});
		await newQuesion.save();
		quiz.questions.push(newQuesion._id);
		await quizModel.findByIdAndUpdate(id, {
			questions: quiz.questions,
		});
		client.DEL("quizs");
		client.DEL(id);
		return res.status(200).json({ msg: "Cập nhật thành công." });
	},
	takeQuiz: async (req, res) => {
		const { id, result, time } = req.body;
		const user = req.user;
		const oldUser = await userModel.findById(user.id);
		const quiz = await quizModel.findById(id);
		if (!oldUser) {
			return res.status(400).json({ msg: "Vui lòng đăng nhập" });
		}
		if (!quiz) {
			return res
				.status(400)
				.json({ msg: "Xin lỗi nhưng quiz này không còn tồn tại nữa." });
		}
		oldUser.histories.unshift({
			quiz: quiz._id,
			result,
			time,
		});
		await userModel.findByIdAndUpdate(user.id, {
			histories: oldUser.histories,
		});
		client.DEL(user.id);
		return res.status(200).json({ msg: "Làm quiz thành công." });
	},
	getResultQuiz: async (req, res) => {
		const user = req.user;
		const data = await client.get(user.id);
		if (data) {
			return res.status(200).json({ histories: JSON.parse(data) });
		}
		const oldUser = await userModel.findById(user.id).populate({
			path: "histories.quiz",
			select: "name image _id",
		});
		if (!oldUser) {
			return res.status(400).json({ msg: "Vui lòng đăng nhập" });
		}
		client.set(user.id, JSON.stringify(oldUser.histories));
		return res.status(200).json({
			histories: oldUser.histories,
		});
	},
};
