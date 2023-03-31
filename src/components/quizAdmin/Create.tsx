import React, { useRef, useState, useContext, useEffect } from "react";
import "./style.scss";
import { Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import Question from "../admin/Question";
import { UseContext } from "../../App";
import { ErrorLogin } from "../../model";
import axios, { AxiosError, AxiosResponse } from "axios";
import { postApi } from "../../api/Api";
import { useAppSelector } from "../../store/store";
interface props {
	create: boolean;
	setCreate: React.Dispatch<React.SetStateAction<boolean>>;
}
interface question {
	answers: string[];
	correctAnswer: string;
	image: ProgressEvent<FileReader> | unknown;
	name: string;
	url?: string;
	[key: string]: any;
}
interface quiz {
	name: string;
	image: ProgressEvent<FileReader> | unknown;
	questions: question[];
	[key: string]: any;
}
const Create: React.FC<props> = ({ create, setCreate }) => {
	//quiz
	const [image, setImage] = useState<string>();
	const [name, setName] = useState<string>("");
	const nameRef = useRef<HTMLTextAreaElement>(null);
	const fileRef = useRef<File>();
	const [quizAll, setQuizAll] = useState<quiz>();
	//endquiz

	//question
	const [quesionImg, setQuesitionImg] = useState<string>();
	const [correctAnswer, setCorrectAnswer] = useState<number>(0);
	const fileQuestionRef = useRef<File>();
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
					fileRef.current = file;
					setImage(event.target?.result?.toString());
				} else {
					fileQuestionRef.current = file;
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
			if (type === "quiz") {
				fileRef.current = file;
				setImage(event.target?.result?.toString());
			} else {
				fileQuestionRef.current = file;
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

	const createNewQuestion = (): void => {
		const answer = [
			answerARef.current?.value || "",
			answerBRef.current?.value || "",
			answerCRef.current?.value || "",
			answerDRef.current?.value || "",
		];
		const quiz: question = {
			answers: answer,
			correctAnswer: answer[correctAnswer],
			image: fileQuestionRef.current,
			name: nameQuestionRef.current?.value || "",
			url: quesionImg || "",
		};

		const excluedFields = ["answers", "correctAnswer", "image", "name", "url"];
		let check: boolean = false;
		excluedFields.forEach((item) => {
			if (!quiz[item] || quiz[item]?.length === 0) {
				check = true;
			}
		});
		quiz.answers?.forEach((item) => {
			if (!item) {
				check = true;
			}
		});
		if (check) {
			toast.error("Vui lòng nhập hết thông tin", {
				autoClose: 2000,
			});
			return;
		}

		let question = quizAll?.questions || [];
		question?.push(quiz);

		let quizDetail: quiz = {
			name: nameRef.current?.value || "",
			image: fileRef.current,
			questions: question,
		};
		setQuizAll(quizDetail);
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
	};

	const { result } = useContext(UseContext);

	const auth = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (result) {
			if (result?.destination) {
				if (
					result?.destination?.droppableId === "questionAdmin" &&
					result?.source?.droppableId === "questionAdmin"
				) {
					const item: question[] = quizAll?.questions || [];
					const target = result?.destination?.index || 0;
					const inde = result?.source?.index || 0;
					const firstItem = item.splice(inde, 1);
					item.splice(target, 0, firstItem[0]);
					setQuizAll({
						name: nameRef.current?.value || "",
						image: fileRef.current,
						questions: item,
					});
				}
			}
		}
	}, [result]);

	const handleCreateNewQuiz = async (): Promise<void> => {
		const item: quiz = {
			name: nameRef.current?.value || "",
			image: fileRef.current,
			questions: quizAll?.questions || [],
		};
		if (!item) {
			toast.error("Vui lòng điền thông tin hoặc ít nhất 1 câu hỏi", {
				autoClose: 2000,
			});
		} else {
			item.name = nameRef.current?.value || "";
		}
		if (!item?.name || !item?.image || item?.questions?.length === 0) {
			toast.error("Vui lòng điền thông tin hoặc ít nhất 1 câu hỏi", {
				autoClose: 2000,
			});
			return;
		}
		let imageUrlArray = [];
		try {
			const formData = new FormData();
			formData.append("file", item.image as File);
			formData.append("upload_preset", "pet7chaa");
			imageUrlArray.push(
				axios.post(
					"https://api.cloudinary.com/v1_1/dgn9bcr5s/image/upload",
					formData
				)
			);
			item?.questions?.forEach((infor) => {
				formData.append("file", infor.image as File);
				formData.append("upload_preset", "pet7chaa");
				imageUrlArray.push(
					axios.post(
						"https://api.cloudinary.com/v1_1/dgn9bcr5s/image/upload",
						formData
					)
				);
			});
			const urlData = await Promise.allSettled(imageUrlArray);
			const ques = [];
			for (let i = 1; i < urlData?.length; i++) {
				const result: PromiseSettledResult<AxiosResponse<any, any>> =
					urlData[i];
				let img =
					"https://res.cloudinary.com/dgn9bcr5s/image/upload/v1680227623/quiz/360_F_507584110_KNIfe7d3hUAEpraq10J7MCPmtny8EH7A_hnfyk6.jpg";
				if (result.status === "fulfilled") {
					img =
						"https://" +
						result.value.data?.url?.toString()?.split("http://")[1];
				}
				const ite = {
					...item?.questions[i - 1],
					image: img,
				};
				delete ite.url;
				ques.push(ite);
			}
			const result: PromiseSettledResult<AxiosResponse<any, any>> = urlData[0];
			let img =
				"https://res.cloudinary.com/dgn9bcr5s/image/upload/v1680227623/quiz/360_F_507584110_KNIfe7d3hUAEpraq10J7MCPmtny8EH7A_hnfyk6.jpg";

			if (result.status === "fulfilled") {
				img =
					"https://" + result.value.data?.url?.toString()?.split("http://")[1];
			}
			const newQuiz = {
				name: item.name,
				image: img,
				questions: ques,
			};

			const url = "/v1/quiz/create";
			const data = await axios.post(
				url,
				{
					quiz: newQuiz,
				},
				{
					headers: {
						token: `Bearer ${auth.user?.token}`,
					},
				}
			);
			toast.success(data?.data?.msg);
			setCreate(false);
		} catch (error) {
			const err = error as AxiosError<ErrorLogin>;
			toast.error(err?.response?.data?.msg);
		}
	};

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
							<button onClick={handleCreateNewQuiz} className="btn btn-default">
								Tạo mới
							</button>
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
					<Droppable droppableId="questionAdmin">
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								className="question__card__detail"
							>
								{quizAll?.questions?.map((item, index) => (
									<Question
										question={item}
										key={item?.name}
										index={index}
										type="createQuestion"
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
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
