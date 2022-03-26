import React from "react";

// Routing
import { useNavigate } from "react-router-dom";

// PropTypes
import PropTypes from "prop-types";

// Store
import { useDispatch } from "react-redux";
import { setActiveCollection } from "../globalSlice";

// MUI
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

// Components
import DoughnutChart from "./DoughnutChart";

// Internal
import SUSELogoOnly from "../assets/SUSE_logo_only.png";
import "./style.css";

export default function CollectionCard({
	collectionId,
	collectionName,
	tasksCompleted,
	totalNrTasks,
}) {
	const dispatch = useDispatch();
	let navigate = useNavigate();

	const onCollectionClick = () => {
		dispatch(
			setActiveCollection({
				id: parseInt(collectionId),
				name: collectionName,
			})
		);
		navigate("/collection");
	};

	return (
		<Paper
			className="collection-card"
			elevation={10}
			onClick={onCollectionClick}
		>
			<img
				className="collection-logo"
				src={SUSELogoOnly}
				alt="SUSE Logo"
			/>
			<h4 className="collection-title" style={{ marginTop: 0 }}>
				{collectionName}
			</h4>
			<Grid container spacing={2}>
				<Grid
					item
					xxs={6}
					xs={8}
					md={8}
					xl={8}
					className="display-flex-center-imp"
				>
					<span className="tasks-done" style={{ margin: 0 }}>
						{`${tasksCompleted}/${totalNrTasks} Done`}
					</span>
				</Grid>
				<Grid
					item
					xxs={6}
					xs={4}
					md={4}
					xl={4}
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "flex-end",
					}}
				>
					<DoughnutChart
						dataset={[
							tasksCompleted,
							totalNrTasks - tasksCompleted,
						]}
					/>
				</Grid>
			</Grid>
		</Paper>
	);
}

CollectionCard.propTypes = {
	collectionId: PropTypes.number,
	collectionName: PropTypes.string,
	tasksCompleted: PropTypes.number,
	totalNrTasks: PropTypes.number,
};
