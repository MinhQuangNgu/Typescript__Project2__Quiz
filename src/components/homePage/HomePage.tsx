import React, { useEffect } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { isLogout } from "../../store/slice/authSlice";
import { toast } from "react-toastify";
import Quiz from "../quiz/Quiz";
import Header from "../header/Header";
const HomePage: React.FC = () => {
	const navigate = useNavigate();
	const auth = useAppSelector((state) => state.auth);

	useEffect((): void => {
		if (!auth.user?.token) {
			toast.error("Vui lòng đăng nhập trước", {
				autoClose: 2000,
			});
			navigate("/login");
		}
	}, []);
	return (
		<div className="container d-flex center-h">
			<div className="homePage">
				<Header />
				<div className="quiz__container">
					<Quiz />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
