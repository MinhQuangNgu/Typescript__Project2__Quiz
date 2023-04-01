import React, { useRef } from "react";
import "./style.scss";
import { postApi } from "../../api/Api";
import { AxiosError } from "axios";
import { ErrorLogin, user } from "../../model";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { isLogin } from "../../store/slice/authSlice";

const Login: React.FC = () => {
	const navigate = useNavigate();
	const dispath = useAppDispatch();
	const passwordRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	const handleChangeTypeOfPassword = (): void => {
		if (passwordRef.current?.type === "text") {
			passwordRef.current.type = "password";
		} else if (passwordRef.current?.type === "password") {
			passwordRef.current.type = "text";
		}
	};

	const handleLogin = async (): Promise<void> => {
		try {
			const data = await postApi(
				"/v1/auth/login",
				{
					email: emailRef.current?.value,
					password: passwordRef.current?.value,
				},
				{},
				{
					token: "",
					msg: "",
				}
			);
			toast.success(data?.data?.msg);
			const user: user = {
				name: data?.data?.name,
				token: data?.data?.token,
				image: data?.data?.image,
			};
			dispath(isLogin(user));
			navigate("/", {
				replace: true,
			});
		} catch (error: any) {
			const err = error as AxiosError<ErrorLogin>;
			toast.error(err?.response?.data?.msg, {
				autoClose: 2000,
			});
		}
	};
	return (
		<div className="container d-flex center-h center-v">
			<div className="auth">
				<div className="text-center">
					<h1 className="title">Login</h1>
				</div>
				<div className="form">
					<div className="form__input d-flex center-h">
						<input ref={emailRef} type="text" placeholder="Email" />
					</div>
					<div className="form__input d-flex center-h">
						<input ref={passwordRef} type="password" placeholder="Password" />
						<div className="form__input-eyes">
							<i
								onClick={handleChangeTypeOfPassword}
								className="fa-solid fa-eye"
							></i>
						</div>
					</div>
				</div>
				<div className="guild">
					<i>Tài khoản demo admin:</i>
				</div>
				<div className="guild_2">
					<i>email và password: demo</i>
				</div>
				<div className="d-flex center-h button">
					<button
						style={{ marginRight: "1rem" }}
						onClick={handleLogin}
						className="btn btn-default"
					>
						Login
					</button>
					<button
						onClick={() => {
							navigate("/register", {
								replace: true,
							});
						}}
						className="btn btn-default"
					>
						Register
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
