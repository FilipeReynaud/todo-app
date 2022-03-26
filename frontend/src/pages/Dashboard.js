import React, { useState, useEffect } from "react";

// Routing
import { useNavigate } from "react-router-dom";

// Store
import { useSelector, useDispatch } from "react-redux";
import { createCollection, setCollections, logout } from "../globalSlice";

// MUI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Add from "@mui/icons-material/Add";
import Grow from "@mui/material/Grow";

// Components
import CollectionCard from "../components/CollectionCard";
import DialogFactory from "../components/DialogFactory";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

// Internal
import {
	fetchCollections,
	createCollection as createCollectionRemote,
} from "../APICalls";

export default function Dashboard() {
	let navigate = useNavigate();
	const collections = useSelector((state) => state.app.collections);
	const user = useSelector((state) => state.app.user);
	const dispatch = useDispatch();
	const [callingAPI, setCallingAPI] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogInfo, setDialogInfo] = useState({ type: "" });

	useEffect(() => {
		// Safe measure
		if (!user) {
			dispatch(logout());
			navigate("/login");
		} else {
			preparePageData();
		}
	}, []);

	const preparePageData = () => {
		setCallingAPI(true);
		fetchCollections(user.username)
			.then((response) => {
				if (response && response[0] === 200) {
					dispatch(setCollections(response[1]));
				}
				setTimeout(() => {
					setCallingAPI(false);
				}, 500);
			})
			.catch((error) => {
				console.error(error);
				setTimeout(() => {
					setCallingAPI(false);
				}, 500);
			});
	};

	const toggleModal = (event) => {
		setOpenDialog((prevState) => !prevState);

		if (event && event.customEvent) {
			if (event.customEvent.name === "create") {
				setCallingAPI(true);

				const body = {
					user_id: parseInt(user.id),
					name: event.customEvent.title,
				};

				createCollectionRemote(body)
					.then((response) => {
						if (response && response[0] === 201) {
							let id = response[1];
							dispatch(
								createCollection({
									name: event.customEvent.title,
									id: id,
								})
							);
						}
						setTimeout(() => {
							setCallingAPI(false);
						}, 500);
					})
					.catch((error) => {
						console.error(error);
						setCallingAPI(false);
					});
			}
		}
	};

	const render = () => {
		if (callingAPI) {
			return <Loading />;
		} else if (collections && Object.keys(collections).length === 0) {
			return <EmptyState page="dashboard" />;
		} else if (collections && Object.keys(collections).length !== 0) {
			return (
				<Box className="dashboard-main-box">
					<h3>Collections</h3>
					{openDialog && (
						<DialogFactory
							type={dialogInfo.type}
							title={dialogInfo.title}
							taskTitle={dialogInfo.taskTitle}
							description={dialogInfo.description}
							leftLabel={dialogInfo.leftLabel}
							rightLabel={dialogInfo.rightLabel}
							isOpen={openDialog}
							handleClose={toggleModal}
							placeholder="Collection Name"
						/>
					)}
					<Grow in={true}>
						<Grid container spacing={3} className="dashboard-grid">
							{Object.keys(collections).map((collectionId) => (
								<Grid
									key={`grid-collection-${collectionId}`}
									item
									xxs={12}
									xs={6}
									md={3}
									xl={3}
									className="display-flex-center-imp"
								>
									<CollectionCard
										collectionId={parseInt(collectionId)}
										collectionName={
											collections[collectionId].name
										}
										tasksCompleted={
											collections[collectionId].tasks
												.completed.length
										}
										totalNrTasks={
											collections[collectionId].tasks
												.active.length +
											collections[collectionId].tasks
												.completed.length
										}
									/>
								</Grid>
							))}
							<Grid
								item
								xxs={12}
								xs={6}
								md={3}
								xl={3}
								className="display-flex-center-imp"
							>
								<Grow
									in={true}
									style={{ transformOrigin: "0 0 0" }}
									timeout={1000}
								>
									<Paper
										className="add-collection-card"
										elevation={2}
										onClick={() => {
											setDialogInfo({
												type: "create",
												title: "Create Collection",
												description:
													"Create a new category for future tasks",
												leftLabel: "Cancel",
												rightLabel: "Create",
											});
											toggleModal();
										}}
									>
										<Add className="collection-add-icon" />
									</Paper>
								</Grow>
							</Grid>
						</Grid>
					</Grow>
				</Box>
			);
		}
	};

	return render();
}
