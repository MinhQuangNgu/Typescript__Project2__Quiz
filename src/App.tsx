import React, { useRef, createContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRouter, privateRouter } from "./routes";
import { router } from "./model";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "./store/store";
import jwt_decoded from "jwt-decode";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
interface cache {
	cache: object;
	role: string;
	result: object;
}
export const UseContext = createContext<cache>({
	cache: {},
	role: "",
	result: {},
});
function App() {
	const cacheRef = useRef<object>({});
	const [role, setRole] = useState<string>("");
	const [result, setResult] = useState<object>({});
	const auth = useAppSelector((state) => state.auth);
	useEffect((): void => {
		if (auth.user?.token) {
			const data: {
				exp: number;
				iat: number;
				id: string;
				role: string;
			} = jwt_decoded(auth.user?.token);
			setRole(data.role);
		}
	}, [auth.user?.token]);
	const onDragEnd = (result: DropResult) => {
		setResult(result);
	};
	return (
		<UseContext.Provider
			value={{ cache: cacheRef.current, role: role, result: result }}
		>
			<DragDropContext onDragEnd={onDragEnd}>
				<Router>
					<div className="App">
						<Routes>
							{publicRouter?.map((item: router, index: number) => {
								const Page = item?.element;
								return (
									<Route
										key={index + "Page"}
										path={item?.path}
										element={<Page />}
									/>
								);
							})}
							{role === "admin" &&
								privateRouter?.map((item: router, index: number) => {
									const Page = item?.element;
									return (
										<Route
											key={index + "private"}
											path={item?.path}
											element={<Page />}
										/>
									);
								})}
						</Routes>
						<ToastContainer style={{ fontSize: "1.5rem" }} />
					</div>
				</Router>
			</DragDropContext>
		</UseContext.Provider>
	);
}

export default App;
