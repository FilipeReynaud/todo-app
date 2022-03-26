import React from "react";

// Routing
import { useNavigate } from "react-router-dom";

// Assets
import SUSELogo from "../assets/SUSE_logo_only_Big.png";

// MUI
import Grow from "@mui/material/Grow";

// Components
import SUSEButton from "../components/Button";

export default function NotFound404() {
	let navigate = useNavigate();
	return (
		<Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={500}>
			<div className="not-found-404">
				<img src={SUSELogo} alt="SUSE Logo" />
				<Grow
					in={true}
					style={{ transformOrigin: "0 0 0" }}
					timeout={1000}
				>
					<div>You went out of sight...</div>
				</Grow>
				<SUSEButton
					variant="delete"
					label="Go Home"
					onClick={() => navigate("/dashboard")}
				/>
			</div>
		</Grow>
	);
}
