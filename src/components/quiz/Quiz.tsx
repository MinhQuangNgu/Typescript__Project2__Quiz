import React from "react";
import QuizCard from "../card/QuizCard";

const Quiz: React.FC = () => {
	return (
		<div className="quiz">
			<QuizCard />
			<QuizCard />
			<QuizCard />
			<QuizCard />
			<QuizCard />
		</div>
	);
};

export default Quiz;
