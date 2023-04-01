import React, { useEffect, useState } from "react";
import "./style.scss";
import Header from "../header/Header";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useAppSelector } from "../../store/store";
import axios from "axios";
interface history {
	quiz: {
		image: string;
		name: string;
		_id: string;
	};
	result: number;
	time: number;
	_id: string;
}
const History: React.FC = () => {
	const auth = useAppSelector((state) => state.auth);
	const [history, setHistory] = useState<history[]>([]);
	useEffect(() => {
		let here = true;
		axios
			.get("/v1/quiz/result", {
				headers: {
					token: `Bearer ${auth.user?.token}`,
				},
			})
			.then((res) => {
				if (!here) {
					return;
				}
				setHistory(res?.data?.histories);
			});
		return () => {
			here = false;
		};
	}, []);
	return (
		<div className="container d-flex center-h">
			<div className="homePage">
				<Header />
				<Droppable droppableId="historyItem">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="quiz__container"
						>
							<div style={{ flexWrap: "wrap" }} className="d-flex">
								{history?.map((item, index) => (
									<Draggable
										key={item?._id}
										index={index}
										draggableId={item?._id?.toString()}
									>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.dragHandleProps}
												{...provided.draggableProps}
												className="quizCard"
											>
												<div className="quizCard__wrap">
													<div className="quizCard__image">
														<img src={item?.quiz?.image} alt="Quiz Image" />
													</div>
													<div className="quizCard__name">
														<div className="quizCard__name-elips">
															<i>{item?.quiz?.name}</i>
														</div>
													</div>
													<div className="quizCard__point">
														{Number.parseFloat(
															item?.result?.toString()
														).toFixed(2)}
														%
													</div>
													<div className="quizCard__time">
														{" "}
														{`${
															Math.floor(item?.time / 60) >= 10 ? "" : "0"
														}${Math.floor(item?.time / 60)} phút ${
															Math.floor(item?.time % 60) >= 10 ? "" : "0"
														}${Math.floor(item?.time % 60)}`}{" "}
														giây
													</div>
												</div>
											</div>
										)}
									</Draggable>
								))}
							</div>
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		</div>
	);
};

export default History;
