import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface props {
	index: number;
	question: {
		answers: string[];
		correctAnswer: string;
		image: ProgressEvent<FileReader> | unknown;
		name: string;
		url: string;
	};
	[key: string]: any;
	type: string;
}
const Question: React.FC<props> = ({ index, question, type }) => {
	return (
		<Draggable index={index} draggableId={index.toString() + type}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					className="question__card"
				>
					<div className="question__card__img">
						<img src={question?.url} alt="anh" />
					</div>
					<div className="question__card_information">
						<div className="question__card_name">
							<i>{question?.name}</i>
						</div>
						<div className="question__card_answer">
							{question?.answers?.map((item, index) => (
								<div
									key={item + index}
									className="question__quiz__answer__container"
								>
									<div
										style={
											item === question?.correctAnswer
												? {
														backgroundImage: "linear-gradient(0, green, green)",
														color: "white",
												  }
												: {}
										}
										className="question__quiz__answer__items"
									>
										{item}
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="question__edit">
						<div className="question__edit_btn">
							<button className="btn btn-default button__edit">Update</button>
							<button className="btn btn-default button__edit_second">
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
};

export default Question;
