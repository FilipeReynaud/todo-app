import React, { useState } from "react";

// PropTypes
import PropTypes from "prop-types";

// Store
import { useSelector, useDispatch } from "react-redux";
import { changeTaskStatus, deleteTask, editTask } from "../globalSlice";

// MUI
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";

// Internal
import Checkbox from "./Checkbox";
import SUSEButton from "./Button";
import DialogFactory from "./DialogFactory";
import Loading from "./Loading";
import { deleteTask as deleteTaskRemote, patchTask } from "../APICalls";
import "./style.css";

export default function TaskCard({
	taskId,
	title,
	type,
	isCompleted,
	nrOfChildTasks,
	nrOfCompletedChildTasks,
}) {
	const user = useSelector((state) => state.app.user);
	const dispatch = useDispatch();
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogInfo, setDialogInfo] = useState({ type: "" });
	const [callingAPI, setCallingAPI] = useState(false);

	const toggleModal = (event) => {
		setOpenDialog((prevState) => !prevState);

		if (event && event.customEvent) {
			if (event.customEvent.name === "delete") {
				const body = {
					user_name: user.username,
				};
				deleteTaskRemote(taskId, body)
					.then((response) => {
						if (response && response[0] === 200) {
							dispatch(
								deleteTask({
									id: taskId,
									isCompleted: isCompleted,
								})
							);
						}
						setCallingAPI(false);
					})
					.catch((error) => {
						console.error(error);
						setCallingAPI(false);
					});
			} else if (event.customEvent.name === "edit") {
				sharedEditFunction(event.customEvent.title, isCompleted);
			}
		}
	};

	const sharedEditFunction = (newTitle, newStatus) => {
		const body = {
			new_title: newTitle,
			user_name: user.username,
			new_status: newStatus,
		};
		patchTask(taskId, body)
			.then((response) => {
				if (response && response[0] === 200) {
					dispatch(
						editTask({
							id: taskId,
							isCompleted: newStatus,
							title: newTitle,
						})
					);
					dispatch(
						changeTaskStatus({
							title: title,
							id: taskId,
							isCompleted: newStatus,
						})
					);
				}
				setCallingAPI(false);
			})
			.catch((error) => {
				console.error(error);
				setCallingAPI(false);
			});
	};

	return callingAPI ? (
		<Loading />
	) : (
		<>
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
					placeholder="Task Name"
				/>
			)}

			<Paper
				className={`${
					isCompleted ? "task-card-completed" : "task-card"
				}`}
				elevation={10}
			>
				<Grid container spacing={2}>
					<Grid
						item
						xxs={6}
						xs={6}
						md={8}
						xl={8}
						className="display-flex-left-imp"
					>
						<Stack
							direction="row"
							className="display-flex-center-imp"
						>
							<Checkbox
								checked={isCompleted}
								className={`${
									isCompleted && "checkbox-completed"
								}`}
								onClick={() => {
									sharedEditFunction(title, !isCompleted);
								}}
							/>
							<span
								className={`task-title ${
									isCompleted &&
									"task-completed task-title-completed"
								}`}
								style={{ marginTop: 0 }}
							>
								{title}
							</span>
						</Stack>
					</Grid>
					<Grid
						key="add-new-task"
						item
						xxs={6}
						xs={6}
						md={4}
						xl={4}
						className="display-flex-right-imp "
					>
						{!isCompleted && (
							<Stack direction="row" style={{ columnGap: "4%" }}>
								<SUSEButton
									label="Edit"
									variant="editWithIcon"
									size="small"
									endIcon={<Edit />}
									onClick={() => {
										setDialogInfo({
											type: "edit",
											title: "Edit Task",
											taskTitle: title,
											description:
												"Edit the details of this task.",
											leftLabel: "Cancel",
											rightLabel: "Save",
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
										setDialogInfo({
											type: "delete",
											title: "Are you sure you want to delete this task?",
											description:
												"This action is permanent. You won't be able to recover this task later. Delete?",
											leftLabel: "No",
											rightLabel: "Yes, I want to delete",
										});
										toggleModal();
									}}
								/>
							</Stack>
						)}
					</Grid>
				</Grid>
			</Paper>
		</>
	);
}

TaskCard.propTypes = {
	title: PropTypes.string,
	type: PropTypes.oneOf(["main", "child"]),
	isCompleted: PropTypes.bool.isRequired,
	nrOfChildTasks: PropTypes.number,
	nrOfCompletedChildTasks: PropTypes.number,
};
