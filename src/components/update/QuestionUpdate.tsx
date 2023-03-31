import React, { useRef, useState } from "react";
import "./style.scss";
import { Draggable, Droppable } from "react-beautiful-dnd";
const QuestionUpdate: React.FC = () => {
	const fileRef = useRef<File>();
	const [image, setImage] = useState<string>();
	const [correctAnswer, setCorrectAnswer] = useState<number>(0);
	const handleGetFile = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: string
	): void => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target?.files[0];
			const reader = new FileReader();
			reader.onload = (event) => {
				fileRef.current = file;
				setImage(event.target?.result?.toString());
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDrop = (
		e: React.DragEvent<HTMLLabelElement>,
		type: string
	): void => {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		const reader = new FileReader();

		reader.onload = (event) => {
			fileRef.current = file;
			setImage(event.target?.result?.toString());
		};

		reader.readAsDataURL(file);
	};
	const handleDragOver = (e: any): void => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragEnter = (e: any): void => {
		e.preventDefault();
		e.stopPropagation();
	};
	return (
		<div className="question__update__wrap">
			<div className="d-flex question__update_cancel">
				<div>&times;</div>
			</div>
			<div className="question__update__infor">
				<div className="question__update-name">
					<textarea placeholder="Chiến tranh thế giới thứ nhất bắt đầu khi nào?" />
				</div>
				<div className="question__update__infor-wrap">
					<div className="question__update-img">
						<div className="quizCard__input">
							<div>
								<label
									onDrop={(e) => handleDrop(e, "quiz")}
									onDragOver={handleDragOver}
									onDragEnter={handleDragEnter}
									className="quizCard__label"
									htmlFor="inputFile"
								></label>
								<input
									accept="image/*"
									onChange={(e) => handleGetFile(e, "quiz")}
									hidden
									id="inputFile"
									type="file"
								/>
							</div>
						</div>
						<div
							style={{ border: "0.1rem solid rgba(0, 0, 0, 0.4)" }}
							className="quizCard__image"
						>
							<img src={image} alt="Quiz Image" />
						</div>
					</div>
					<div className="question__update-answers">
						<div style={{ marginBottom: "1rem" }} className="d-flex center-h">
							<div className="radio__input">
								<label htmlFor="A">A</label>
								<input
									defaultChecked
									id="A"
									type="radio"
									name="correctAnswer"
									onChange={(e) => {
										if (e.target.checked) {
											setCorrectAnswer(0);
										}
									}}
								/>
							</div>
							<div className="radio__input">
								<label htmlFor="B">B</label>
								<input
									onChange={(e) => {
										if (e.target.checked) {
											setCorrectAnswer(1);
										}
									}}
									id="B"
									type="radio"
									name="correctAnswer"
								/>
							</div>
							<div className="radio__input">
								<label htmlFor="C">C</label>
								<input
									onChange={(e) => {
										if (e.target.checked) {
											setCorrectAnswer(2);
										}
									}}
									id="C"
									type="radio"
									name="correctAnswer"
								/>
							</div>
							<div className="radio__input">
								<label htmlFor="D">D</label>
								<input
									onChange={(e) => {
										if (e.target.checked) {
											setCorrectAnswer(3);
										}
									}}
									id="D"
									type="radio"
									name="correctAnswer"
								/>
							</div>
						</div>
						<Droppable droppableId="answers">
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									{["A", "B", "C", "D"].map((_, index) => (
										<Draggable key={_} index={index} draggableId={_}>
											{(item) => (
												<div
													ref={item.innerRef}
													{...item.dragHandleProps}
													{...item.draggableProps}
													style={{ width: "100%" }}
													className="question__quiz__answer__container"
												>
													<div className="question__quiz__answer__items no__transform">
														<div className="text__area__input">
															<textarea placeholder={`Đáp án ${_}`} />
														</div>
													</div>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				</div>
				<div className="question__update-button">
					<button className="btn btn-default">Create</button>
					<button
						style={{ marginLeft: "1rem", backgroundColor: "grey" }}
						className="btn btn-default"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuestionUpdate;
