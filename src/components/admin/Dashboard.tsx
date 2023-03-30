import React, { useState, useContext } from "react";
import Header from "../header/Header";
import "./style.scss";
import { Droppable } from "react-beautiful-dnd";
import QuizCardAdmin from "./QuizCardAdmin";
import Question from "./Question";
import Create from "../quizAdmin/Create";
import { UseContext } from "../../App";
const Dashboard: React.FC = () => {
	const [create, setCreate] = useState<boolean>(false);

	const { result } = useContext(UseContext);
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
							<QuizCardAdmin index={3} />
							<QuizCardAdmin index={4} />
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
			</div>
			{create && <Create create={create} setCreate={setCreate} />}
		</div>
	);
};

export default Dashboard;
