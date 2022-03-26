import React from "react";

// Routing
import { Routes, Route } from "react-router-dom";

// Store
import { useSelector } from "react-redux";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import NotFound404 from "./pages/NotFound404";

// Components
import TopBar from "./components/TopBar";
import ProtectedRoute from "./components/ProtectedRoute";

// Styles
import "./App.css";

function App() {
	const loggedIn = useSelector((state) => state.app.loggedIn);

	return (
		<div className="App">
			<TopBar />
			<Routes>
				<Route exact path="/login" element={<Login />} />
				<Route exact path="/signup" element={<SignUp />} />
				<Route
					exact
					path="/dashboard"
					element={
						<ProtectedRoute loggedIn={loggedIn}>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					exact
					path="/collection"
					element={
						<ProtectedRoute loggedIn={loggedIn}>
							<Collection />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/"
					element={
						<ProtectedRoute loggedIn={loggedIn}>
							<Collection />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<NotFound404 />} />
			</Routes>
		</div>
	);
}

export default App;
