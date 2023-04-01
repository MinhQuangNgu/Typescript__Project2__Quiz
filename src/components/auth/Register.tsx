import React, { useRef, useState, useContext } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postApi } from "../../api/Api";
import { AxiosError } from "axios";
import { ErrorLogin } from "../../model";
import { UseContext } from "../../App";

interface User {
	name: string;
	email: string;
	password: string;
	repassword: string;
	[key: string]: string;
}
const Register: React.FC = () => {
	const navigate = useNavigate();

	const [err, setErr] = useState<User>({
		name: "",
		email: "",
		password: "",
		repassword: "",
	});
	const emailRef = useRef<HTMLInputElement>(null);
	const nameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const repasswordRef = useRef<HTMLInputElement>(null);
	const handleChangeTypeOfPassword = (msg: string): void => {
		toast.success("Xin lỗi nhưng phải bỏ cái này không nó báo lỗi.", {
			autoClose: 2000,
		});
		// if (msg === "password") {
		// 	if (passwordRef.current?.type === "text") {
		// 		passwordRef.current.type = "password";
		// 	} else if (passwordRef.current?.type === "password") {
		// 		passwordRef.current.type = "text";
		// 	}
		// } else {
		// 	if (repasswordRef.current?.type === "text") {
		// 		repasswordRef.current.type = "password";
		// 	} else if (repasswordRef.current?.type === "password") {
		// 		repasswordRef.current.type = "text";
		// 	}
		// }
	};

	const { setLoading } = useContext(UseContext);

	const handleRegister = async (): Promise<void> => {
		try {
			let msg: User = {
				name: "",
				email: "",
				repassword: "",
				password: "",
			};
			const user: User = {
				name: nameRef.current?.value || "",
				email: emailRef.current?.value || "",
				password: passwordRef.current?.value || "",
				repassword: repasswordRef.current?.value || "",
			};
			const fields: string[] = ["name", "email", "password", "repassword"];
			let check: boolean = false;
			fields?.forEach((item) => {
				if (!user[item]) {
					msg[item] = `${item} is required`;
					check = true;
				}
			});
			if (!msg.password) {
				if (user.password !== user.repassword) {
					msg.password = "Password and repassword are not the same!";
					msg.repassword = "Password and repassword are not the same!";
					check = true;
				}
			}
			setErr(msg);
			if (check) {
				return;
			}
			if (setLoading) {
				setLoading(true);
			}
			const url = "/v1/auth/register";
			const data = await postApi(
				url,
				user,
				{},
				{
					msg: "",
				}
			);
			toast.success(data?.data?.msg);
			if (setLoading) {
				setLoading(false);
			}
			navigate("/login", {
				replace: true,
			});
		} catch (error) {
			if (setLoading) {
				setLoading(false);
			}
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
					<h1 className="title">Register</h1>
				</div>
				<div className="form">
					{err.email && (
						<div className="form__input d-flex">
							<span className="warning">* {err.email}</span>
						</div>
					)}
					<div className="form__input d-flex center-h">
						<input ref={emailRef} type="text" placeholder="Email" />
					</div>
					{err.name && (
						<div className="form__input d-flex">
							<span className="warning">* {err.name}</span>
						</div>
					)}
					<div className="form__input d-flex center-h">
						<input ref={nameRef} type="text" placeholder="Name" />
					</div>
					{err.password && (
						<div className="form__input d-flex">
							<span className="warning">* {err.password}</span>
						</div>
					)}
					<div className="form__input d-flex center-h">
						<input ref={passwordRef} type="text" placeholder="Mật khẩu" />
						<div className="form__input-eyes">
							<i
								onClick={() => handleChangeTypeOfPassword("password")}
								className="fa-solid fa-eye"
							></i>
						</div>
					</div>
					{err.repassword && (
						<div className="form__input d-flex">
							<span className="warning">* {err.repassword}</span>
						</div>
					)}
					<div className="form__input d-flex center-h">
						<input
							ref={repasswordRef}
							type="text"
							placeholder="Nhập lại mật khẩu"
						/>
						<div className="form__input-eyes">
							<i
								onClick={() => handleChangeTypeOfPassword("repassword")}
								className="fa-solid fa-eye"
							></i>
						</div>
					</div>
				</div>
				<div className="d-flex center-h button">
					<button onClick={handleRegister} className="btn btn-default">
						Register
					</button>
					<button
						onClick={() => {
							navigate("/login", {
								replace: true,
							});
						}}
						style={{ marginLeft: "1rem" }}
						className="btn btn-default"
					>
						login
					</button>
				</div>
			</div>
		</div>
	);
};

export default Register;
