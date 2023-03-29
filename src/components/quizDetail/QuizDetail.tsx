import React from "react";
import "./style.scss";
import Header from "../header/Header";
import QuizAnswer from "./QuizAnswer";
const QuizDetail: React.FC = () => {
	return (
		<div className="container d-flex center-h">
			<div className="quizDetail__container">
				<Header />
				<div className="quizDetail__quiz">
					<div className="quizDetail__quiz__title d-flex center-h">
						<i>Thiết triều nằm lả, khiến tàn nghiệp Lê ?</i>
					</div>
					<div className="d-flex center-h quizDetail__image">
						<img
							src="https://cdn.tgdd.vn//GameApp/1371168//100-cau-do-hay-ve-lich-su-viet-nam-co-dap-an-hoc-lich-su-vui-11-800x450.jpg"
							alt=""
						/>
					</div>
					<div className="quiz__answer">
						<QuizAnswer />
						<QuizAnswer />
						<QuizAnswer />
						<QuizAnswer />
					</div>
				</div>
				<div className="times__container">
					<i>20:50</i>
				</div>
			</div>
		</div>
	);
};

export default QuizDetail;
