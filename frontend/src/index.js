import React from "react";
import ReactDOM from "react-dom";

// Routing
import { BrowserRouter as Router } from "react-router-dom";

// Store
import { store } from "./store";
import { Provider } from "react-redux";

// Internal
import "./index.css";
import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<Router forceRefresh={true}>
			<Provider store={store}>
				<App />
			</Provider>
		</Router>
	</React.StrictMode>,
	document.getElementById("root")
);
