const router = require("express").Router();
const quizController = require("../controllers/quiz.controller");
const middleWare = require("../middleWare");

router.get("/", quizController.getAll);
router.get("/:id", quizController.getQuiz);
router.post(
	"/update_question/:id",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.updateListQuestion
);
router.post(
	"/update_question_item/:id",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.updateQuestion
);
router.post(
	"/create",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.createNewQuiz
);
router.post(
	"/create_question/:id",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.createNewQuestion
);
router.delete(
	"/delete/:id",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.deleteQuiz
);
router.delete(
	"/delete_question/:id/:quizId",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.deleteQuestion
);
router.put(
	"/update/:id",
	middleWare.verifyToken,
	middleWare.verifyAdmin,
	quizController.updateQuiz
);

module.exports = router;
