import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface props {
	index: number;
}
const Question: React.FC<props> = ({ index }) => {
	return (
		<Draggable index={index} draggableId={index.toString() + "question"}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					className="question__card"
				>
					<div className="question__card__img">
						<img
							src="https://antimatter.vn/wp-content/uploads/2022/05/background-dep-hoang-hon.jpg"
							alt="anh"
						/>
					</div>
					<div className="question__card_information">
						<div className="question__card_name">
							<i>
								Hello anh quang Hello anh quang Hello anh quang Hello anh quang
							</i>
						</div>
						<div className="question__card_answer">
							<div className="question__quiz__answer__container">
								<div className="question__quiz__answer__items">
									Quang Ngu Quang Ngu Quang Ngu Quang NguNguasdasdassa
								</div>
							</div>
							<div className="question__quiz__answer__container">
								<div
									style={{
										backgroundImage: "linear-gradient(0, green, green)",
										color: "white",
									}}
									className="question__quiz__answer__items"
								>
									Quang Ngu
								</div>
							</div>
							<div className="question__quiz__answer__container">
								<div className="question__quiz__answer__items">Quang Ngu</div>
							</div>
							<div className="question__quiz__answer__container">
								<div className="question__quiz__answer__items">Quang Ngu</div>
							</div>
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
