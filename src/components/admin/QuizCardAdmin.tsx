import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { quiz } from "../../model";

interface props {
	index: number;
	item: quiz;
	number: number;
	setNumber: React.Dispatch<React.SetStateAction<number>>;
}
const QuizCardAdmin: React.FC<props> = ({ index, item, number, setNumber }) => {
	const handleChoose = () => {
		setNumber(index);
	};
	const handleUpdate = () => {
		console.log("Updateing");
	};
	return (
		<Draggable index={index} draggableId={index.toString() + item?._id}>
			{(provided) => (
				<div
					onClick={handleChoose}
					onDoubleClick={handleUpdate}
					style={{ width: "100%" }}
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					ref={provided.innerRef}
					className="quizCard__admin"
				>
					<div className="quizCard__wrap">
						<div className="quizCard__image">
							<img src={item?.image} alt="Quiz Image" />
						</div>
						<div className="quizCard__name">
							<div className="quizCard__name-elips">
								<i>{item?.name}</i>
							</div>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
};

export default QuizCardAdmin;
