import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { isLogout } from "../../store/slice/authSlice";
import { toast } from "react-toastify";
import { UseContext } from "../../App";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { role } = useContext(UseContext);
	const auth = useAppSelector((state) => state.auth);
	return (
		<div className="header d-flex center-v">
			<div className="header__brand">
				<h1>
					<Link style={{ textDecoration: "none" }} to="/">
						<i>QUIZ</i>
					</Link>
				</h1>
			</div>
			<div className="header__button d-flex center-v">
				{!auth.user?.token ? (
					<button
						onClick={() => {
							navigate("/login");
						}}
						className="btn btn-default"
					>
						Login
					</button>
				) : (
					<div className="header__name">
						<i>
							{auth.user?.name}{" "}
							<i
								style={{ fontSize: "1.7rem" }}
								className="fa-solid fa-caret-down"
							></i>
						</i>
						<div className="header__navbar">
							{role === "admin" && (
								<div
									onClick={() => {
										navigate("/admin");
									}}
									className="header__navbar_items"
								>
									<i>Dashboard</i>
								</div>
							)}
							{role === "demo" && (
								<div
									onClick={() => {
										navigate("/admin");
									}}
									className="header__navbar_items"
								>
									<i>Dashboard</i>
								</div>
							)}
							<div
								onClick={() => {
									navigate("/history");
								}}
								className="header__navbar_items"
							>
								<i>Kết quả cũ</i>
							</div>
							<div
								onClick={() => {
									dispatch(isLogout());
									toast.success("Đăng xuất thành công");
									navigate("/login");
								}}
								className="header__navbar_items"
							>
								<i>Đăng xuất</i>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Header;
