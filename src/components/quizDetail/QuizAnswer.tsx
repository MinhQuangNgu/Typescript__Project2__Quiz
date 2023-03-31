import React from "react";
interface props {
	item: string;
	setAnswer: React.Dispatch<React.SetStateAction<string | null>>;
	answer: string | null;
	correct: string;
	index: number;
}
const QuizAnswer: React.FC<props> = ({
	index,
	item,
	setAnswer,
	answer,
	correct,
}) => {
	return (
		<div
			onClick={() => {
				setAnswer(item);
			}}
			className="quiz__answer__container"
		>
			<label
				className={`quiz__answer__items item_${index} ${
					answer ? (item === correct ? "success" : "error") : ""
				}`}
			>
				{item}
			</label>
		</div>
	);
};

export default QuizAnswer;
