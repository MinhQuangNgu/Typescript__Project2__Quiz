import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

let persistor = persistStore(store);
axios.defaults.baseURL = "http://localhost:5000";
root.render(
	<Provider store={store}>
		<React.StrictMode>
			<PersistGate persistor={persistor} loading={null}>
				<App />
			</PersistGate>
		</React.StrictMode>
	</Provider>
);
