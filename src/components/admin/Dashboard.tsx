import React, { useState, useContext, useEffect, useRef } from "react";
import Header from "../header/Header";
import "./style.scss";
import { Droppable } from "react-beautiful-dnd";
import QuizCardAdmin from "./QuizCardAdmin";
import Question from "./Question";
import Create from "../quizAdmin/Create";
import { UseContext } from "../../App";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorLogin, quiz } from "../../model";
import { useAppSelector } from "../../store/store";
import QuestionUpdate from "../update/QuestionUpdate";

const Dashboard: React.FC = () => {
	const [create, setCreate] = useState<boolean>(false);
	const [updateQuestion, setUpdateQuesion] = useState<number>(-1);
	const [quizs, setQuizs] = useState<quiz[]>();
	const [number, setNumber] = useState<number>(0);
	const [update, setUpdate] = useState<boolean>(false);

	const countRef = useRef<number>(0);

	const auth = useAppSelector((state) => state.auth);

	const { result } = useContext(UseContext);
	useEffect(() => {
		let here = true;
		axios
			.get("/v1/quiz")
			.then((res) => {
				setQuizs(res?.data?.quiz);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.msg);
			});
		return () => {
			here = false;
		};
	}, []);
	useEffect(() => {
		if (result) {
			if (result?.destination) {
				if (
					result?.destination?.droppableId === "question" &&
					result?.source?.droppableId === "question"
				) {
					const target = result?.destination?.index || 0;
					const index = result?.source?.index || 0;
					const item = quizs || [];
					const currentItem = item[number]?.questions?.splice(index, 1);
					item[number]?.questions?.splice(target, 0, currentItem[0]);
					countRef.current++;
					setQuizs(item);
					setUpdate(!update);
				} else if (
					result?.destination?.droppableId === "quiz" &&
					result?.source?.droppableId === "quiz"
				) {
					const target = result?.destination?.index || 0;
					const index = result?.source?.index || 0;
					const item = quizs || [];
					const currentItem = item.splice(index, 1);
					item.splice(target, 0, currentItem[0]);
					setQuizs(item);
					setUpdate(!update);
				}
			}
		}
	}, [result]);

	useEffect(() => {
		countRef.current = 0;
		setUpdate(!update);
	}, [number]);

	const handleUpdateQuestion = async (): Promise<void> => {
		if (!quizs) {
			return;
		}
		try {
			let questionArray: string[] = [];
			quizs[number]?.questions.forEach((item) => {
				questionArray.push(item?._id);
			});
			const url = `/v1/quiz/update_question/${quizs[number]?._id}`;
			const data = await axios.post(
				url,
				{
					questions: questionArray,
				},
				{
					headers: {
						token: `Bearer ${auth.user?.token}`,
					},
				}
			);
			toast.success(data?.data?.msg);
			countRef.current = 0;
			setUpdate(!update);
		} catch (error) {
			const err = error as AxiosError<ErrorLogin>;
			toast.error(err?.response?.data?.msg);
		}
	};

	return (
		<div style={{ position: "relative" }} className="container d-flex center-h">
			<div className="dashboard">
				<Header />
				<Droppable
					isDropDisabled={updateQuestion !== -1 ? true : false}
					droppableId="quiz"
				>
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="dashboard__navbar"
						>
							{quizs?.map((item, index) => (
								<QuizCardAdmin
									number={number}
									setNumber={setNumber}
									item={item}
									index={index}
									key={item?._id}
								/>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<Droppable
					isDropDisabled={updateQuestion !== -1 ? true : false}
					droppableId="question"
				>
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="question"
						>
							{quizs &&
								quizs[number]?.questions?.map((item, index) => (
									<Question
										type="admin"
										key={item?._id}
										question={{
											...item,
											url: item?.image,
										}}
										index={index}
									/>
								))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
			<div className="dashboard__create">
				<button
					onClick={() => {
						setCreate(true);
					}}
				>
					Tạo mới
				</button>
				{countRef.current > 0 && (
					<button
						onClick={handleUpdateQuestion}
						style={{ backgroundColor: "#FF8A08", marginLeft: "1rem" }}
					>
						Save
					</button>
				)}
			</div>
			{create && <Create create={create} setCreate={setCreate} />}
			{updateQuestion !== -1 && <QuestionUpdate />}
			{updateQuestion !== -1 && <div className="item__cancel"></div>}
		</div>
	);
};

export default Dashboard;
