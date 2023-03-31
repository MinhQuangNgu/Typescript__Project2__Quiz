import React, { useState, useEffect, useRef, useContext } from "react";
import "./style.scss";
import Header from "../header/Header";
import QuizAnswer from "./QuizAnswer";
import { useParams } from "react-router-dom";
import { quiz } from "../../model";
import axios from "axios";
import { toast } from "react-toastify";
import { UseContext } from "../../App";
const QuizDetail: React.FC = () => {
	const { slug } = useParams();
	const [quiz, setQuiz] = useState<quiz>();
	const [number, setNumber] = useState<number>(0);
	const [answer, setAnswer] = useState<string | null>(null);
	const [times, setTimes] = useState<number>(1800);
	const correctNumber = useRef<number>(0);

	const successRef = useRef<HTMLAudioElement>(null);
	const wrongRef = useRef<HTMLAudioElement>(null);
	const { musicRef } = useContext(UseContext);
	useEffect(() => {
		let here = false;
		const url = `/v1/quiz/${slug}`;
		setTimes(1800);
		if (musicRef?.current) {
			musicRef.current.play();
		}
		if (successRef.current) {
			successRef.current.volume = 0.1;
		}
		if (wrongRef.current) {
			wrongRef.current.volume = 0.05;
		}
		axios
			.get(url)
			.then((res) => {
				if (here) {
					return;
				}
				setQuiz(res?.data?.quizs);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.msg, {
					autoClose: 2000,
				});
			});
		return () => {
			here = true;
		};
	}, [slug]);
	useEffect(() => {
		const timeInterval = setInterval(() => {
			setTimes((prev) => Math.max(0, prev - 1));
		}, 1000);

		return () => {
			clearInterval(timeInterval);
		};
	}, [slug]);

	useEffect(() => {
		if (answer && quiz) {
			if (answer === quiz?.questions[number]?.correctAnswer) {
				if (successRef.current) {
					successRef.current.play();
				}
				setTimeout(() => {
					correctNumber.current++;
					setAnswer(null);
					setNumber((prev) => Math.min(prev + 1, quiz?.questions?.length - 1));
				}, 3000);
			} else {
				if (wrongRef.current) {
					wrongRef.current.play();
				}
				setTimeout(() => {
					correctNumber.current++;
					setAnswer(null);
					setNumber((prev) => Math.min(prev + 1, quiz?.questions?.length - 1));
				}, 3000);
			}
		}
	}, [answer]);
	return (
		<div className="container d-flex center-h">
			<div className="audio_controller">
				<audio hidden ref={successRef} controls>
					<source
						src="https://res.cloudinary.com/dgn9bcr5s/video/upload/v1680273443/quiz/Correct_answer_Sound_effect_o4obc9.mp3"
						type="audio/mpeg"
					/>
				</audio>
				<audio hidden ref={wrongRef} controls>
					<source
						src="https://res.cloudinary.com/dgn9bcr5s/video/upload/v1680273442/quiz/Wrong_Answer_Sound_effect_ueqdyp.mp3"
						type="audio/mpeg"
					/>
				</audio>
			</div>
			<div className="quizDetail__container">
				<Header />
				<div className="quizDetail__quiz">
					<div className="quizDetail__quiz__title d-flex center-h">
						<i>{quiz?.questions[number]?.name} ?</i>
					</div>
					<div className="d-flex center-h quizDetail__image">
						<img src={quiz?.questions[number]?.image} alt="oki" />
					</div>
					<div className="quiz__answer">
						{quiz?.questions[number]?.answers?.map((item, index) => (
							<QuizAnswer
								setAnswer={setAnswer}
								key={number + item + index}
								item={item}
								answer={answer}
								index={index}
								correct={quiz?.questions[number]?.correctAnswer}
							/>
						))}
					</div>
				</div>
				<div className="times__container">
					<i>{`${Math.floor(times / 60) > 10 ? "" : "0"}${Math.floor(
						times / 60
					)} : ${Math.floor(times % 60) > 10 ? "" : "0"}${Math.floor(
						times % 60
					)}`}</i>
				</div>
			</div>
		</div>
	);
};

export default QuizDetail;
