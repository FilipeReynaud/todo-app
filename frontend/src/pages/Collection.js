import React, { useState, useEffect } from "react";

// Routing
import { useNavigate } from "react-router-dom";

// Store
import { useSelector, useDispatch } from "react-redux";
import {
	createTask,
	deleteCollection,
	editCollection,
	setActiveCollection,
} from "../globalSlice";

// MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";

// Components
import TaskCard from "../components/TaskCard";
import SUSEButton from "../components/Button";
import DialogFactory from "../components/DialogFactory";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

// Internal
import {
	createTask as createTaskRemote,
	deleteCollection as deleteCollectionRemote,
	editCollection as editCollectionRemote,
} from "../APICalls";

export default function Collection(props) {
	let navigate = useNavigate();
	const user = useSelector((state) => state.app.user);
	const activeCollection = useSelector((state) => state.app.activeCollection);
	const collections = useSelector((state) => state.app.collections);
	const dispatch = useDispatch();
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogInfo, setDialogInfo] = useState({ type: "" });
	const [callingAPI, setCallingAPI] = useState(false);
	const [entity, setEntity] = useState(null);

	useEffect(() => {
		// Safe measure
		if (!activeCollection) {
			navigate("/dashboard");
		}
	}, [activeCollection]);

	const toggleModal = (event) => {
		setOpenDialog((prevState) => !prevState);

		if (event && event.customEvent) {
			if (event.customEvent.name === "create") {
				createEntity(event.customEvent.title);
			} else if (event.customEvent.name === "delete") {
				deleteEntity();
			} else if (event.customEvent.name === "edit") {
				editEntity(event.customEvent.title);
			}
		}
	};

	const createEntity = (title) => {
		if (entity === "task") {
			const body = {
				title: title,
				task_type: 1,
				collection_id: parseInt(activeCollection.id),
				user_name: user.username,
			};

			createTaskRemote(body)
				.then((response) => {
					if (response && response[0] === 201) {
						let id = response[1];
						dispatch(
							createTask({
								title: title,
								id: id,
							})
						);
					}
					setCallingAPI(false);
				})
				.catch((error) => {
					console.error(error);
					setCallingAPI(false);
				});
		}
	};

	const deleteEntity = () => {
		if (entity === "collection") {
			const body = {
				user_name: user.username,
				collection_id: activeCollection.id,
			};
			deleteCollectionRemote(body)
				.then((response) => {
					if (response && response[0] === 200) {
						dispatch(setActiveCollection(null));
						dispatch(
							deleteCollection({
								id: activeCollection.id,
							})
						);
					}
					setCallingAPI(false);
				})
				.catch((error) => {
					console.error(error);
					setCallingAPI(false);
				});
		}
	};

	const editEntity = (title) => {
		if (entity === "collection") {
			const body = {
				user_name: user.username,
				collection_id: activeCollection.id,
				new_name: title,
			};
			editCollectionRemote(body)
				.then((response) => {
					if (response && response[0] === 200) {
						dispatch(
							editCollection({
								id: activeCollection.id,
								name: title,
							})
						);
						dispatch(
							setActiveCollection({
								id: activeCollection.id,
								name: title,
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
	};

	const render = () => {
		if (callingAPI) {
			return <Loading />;
		} else if (
			activeCollection &&
			collections[activeCollection.id].tasks.active.length === 0 &&
			collections[activeCollection.id].tasks.completed.length === 0
		) {
			return <EmptyState page="collection" />;
		} else if (
			activeCollection &&
			(collections[activeCollection.id].tasks.active.length !== 0 ||
				collections[activeCollection.id].tasks.completed.length !== 0)
		) {
			return (
				<Box className="dashboard-main-box">
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
							placeholder={dialogInfo.placeholder}
						/>
					)}
					<Stack
						direction="row"
						style={{ columnGap: "2%", alignItems: "center" }}
					>
						<h5>{activeCollection.name}</h5>
						<div style={{ display: "flex", columnGap: "1%" }}>
							<SUSEButton
								label="Edit"
								variant="editWithIcon"
								size="small"
								endIcon={<Edit />}
								onClick={() => {
									setEntity("collection");
									setDialogInfo({
										type: "edit",
										title: "Edit Collection",
										description:
											"Edit the details of this collection.",
										leftLabel: "Cancel",
										rightLabel: "Save",
										placeholder: "Collection Name",
										taskTitle: activeCollection.name, // We should rename this key...
									});
									toggleModal();
								}}
							/>
							<SUSEButton
								label="Delete"
								variant="deleteWithIcon"
								size="small"
								endIcon={<Delete />}
								onClick={() => {
									setEntity("collection");
									setDialogInfo({
										type: "delete",
										title: "Are you sure you want to delete this Collection?",
										description:
											"This action is permanent. You won't be able to recover the tasks that belong to this collection. Delete?",
										leftLabel: "No",
										rightLabel: "Yes, I want to delete",
									});
									toggleModal();
								}}
							/>
						</div>
					</Stack>
					<Grid container spacing={2} className="dashboard-grid">
						<Grid
							key="add-new-task"
							item
							xxs={12}
							xs={12}
							md={12}
							xl={12}
							className="display-flex-center-imp"
						>
							<Paper className="add-task-card" elevation={0}>
								<Stack
									direction="row"
									style={{
										alignItems: "center",
										columnGap: 15,
									}}
								>
									<SUSEButton
										variant="contained"
										label={<Add />}
										onClick={() => {
											setEntity("task");
											setDialogInfo({
												type: "create",
												title: "Create Task",
												description:
													"Add your new todo.",
												leftLabel: "Cancel",
												rightLabel: "Create",
												placeholder: "Task Name",
											});
											toggleModal();
										}}
									/>
									<span className="add-task-label">
										Add a task
									</span>
								</Stack>
							</Paper>
						</Grid>
						<Grid item xxs={12} xs={12} md={12} xl={12}>
							<span className="status-label">{`Tasks - ${
								collections[activeCollection.id].tasks.active
									.length
							}`}</span>
						</Grid>
						{collections[activeCollection.id].tasks.active.map(
							(task) => (
								<Grid
									key={`${task.id} - ${task.title}`}
									item
									xs={12}
									md={12}
									xl={12}
									className="display-flex-center-imp"
								>
									<TaskCard
										title={task.title}
										taskId={task.id}
										isCompleted={false}
									/>
								</Grid>
							)
						)}
						<Grid
							item
							xs={12}
							md={12}
							xl={12}
							style={{ marginTop: "5%" }}
						>
							<span className="status-label">{`Completed - ${
								collections[activeCollection.id].tasks.completed
									.length
							}`}</span>
						</Grid>
						{collections[activeCollection.id].tasks.completed.map(
							(task) => (
								<Grid
									key={`${task.id} - ${task.title}`}
									item
									xxs={12}
									xs={12}
									md={12}
									xl={12}
									className="display-flex-center-imp"
								>
									<TaskCard
										title={task.title}
										taskId={task.id}
										isCompleted={true}
									/>
								</Grid>
							)
						)}
					</Grid>
				</Box>
			);
		} else {
			// This will trigger the navigate
			return null;
		}
	};

	return render();
}
