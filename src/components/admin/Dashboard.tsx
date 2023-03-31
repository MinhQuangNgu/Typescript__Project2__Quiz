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
import { ErrorLogin, question, quiz } from "../../model";
import { useAppSelector } from "../../store/store";
import QuestionUpdate from "../update/QuestionUpdate";
import QuizUpdate from "../update/QuizUpdate";
import { useLocation, useNavigate } from "react-router-dom";
import CreateQuestion from "../quizAdmin/CreateQuestion";

const Dashboard: React.FC = () => {
	const [create, setCreate] = useState<boolean>(false);
	const [updateQuestion, setUpdateQuesion] = useState<question | null>(null);
	const [quizs, setQuizs] = useState<quiz[]>();
	const [number, setNumber] = useState<number>(0);
	const [update, setUpdate] = useState<boolean>(false);

	const countRef = useRef<number>(0);
	//
	const [quizUpdate, setQuizUpdate] = useState<{
		name: string;
		image: string;
		_id: string;
	} | null>(null);
	//
	const navigate = useNavigate();
	//
	const auth = useAppSelector((state) => state.auth);

	const { search } = useLocation();

	useEffect(() => {
		if (quizs) {
			const id = new URLSearchParams(search).get("id") || 0;
			const index = quizs.findIndex(
				(item) => item?._id?.toString() === id?.toString()
			);
			setNumber(index);
		}
	}, [search, update]);

	const { result } = useContext(UseContext);
	useEffect(() => {
		let here = true;
		axios
			.get("/v1/quiz")
			.then((res) => {
				setQuizs(res?.data?.quiz);
				navigate(`?id=${res?.data?.quiz[0]?._id}`);
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
					isDropDisabled={updateQuestion ? true : false}
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
									item={item}
									index={index}
									key={item?._id}
									setQuizUpdate={setQuizUpdate}
								/>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<Droppable
					isDropDisabled={updateQuestion ? true : false}
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
										quizId={quizs[number]?._id}
										index={index}
										setUpdateQuesion={setUpdateQuesion}
										updateQuestion={updateQuestion}
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
			{updateQuestion && (
				<QuestionUpdate
					setUpdateQuesion={setUpdateQuesion}
					updateQuestion={updateQuestion}
				/>
			)}
			{updateQuestion && (
				<div
					onClick={() => {
						setUpdateQuesion(null);
					}}
					className="item__cancel"
				></div>
			)}
			{quizUpdate && (
				<div
					onClick={() => {
						setQuizUpdate(null);
					}}
					className="item__cancel"
				></div>
			)}
			{quizUpdate && (
				<QuizUpdate quizUpdate={quizUpdate} setQuizUpdate={setQuizUpdate} />
			)}
		</div>
	);
};

export default Dashboard;
