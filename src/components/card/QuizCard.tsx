import React from "react";
import "./style.scss";
import { Link } from "react-router-dom";
const QuizCard: React.FC = () => {
	return (
		<div className="quizCard">
			<div className="quizCard__wrap">
				<Link to="/quizDetail/as">
					<div className="quizCard__image">
						<img
							src="https://antimatter.vn/wp-content/uploads/2022/05/background-dep-1.jpg"
							alt="Quiz Image"
						/>
					</div>
				</Link>
				<div className="quizCard__name">
					<Link style={{ textDecoration: "none" }} to="/quizDetail/asd">
						<div className="quizCard__name-elips">
							<i>Quang Ngu Quang Ngu Quang Ngu QuangNguQuangNguNgu</i>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default QuizCard;
