import React from "react";

// Routing
import { Navigate } from "react-router-dom";

// PropTypes
import PropTypes from "prop-types";

export default function ProtectedRoute({
	children,
	loggedIn,
	redirectPath = "/login",
}) {
	if (!loggedIn) {
		return <Navigate to={redirectPath} replace />;
	} else {
		return children;
	}
}

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
	loggedIn: PropTypes.bool.isRequired,
	redirectPath: PropTypes.string,
};
