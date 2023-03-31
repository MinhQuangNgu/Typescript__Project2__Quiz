import React, { useState, useRef } from "react";
import "./style.scss";
const CreateQuestion = () => {
	const [quesionImg, setQuesitionImg] = useState<string>();
	const [correctAnswer, setCorrectAnswer] = useState<number>(0);
	const fileQuestionRef = useRef<File>();
	const nameQuestionRef = useRef<HTMLTextAreaElement>(null);
	const answerARef = useRef<HTMLTextAreaElement>(null);
	const answerBRef = useRef<HTMLTextAreaElement>(null);
	const answerCRef = useRef<HTMLTextAreaElement>(null);
	const answerDRef = useRef<HTMLTextAreaElement>(null);
	const handleGetFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target?.files[0];
			const reader = new FileReader();
			reader.onload = (event) => {
				fileQuestionRef.current = file;
				setQuesitionImg(event.target?.result?.toString());
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLLabelElement>): void => {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		const reader = new FileReader();

		reader.onload = (event) => {
			fileQuestionRef.current = file;
			setQuesitionImg(event.target?.result?.toString());
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

	const createNewQuestion = () => {};
	return (
		<div className="question__card__input">
			<div className="quizCard__input__question">
				<div>
					<label
						onDrop={(e) => handleDrop(e)}
						onDragOver={handleDragOver}
						onDragEnter={handleDragEnter}
						className="quizCard__label"
						htmlFor="inputQuestion"
					></label>
					<input
						accept="image/*"
						onChange={(e) => handleGetFile(e)}
						hidden
						id="inputQuestion"
						type="file"
					/>
				</div>
			</div>
			<div
				style={{ borderRight: "0.1rem solid rgba(0,0,0,0.2)" }}
				className="question__card__img"
			>
				<img src={quesionImg} alt="anh" />
			</div>
			<div className="question__card_information">
				<div className="question__card_name">
					<div className="question__input__name">
						<textarea ref={nameQuestionRef} placeholder="Tên câu hỏi" />
					</div>
				</div>
				<div className="d-flex center-h">
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
				<div className="question__card_answer">
					<div className="question__quiz__answer__container">
						<div className="question__quiz__answer__items no__transform">
							<div className="text__area__input">
								<textarea ref={answerARef} placeholder="Đáp án A" />
							</div>
						</div>
					</div>
					<div className="question__quiz__answer__container">
						<div className="question__quiz__answer__items no__transform">
							<div className="text__area__input">
								<textarea ref={answerBRef} placeholder="Đáp án B" />
							</div>
						</div>
					</div>
					<div className="question__quiz__answer__container">
						<div className="question__quiz__answer__items no__transform">
							<div className="text__area__input">
								<textarea ref={answerCRef} placeholder="Đáp án C" />
							</div>
						</div>
					</div>
					<div className="question__quiz__answer__container">
						<div className="question__quiz__answer__items no__transform">
							<div className="text__area__input">
								<textarea ref={answerDRef} placeholder="Đáp án D" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="question__edit">
				<div className="question__edit_btn">
					<button
						onClick={createNewQuestion}
						className="btn btn-default button__edit"
					>
						Tạo mới
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateQuestion;
