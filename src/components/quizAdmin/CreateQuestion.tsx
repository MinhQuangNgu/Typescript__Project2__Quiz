import React, { useState, useRef } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { ErrorLogin } from "../../model";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/store";
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

	const { search } = useLocation();
	const auth = useAppSelector((state) => state.auth);

	const createNewQuestion = async (): Promise<void> => {
		const id = new URLSearchParams(search).get("id") || "";
		if (!id) {
			return;
		}
		const answer = [
			answerARef.current?.value || "",
			answerBRef.current?.value || "",
			answerCRef.current?.value || "",
			answerDRef.current?.value || "",
		];
		const question = {
			name: nameQuestionRef.current?.value,
			correctAnswer: answer[correctAnswer],
			answers: answer,
			image: "",
		};
		if (!question.name || !fileQuestionRef.current) {
			window.alert("Vui lòng nhập tên và ảnh");
			return;
		}
		question?.answers?.forEach((item) => {
			if (!item) {
				window.alert("Vui lòng nhập đáp án");
				return;
			}
		});
		try {
			let img = "";
			const formData = new FormData();
			formData.append("file", fileQuestionRef.current as File);
			formData.append("upload_preset", "pet7chaa");
			const da = await axios.post(
				"https://api.cloudinary.com/v1_1/dgn9bcr5s/image/upload",
				formData
			);
			const result = da;
			if (result.status === 200) {
				img = "https://" + result.data?.url?.toString()?.split("http://")[1];
			}
			question.image = img;
			const url = `/v1/quiz/create_question/${id}`;
			const data = await axios.post(
				url,
				{ question },
				{
					headers: {
						token: `Bearer ${auth.user?.token}`,
					},
				}
			);
			toast.success(data?.data?.msg);
			if (answerARef.current) {
				answerARef.current.value = "";
			}
			if (answerBRef.current) {
				answerBRef.current.value = "";
			}
			if (answerCRef.current) {
				answerCRef.current.value = "";
			}
			if (answerDRef.current) {
				answerDRef.current.value = "";
			}
			if (nameQuestionRef.current) {
				nameQuestionRef.current.value = "";
			}
			fileQuestionRef.current = undefined;
			setQuesitionImg("");
		} catch (error) {
			const err = error as AxiosError<ErrorLogin>;
			toast.error(err?.response?.data?.msg);
		}
	};
	return (
		<div className="question__card__input">
			<div
				style={{ borderRight: "0.1rem solid rgba(0,0,0,0.2)" }}
				className="quizCard__input__question"
			>
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
			<div className="question__card__img">
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
