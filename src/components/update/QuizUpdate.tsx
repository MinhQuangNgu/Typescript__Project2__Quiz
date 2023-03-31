import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../../store/store";
import { ErrorLogin } from "../../model";
import { toast } from "react-toastify";

interface props {
	quizUpdate: {
		name: string;
		image: string;
		_id: string;
	};
	setQuizUpdate: React.Dispatch<
		React.SetStateAction<{
			name: string;
			image: string;
			_id: string;
		} | null>
	>;
}
const QuizUpdate: React.FC<props> = ({ quizUpdate, setQuizUpdate }) => {
	const fileRef = useRef<File>();
	const [image, setImage] = useState<string>();
	const [quiz, setQuiz] = useState<{
		name: string;
		image: string;
		_id: string;
	}>();

	//
	const auth = useAppSelector((state) => state.auth);
	const nameRef = useRef<HTMLTextAreaElement>(null);

	//

	useEffect(() => {
		if (quizUpdate) {
			setQuiz(quizUpdate);
		}
	}, [quizUpdate]);

	useEffect(() => {
		if (quiz) {
			setImage(quiz.image);
		}
	}, [quiz]);

	const handleGetFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target?.files[0];
			const reader = new FileReader();
			reader.onload = (event) => {
				fileRef.current = file;
				setImage(event.target?.result?.toString());
			};
			reader.readAsDataURL(file);
		}
	};
	const handleDrop = (e: React.DragEvent<HTMLLabelElement>): void => {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		const reader = new FileReader();

		reader.onload = (event) => {
			fileRef.current = file;
			setImage(event.target?.result?.toString());
		};

		reader.readAsDataURL(file);
	};
	const handleDragOver = (e: any): void => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragEnter = (e: any): void => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleUpdateQuiz = async (): Promise<void> => {
		if (!nameRef.current?.value) {
			window.alert("Vui lòng điền tên quiz");
			return;
		}
		try {
			let img = quiz?.image;
			if (fileRef.current) {
				const formData = new FormData();
				formData.append("file", fileRef.current as File);
				formData.append("upload_preset", "pet7chaa");
				const data = await axios.post(
					"https://api.cloudinary.com/v1_1/dgn9bcr5s/image/upload",
					formData
				);
				const result = data;
				if (result.status === 200) {
					img = "https://" + result.data?.url?.toString()?.split("http://")[1];
				}
			}
			const url = `/v1/quiz/update/${quiz?._id}`;
			const da = await axios.put(
				url,
				{
					name: nameRef.current?.value,
					image: img,
				},
				{
					headers: {
						token: `Bearer ${auth.user?.token}`,
					},
				}
			);
			toast.success(da?.data?.msg);
			setQuizUpdate(null);
		} catch (error) {
			const err = error as AxiosError<ErrorLogin>;
			toast.error(err?.response?.data?.msg, {
				autoClose: 2000,
			});
		}
	};

	const handleDeleteQuiz = async (): Promise<void> => {
		try {
			const url = `/v1/quiz/delete/${quiz?._id}`;
			if (!window.confirm("Bạn thực sự muốn xóa quiz này?")) {
				return;
			}
			const data = await axios.delete(url, {
				headers: {
					token: `Bearer ${auth.user?.token}`,
				},
			});
			toast.success(data?.data?.msg);
			setQuizUpdate(null);
		} catch (error) {
			const err = error as AxiosError<ErrorLogin>;
			toast.error(err?.response?.data?.msg, {
				autoClose: 2000,
			});
		}
	};
	return (
		<div className="question__update__wrap">
			<div className="d-flex question__update_cancel">
				<div
					onClick={() => {
						setQuizUpdate(null);
					}}
				>
					&times;
				</div>
			</div>
			<div className="quiz__update">
				<div className="quiz__update__name">
					<textarea
						ref={nameRef}
						defaultValue={quiz?.name}
						placeholder="Tên quiz"
					/>
				</div>
				<div className="quiz__update__img">
					<div className="quizCard__input">
						<div>
							<label
								onDrop={(e) => handleDrop(e)}
								onDragOver={handleDragOver}
								onDragEnter={handleDragEnter}
								className="quizCard__label"
								htmlFor="inputFile"
							></label>
							<input
								accept="image/*"
								onChange={(e) => handleGetFile(e)}
								hidden
								id="inputFile"
								type="file"
							/>
						</div>
					</div>
					<div
						style={{ border: "0.1rem solid rgba(0, 0, 0, 0.4)" }}
						className="quizCard__image"
					>
						<img src={image} alt="Quiz Image" />
					</div>
				</div>
				<div style={{ marginTop: "2rem" }} className="quiz__update__name">
					<button onClick={handleUpdateQuiz} className="btn btn-default">
						Update
					</button>
					<button
						onClick={() => {
							setQuizUpdate(null);
						}}
						style={{ marginLeft: "1rem", backgroundColor: "grey" }}
						className="btn btn-default"
					>
						Cancel
					</button>
					<button
						onClick={handleDeleteQuiz}
						style={{ marginLeft: "1rem", backgroundColor: "red" }}
						className="btn btn-default"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuizUpdate;
