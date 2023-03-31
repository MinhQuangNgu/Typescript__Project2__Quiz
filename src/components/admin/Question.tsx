import axios, { AxiosError } from "axios";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useAppSelector } from "../../store/store";
import { toast } from "react-toastify";
import { ErrorLogin } from "../../model";

interface props {
	index: number;
	question: {
		answers: string[];
		correctAnswer: string;
		image: ProgressEvent<FileReader> | unknown;
		name: string;
		url?: string;
		_id?: string;
	};
	quizId?: string;
	[key: string]: any;
	type: string;
}
const Question: React.FC<props> = ({
	index,
	question,
	type,
	setUpdateQuesion,
	quizId,
}) => {
	const auth = useAppSelector((state) => state.auth);
	const handleDeleteQuestion = async (): Promise<void> => {
		if (!question?._id || !quizId) {
			return;
		}
		try {
			const url = `/v1/quiz/delete_question/${question?._id}/${quizId}`;
			if (!window.confirm("Bạn muốn xóa câu hỏi này?")) {
				return;
			}
			const data = await axios.delete(url, {
				headers: {
					token: `Bearer ${auth.user?.token}`,
				},
			});
			toast.success(data?.data?.msg);
		} catch (error) {
			const err = error as AxiosError<ErrorLogin>;
			toast.error(err?.response?.data?.msg);
		}
	};
	return (
		<Draggable
			index={index}
			draggableId={question?.name + type + question?.answers[0]}
		>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					className="question__card"
				>
					<div className="question__card__img">
						<img src={question?.url} alt="anh" />
					</div>
					<div className="question__card_information">
						<div className="question__card_name">
							<i>{question?.name}</i>
						</div>
						<div className="question__card_answer">
							{question?.answers?.map((item, index) => (
								<div
									key={item + index}
									className="question__quiz__answer__container"
								>
									<div
										style={
											item === question?.correctAnswer
												? {
														backgroundImage: "linear-gradient(0, green, green)",
														color: "white",
												  }
												: {}
										}
										className="question__quiz__answer__items"
									>
										{item}
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="question__edit">
						<div className="question__edit_btn">
							<button
								onClick={() => {
									setUpdateQuesion(question);
								}}
								className="btn btn-default button__edit"
							>
								Update
							</button>
							<button
								onClick={handleDeleteQuestion}
								className="btn btn-default button__edit_second"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
};

export default Question;
