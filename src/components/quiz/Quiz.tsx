import React, { useState, useEffect, useContext } from "react";
import QuizCard from "../card/QuizCard";
import { quiz } from "../../model";
import axios from "axios";
import { toast } from "react-toastify";
import { UseContext } from "../../App";

const Quiz: React.FC = () => {
	const [quizs, setQuizs] = useState<quiz[]>();
	const { cache } = useContext(UseContext);
	useEffect(() => {
		let here = true;
		if (cache?.current) {
			const cacheRef = cache?.current as {
				[key: string]: unknown;
			};
			if (cacheRef["/v1/quiz"]) {
				const quizAr = cacheRef["/v1/quiz"] as quiz[];
				setQuizs(quizAr);
				return;
			}
		}
		axios
			.get(`/v1/quiz`)
			.then((res) => {
				if (!here) {
					return;
				}
				if (cache?.current) {
					const cacheRef = cache?.current as {
						[key: string]: unknown;
					};
					cacheRef["/v1/quiz"] = res?.data?.quiz;
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

	return (
		<div className="quiz">
			{quizs &&
				quizs?.map((item) => <QuizCard key={item?._id + "home"} item={item} />)}
		</div>
	);
};

export default Quiz;
