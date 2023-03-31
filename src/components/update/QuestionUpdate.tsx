import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import { ErrorLogin, question } from "../../model";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/store";

interface props {
	updateQuestion: {
		question: question;
		index: number;
	} | null;
	setUpdateQuesion: React.Dispatch<
		React.SetStateAction<{ question: question; index: number } | null>
	>;
	setQuizAfterUpdate: React.Dispatch<
		React.SetStateAction<
			| {
					question: question;
					index: number;
			  }
			| undefined
		>
	>;
}
const QuestionUpdate: React.FC<props> = ({
	updateQuestion,
	setUpdateQuesion,
	setQuizAfterUpdate,
}) => {
	const fileRef = useRef<File>();
	const [image, setImage] = useState<string>();
	const [item, setItem] = useState<{
		question: question;
		index: number;
	}>();
	const [correctAnswer, setCorrectAnswer] = useState<number>(0);

	//
	const answerARef = useRef<HTMLTextAreaElement>(null);
	const answerBRef = useRef<HTMLTextAreaElement>(null);
	const answerCRef = useRef<HTMLTextAreaElement>(null);
	const answerDRef = useRef<HTMLTextAreaElement>(null);

	//
	const correctARef = useRef<HTMLInputElement>(null);
	const correctBRef = useRef<HTMLInputElement>(null);
	const correctCRef = useRef<HTMLInputElement>(null);
	const correctDRef = useRef<HTMLInputElement>(null);

	//
	const nameRef = useRef<HTMLTextAreaElement>(null);
	//

	const auth = useAppSelector((state) => state.auth);
	//
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

	useEffect(() => {
		if (updateQuestion) {
			setItem(updateQuestion);
		}
	}, [updateQuestion]);

	useEffect(() => {
		if (item && item?.question?._id) {
			setImage(item?.question?.image as string);
		} else if (item) {
			setImage(item?.question?.url);
		}
	}, [item]);

	useEffect(() => {
		if (item) {
			switch (item?.question?.correctAnswer) {
				case item?.question?.answers[0]:
					if (correctARef.current) {
						correctARef.current.checked = true;
						setCorrectAnswer(0);
					}
					break;
				case item?.question?.answers[1]:
					if (correctBRef.current) {
						correctBRef.current.checked = true;
						setCorrectAnswer(1);
					}
					break;
				case item?.question?.answers[2]:
					if (correctCRef.current) {
						correctCRef.current.checked = true;
						setCorrectAnswer(2);
					}
					break;
				case item?.question?.answers[3]:
					if (correctDRef.current) {
						correctDRef.current.checked = true;
						setCorrectAnswer(3);
					}
					break;
			}
		}
	}, [item]);

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

	const handleUpdateQuestion = async (): Promise<void> => {
		if (!nameRef.current?.value) {
			toast.error("Vui lòng điền hết thông tin chỗ câu hỏi ấy.");
			return;
		}
		if (!answerARef.current?.value) {
			toast.error("Vui lòng điền hết thông tin chỗ câu trả lời A ấy.");
			return;
		}
		if (!answerBRef.current?.value) {
			toast.error("Vui lòng điền hết thông tin chỗ câu trả lời B ấy.");
			return;
		}
		if (!answerCRef.current?.value) {
			toast.error("Vui lòng điền hết thông tin chỗ câu trả lời C ấy.");
			return;
		}
		if (!answerDRef.current?.value) {
			toast.error("Vui lòng điền hết thông tin chỗ câu trả lời D ấy.");
			return;
		}
		if (!item?.question?._id) {
			const answer = [
				answerARef.current?.value || "",
				answerBRef.current?.value || "",
				answerCRef.current?.value || "",
				answerDRef.current?.value || "",
			];
			const question: question = {
				answers: answer,
				name: nameRef.current?.value || "",
				image: fileRef.current || item?.question?.image,
				correctAnswer: item?.question?.answers[correctAnswer] || "",
				url: fileRef.current ? image : item?.question?.url,
			};
			setQuizAfterUpdate({
				index: item?.index || 0,
				question,
			});
			setUpdateQuesion(null);
			return;
		}
		let img = item?.question?.image;
		try {
			if (fileRef.current) {
				const formData = new FormData();
				formData.append("file", fileRef.current as File);
				formData.append("upload_preset", "pet7chaa");
				const data = await axios.post(
					"https://api.cloudinary.com/v1_1/dgn9bcr5s/image/upload",
					formData
				);
				const result = data;
				if (result.status === 200) {
					img = "https://" + result.data?.url?.toString()?.split("http://")[1];
				}
			}
			const answer = [
				answerARef.current?.value || "",
				answerBRef.current?.value || "",
				answerCRef.current?.value || "",
				answerDRef.current?.value || "",
			];
			const question: question = {
				answers: answer,
				name: nameRef.current?.value || "",
				image: img,
				correctAnswer: item?.question?.answers[correctAnswer],
			};
			const url = `/v1/quiz/update_question_item/${item?.question?._id}`;
			const da = await axios.post(
				url,
				{
					question,
				},
				{
					headers: {
						token: `Bearer ${auth.user?.token}`,
					},
				}
			);
			toast.success(da?.data?.msg);
			setUpdateQuesion(null);
		} catch (error) {
			const err = error as AxiosError<ErrorLogin>;
			toast.error(err?.response?.data?.msg);
		}
	};
	return (
		<div className="question__update__wrap">
			<div className="d-flex question__update_cancel">
				<div
					onClick={() => {
						setUpdateQuesion(null);
					}}
				>
					&times;
				</div>
			</div>
			<div className="question__update__infor">
				<div className="question__update-name">
					<textarea
						ref={nameRef}
						defaultValue={item?.question?.name}
						placeholder="Tên của câu hỏi?"
					/>
				</div>
				<div className="question__update__infor-wrap">
					<div className="question__update-img">
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
					<div className="question__update-answers">
						<div style={{ marginBottom: "1rem" }} className="d-flex center-h">
							<div className="radio__input">
								<label htmlFor="A">A</label>
								<input
									ref={correctARef}
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
									ref={correctBRef}
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
									ref={correctCRef}
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
									ref={correctDRef}
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
						<div
							style={{ width: "100%" }}
							className="question__quiz__answer__container"
						>
							<div className="question__quiz__answer__items no__transform">
								<div className="text__area__input">
									<textarea
										defaultValue={item?.question?.answers[0]}
										ref={answerARef}
										placeholder="Đáp án A"
									/>
								</div>
							</div>
						</div>
						<div
							style={{ width: "100%" }}
							className="question__quiz__answer__container"
						>
							<div className="question__quiz__answer__items no__transform">
								<div className="text__area__input">
									<textarea
										defaultValue={item?.question?.answers[1]}
										ref={answerBRef}
										placeholder="Đáp án B"
									/>
								</div>
							</div>
						</div>
						<div
							style={{ width: "100%" }}
							className="question__quiz__answer__container"
						>
							<div className="question__quiz__answer__items no__transform">
								<div className="text__area__input">
									<textarea
										defaultValue={item?.question?.answers[2]}
										ref={answerCRef}
										placeholder="Đáp án C"
									/>
								</div>
							</div>
						</div>
						<div
							style={{ width: "100%" }}
							className="question__quiz__answer__container"
						>
							<div className="question__quiz__answer__items no__transform">
								<div className="text__area__input">
									<textarea
										defaultValue={item?.question?.answers[3]}
										ref={answerDRef}
										placeholder="Đáp án D"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="question__update-button">
					<button onClick={handleUpdateQuestion} className="btn btn-default">
						Update
					</button>
					<button
						onClick={() => {
							setUpdateQuesion(null);
						}}
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
