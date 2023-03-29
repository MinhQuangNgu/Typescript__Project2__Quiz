const router = require("express").Router();
const quizController = require("../controllers/quiz.controller");
const middleWare = require("../middleWare");
router.post(
	"/create",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.createNewQuiz
);
router.delete(
	"/delete/:id",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.deleteQuiz
);
router.put(
	"/update/:id",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.updateQuiz
);
router.get("/:id", quizController.getQuiz);

module.exports = router;
