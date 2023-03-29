import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface props {
	index: number;
}
const QuizCardAdmin: React.FC<props> = ({ index }) => {
	const handleChoose = () => {
		console.log("Here");
	};
	return (
		<Draggable index={index} draggableId={index.toString()}>
			{(provided) => (
				<div
					onDoubleClick={handleChoose}
					style={{ width: "100%" }}
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					ref={provided.innerRef}
					className="quizCard__admin"
				>
					<div className="quizCard__wrap">
						<div className="quizCard__image">
							<img
								src="https://antimatter.vn/wp-content/uploads/2022/05/background-dep-1.jpg"
								alt="Quiz Image"
							/>
						</div>
						<div className="quizCard__name">
							<div className="quizCard__name-elips">
								<i>{index}</i>
							</div>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
};

export default QuizCardAdmin;
