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

module.exports = router;
