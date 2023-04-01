import React from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { quiz } from "../../model";
interface props {
	item: quiz;
}
const QuizCard: React.FC<props> = ({ item }) => {
	return (
		<div className="quizCard">
			<div className="quizCard__wrap">
				<Link to={`/quizDetail/${item?._id}`}>
					<div className="quizCard__image">
						<img src={item?.image} alt="Quiz Image" />
					</div>
				</Link>
				<div className="quizCard__name">
					<Link
						style={{ textDecoration: "none" }}
						to={`/quizDetail/${item?._id}`}
					>
						<div className="quizCard__name-elips">
							<i>{item?.name}</i>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default QuizCard;
