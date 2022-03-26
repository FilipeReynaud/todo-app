import React from "react";

// Routing
import { Link, useLocation } from "react-router-dom";

// Store
import { useDispatch } from "react-redux";
import { logout } from "../globalSlice";

// MUI
import Paper from "@mui/material/Paper";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Dashboard from "@mui/icons-material/Dashboard";
import List from "@mui/icons-material/List";

// Internal
import "./style.css";
import { PROTECTED_ROUTES } from "../data/constants";

function Icon({ src, ...props }) {
	if (src === "Dashboard") {
		return <Dashboard {...props} />;
	} else if (src === "Collection") {
		return <List {...props} />;
	} else {
		return null;
	}
}

export default function TopBar() {
	const dispatch = useDispatch();
	let location = useLocation();
	const links = [];

	if (!PROTECTED_ROUTES.includes(location.pathname)) {
		if (location.pathname === "/collection") {
			links.push(
				{ name: "Dashboard", pathname: "/dashboard" },
				{ name: "Collection", pathname: "/collection" }
			);
		} else {
			links.push({ name: "Dashboard", pathname: "/dashboard" });
		}
	}

	return (
		links.length !== 0 && (
			<Paper className="top-bar" elevation={3}>
				<Breadcrumbs
					aria-label="breadcrumb"
					style={{ marginLeft: 25, color: "white" }}
				>
					{links.map((link, idx) => (
						<Link
							key={`link-${idx}`}
							to={link.pathname}
							className="top-bar-link"
						>
							<Icon
								src={link.name}
								sx={{ mr: 0.8, color: "white" }}
								fontSize="inherit"
							/>
							<span>{link.name}</span>
						</Link>
					))}
				</Breadcrumbs>
				<Link
					key={`link-logout`}
					to={"/"}
					className="top-bar-link"
					onClick={() => dispatch(logout())}
				>
					<span style={{ marginRight: 15 }}>Logout</span>
				</Link>
			</Paper>
		)
	);
}
