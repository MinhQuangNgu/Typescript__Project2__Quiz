import Dashboard from "../components/admin/Dashboard";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import History from "../components/history/History";
import HomePage from "../components/homePage/HomePage";
import QuizDetail from "../components/quizDetail/QuizDetail";
import { router } from "../model";
export const publicRouter: router[] = [
	{ path: "/", element: HomePage },
	{ path: "/login", element: Login },
	{ path: "/register", element: Register },
	{ path: "/history", element: History },
	{ path: "/quizDetail/:slug", element: QuizDetail },
];

export const privateRouter: router[] = [
	{
		path: "/admin",
		element: Dashboard,
	},
];
