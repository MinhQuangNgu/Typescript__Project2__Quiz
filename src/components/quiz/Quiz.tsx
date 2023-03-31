import React, { useState, useEffect, useContext } from "react";
import QuizCard from "../card/QuizCard";
import { quiz } from "../../model";
import axios from "axios";
import { toast } from "react-toastify";
import { UseContext } from "../../App";

const Quiz: React.FC = () => {
	const [quizs, setQuizs] = useState<quiz[]>();
	const { musicRef } = useContext(UseContext);
	useEffect(() => {
		let here = true;
		axios
			.get(`/v1/quiz`)
			.then((res) => {
				if (!here) {
					return;
				}
				setQuizs(res?.data?.quiz);
			})
			.catch((err) => {
				if (!here) {
					return;
				}
				toast.error(err?.response?.data?.msg, {
					autoClose: 2000,
				});
			});
		return () => {
			here = false;
		};
	}, []);

	useEffect(() => {
		if (musicRef?.current) {
			musicRef.current.play();
		}
	}, [quizs]);
	return (
		<div className="quiz">
			{quizs &&
				quizs?.map((item) => <QuizCard key={item?._id + "home"} item={item} />)}
		</div>
	);
};

export default Quiz;
