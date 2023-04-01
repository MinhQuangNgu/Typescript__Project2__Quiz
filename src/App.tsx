import React, { useRef, createContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRouter, privateRouter } from "./routes";
import { router } from "./model";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "./store/store";
import jwt_decoded from "jwt-decode";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Loading from "./loading/Loading";
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
	setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
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
	const soundRef = useRef<HTMLAudioElement>(null);
	const auth = useAppSelector((state) => state.auth);
	const [loading, setLoading] = useState<boolean>(false);
	useEffect((): void => {
		if (soundRef.current) {
			soundRef.current.volume = 0.2;
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

	let countRef = useRef<boolean>(false);

	const changeSound = () => {
		countRef.current = !countRef.current;
		if (soundRef.current) {
			if (countRef.current) {
				soundRef.current.play();
			} else {
				soundRef.current.pause();
			}
		}
	};
	return (
		<UseContext.Provider
			value={{
				cache: cacheRef,
				role: role,
				result: result,
				musicRef: musicRef,
				setLoading: setLoading,
			}}
		>
			<DragDropContext onDragEnd={onDragEnd}>
				<Router>
					<div className="App">
						<div className="radio__container">
							<audio ref={soundRef} hidden controls autoPlay>
								<source
									src="https://res.cloudinary.com/dgn9bcr5s/video/upload/v1680272888/quiz/Good_day_lofi_ambient_music_-_chill_beats_to_relax-study_to_up6i5j.mp3"
									type="audio/mpeg"
								/>
							</audio>
						</div>
						<div className="radio__sound">
							<div onClick={changeSound}>
								<i className="fa-solid fa-music"></i>
							</div>
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
						{loading && <Loading />}
					</div>
				</Router>
			</DragDropContext>
		</UseContext.Provider>
	);
}

export default App;
