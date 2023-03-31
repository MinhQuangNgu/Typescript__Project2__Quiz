import React, { useRef, useState, useEffect } from "react";
import "./style.scss";

interface props {
	quizUpdate: {
		name: string;
		image: string;
	};
	setQuizUpdate: React.Dispatch<
		React.SetStateAction<{
			name: string;
			image: string;
		} | null>
	>;
}
const QuizUpdate: React.FC<props> = ({ quizUpdate, setQuizUpdate }) => {
	const fileRef = useRef<File>();
	const [image, setImage] = useState<string>();
	const [quiz, setQuiz] = useState<{
		name: string;
		image: string;
	}>();

	useEffect(() => {
		if (quizUpdate) {
			setQuiz(quizUpdate);
		}
	}, [quizUpdate]);

	useEffect(() => {
		if (quiz) {
			setImage(quiz.image);
		}
	}, [quiz]);

	const handleGetFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
	const handleDrop = (e: React.DragEvent<HTMLLabelElement>): void => {
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

	const handleUpdateQuiz = async (): Promise<void> => {
		try {
		} catch (err) {}
	};

	const handleDeleteQuiz = async (): Promise<void> => {
		try {
		} catch (err) {}
	};
	return (
		<div className="question__update__wrap">
			<div className="d-flex question__update_cancel">
				<div
					onClick={() => {
						setQuizUpdate(null);
					}}
				>
					&times;
				</div>
			</div>
			<div className="quiz__update">
				<div className="quiz__update__name">
					<textarea defaultValue={quiz?.name} placeholder="Tên quiz" />
				</div>
				<div className="quiz__update__img">
					<div className="quizCard__input">
						<div>
							<label
								onDrop={(e) => handleDrop(e)}
								onDragOver={handleDragOver}
								onDragEnter={handleDragEnter}
								className="quizCard__label"
								htmlFor="inputFile"
							></label>
							<input
								accept="image/*"
								onChange={(e) => handleGetFile(e)}
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
				<div style={{ marginTop: "2rem" }} className="quiz__update__name">
					<button onClick={handleUpdateQuiz} className="btn btn-default">
						Update
					</button>
					<button
						onClick={() => {
							setQuizUpdate(null);
						}}
						style={{ marginLeft: "1rem", backgroundColor: "grey" }}
						className="btn btn-default"
					>
						Cancel
					</button>
					<button
						onClick={handleDeleteQuiz}
						style={{ marginLeft: "1rem", backgroundColor: "red" }}
						className="btn btn-default"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuizUpdate;
