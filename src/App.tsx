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
	cache?: React.MutableRefObject<{
		[key: string]: unknown;
	}>;
	role: string;
	result?: {
		destination?: {
			droppableId?: string;
			index?: number;
		};
		source?: {
			droppableId?: string;
			index?: number;
		};
	};
	musicRef?: React.RefObject<HTMLAudioElement>;
}
export const UseContext = createContext<cache>({
	role: "",
	result: {},
});
function App() {
	const cacheRef = useRef<{
		[key: string]: unknown;
	}>({});
	const [role, setRole] = useState<string>("");
	const [result, setResult] = useState({});
	const musicRef = useRef<HTMLAudioElement>(null);
	const auth = useAppSelector((state) => state.auth);
	useEffect((): void => {
		if (musicRef.current) {
			musicRef.current.volume = 0.2;
		}
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
			value={{
				cache: cacheRef,
				role: role,
				result: result,
				musicRef: musicRef,
			}}
		>
			<DragDropContext onDragEnd={onDragEnd}>
				<Router>
					<div className="App">
						<div className="radio__container">
							<audio controls autoPlay>
								<source
									src="https://res.cloudinary.com/dgn9bcr5s/video/upload/v1680272888/quiz/Good_day_lofi_ambient_music_-_chill_beats_to_relax-study_to_up6i5j.mp3"
									type="audio/mpeg"
								/>
							</audio>
						</div>
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
							{role === "demo" &&
								privateRouter?.map((item: router, index: number) => {
									const Page = item?.element;
									return (
										<Route
											key={index + "demo"}
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
