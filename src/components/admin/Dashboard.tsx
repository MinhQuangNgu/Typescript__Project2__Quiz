import React, { useState, useContext, useEffect, useRef } from "react";
import Header from "../header/Header";
import "./style.scss";
import { Droppable } from "react-beautiful-dnd";
import QuizCardAdmin from "./QuizCardAdmin";
import Question from "./Question";
import Create from "../quizAdmin/Create";
import { UseContext } from "../../App";
import axios from "axios";
import { toast } from "react-toastify";
import { quiz } from "../../model";

const Dashboard: React.FC = () => {
	const [create, setCreate] = useState<boolean>(false);
	const [quizs, setQuizs] = useState<quiz[]>();
	const [number, setNumber] = useState<number>(0);
	const [update, setUpdate] = useState<boolean>(false);

	const countRef = useRef<number>(0);

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
				}
			}
		}
	}, [result]);

	useEffect(() => {
		countRef.current = 0;
	}, [number]);

	return (
		<div style={{ position: "relative" }} className="container d-flex center-h">
			<div className="dashboard">
				<Header />
				<Droppable isDropDisabled={create ? true : false} droppableId="quiz">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="dashboard__navbar"
						>
							{quizs?.map((item, index) => (
								<QuizCardAdmin item={item} index={index} key={item?._id} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<Droppable
					isDropDisabled={create ? true : false}
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
					<button style={{ backgroundColor: "#FF8A08", marginLeft: "1rem" }}>
						Save
					</button>
				)}
			</div>
			{create && <Create create={create} setCreate={setCreate} />}
		</div>
	);
};

export default Dashboard;
