const user = require("./user.router");
const quiz = require("./quiz.router");
function router(app) {
	app.use("/v1/auth", user);
	app.use("/v1/quiz", quiz);
}

module.exports = router;
