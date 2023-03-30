import React, { useRef, useState } from "react";
import "./style.scss";
import { Draggable, Droppable } from "react-beautiful-dnd";
interface props {
	create: boolean;
	setCreate: React.Dispatch<React.SetStateAction<boolean>>;
}
const Create: React.FC<props> = ({ create, setCreate }) => {
	//quiz
	const [image, setImage] = useState<string>();
	const [name, setName] = useState<string>("");
	const nameRef = useRef<HTMLTextAreaElement>(null);
	const fileRef = useRef<ProgressEvent<FileReader>>();
	//endquiz

	//question
	const [quesionImg, setQuesitionImg] = useState<string>();
	const fileQuestionRef = useRef<ProgressEvent<FileReader>>();
	const nameQuestionRef = useRef<HTMLTextAreaElement>(null);
	const answerARef = useRef<HTMLTextAreaElement>(null);
	const answerBRef = useRef<HTMLTextAreaElement>(null);
	const answerCRef = useRef<HTMLTextAreaElement>(null);
	const answerDRef = useRef<HTMLTextAreaElement>(null);
	//endquestion
	const handleGetFile = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: string
	): void => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target?.files[0];
			const reader = new FileReader();
			reader.onload = (event) => {
				if (type === "quiz") {
					fileRef.current = event;
					setImage(event.target?.result?.toString());
				} else {
					fileQuestionRef.current = event;
					setQuesitionImg(event.target?.result?.toString());
				}
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
			console.log(type);
			if (type === "quiz") {
				fileRef.current = event;
				setImage(event.target?.result?.toString());
			} else {
				fileQuestionRef.current = event;
				setQuesitionImg(event.target?.result?.toString());
			}
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

	const handleTest = (): void => {
		setName(nameRef.current?.value || "");
	};

	const createNewQuestion = (): void => {};
	return (
		<div className="create">
			<div className="create__container">
				<div className="create__title">
					<i>Tạo mới</i>
				</div>
				<div className="create__quiz">
					<div style={{ width: "100%" }} className="quizCard__admin">
						<div className="quizCard__wrap">
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
							<div
								style={{ borderTop: "0.1rem solid rgba(0, 0, 0, 0.1)" }}
								className="quizCard__name"
							>
								<div className="quizCard__name-elips">
									<i>{name}</i>
								</div>
							</div>
						</div>
						<div className="input__text">
							<textarea ref={nameRef} placeholder="Enter Name of this quiz" />
						</div>
						<div className="input__create__button">
							<button className="btn btn-default">Tạo mới</button>
							<button onClick={handleTest} className="btn btn-default">
								Test thử name
							</button>
						</div>
					</div>
				</div>
				<div className="create__question">
					<div className="question__card__input">
						<div className="quizCard__input__question">
							<div>
								<label
									onDrop={(e) => handleDrop(e, "question")}
									onDragOver={handleDragOver}
									onDragEnter={handleDragEnter}
									className="quizCard__label"
									htmlFor="inputQuestion"
								></label>
								<input
									accept="image/*"
									onChange={(e) => handleGetFile(e, "question")}
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
							<div className="question__card_answer">
								<div className="question__quiz__answer__container">
									<div className="question__quiz__answer__items no__transform">
										<div className="text__area__input">
											<textarea ref={answerARef} placeholder="Đáp án A" />
										</div>
									</div>
								</div>
								<div className="question__quiz__answer__container">
									<div
										style={{
											backgroundImage: "linear-gradient(0, green, green)",
											color: "white",
										}}
										className="question__quiz__answer__items no__transform"
									>
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
				</div>
				<div className="cancel">
					<div
						onClick={() => {
							setCreate(false);
						}}
					>
						&times;
					</div>
				</div>
			</div>
		</div>
	);
};

export default Create;
