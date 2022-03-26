import React, { useState, forwardRef } from "react";

// PropTypes
import PropTypes from "prop-types";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

// Internal
import SUSEButton from "./Button";
import SUSETextField from "./TextField";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

function DeleteDialog({
	isOpen,
	title,
	description,
	handleClose,
	leftLabel,
	rightLabel,
}) {
	return (
		<div>
			<Dialog
				open={isOpen}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>
					<span>{title}</span>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<span>{description}</span>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<SUSEButton
						label={leftLabel}
						variant="contained"
						size="medium"
						onClick={handleClose}
					/>
					<SUSEButton
						label={rightLabel}
						variant="delete"
						size="medium"
						onClick={(ev) =>
							handleClose({
								...ev,
								customEvent: {
									name: "delete",
								},
							})
						}
					/>
				</DialogActions>
			</Dialog>
		</div>
	);
}

function EditDialog({
	isOpen,
	title,
	taskTitle,
	description,
	handleClose,
	leftLabel,
	rightLabel,
	placeholder,
}) {
	const [value, setValue] = useState({
		name: taskTitle,
		error: false,
	});

	const onChangeHandler = (ev) => {
		setValue((prevState) => ({
			...prevState,
			name: ev.target.value,
			error: false,
		}));
	};

	return (
		<div>
			<Dialog
				open={isOpen}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>
					<span>{title}</span>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<span>{description}</span>
					</DialogContentText>
					<SUSETextField
						id="name"
						label={placeholder}
						variant="filled"
						style={{ maxWidth: "100%" }}
						value={value.name}
						onChange={onChangeHandler}
						error={value.error}
						helperText={value.error && "Incorrect entry."}
					/>
				</DialogContent>
				<DialogActions>
					<SUSEButton
						label={leftLabel}
						variant="textPrimary"
						size="medium"
						onClick={handleClose}
					/>
					<SUSEButton
						label={rightLabel}
						variant="contained"
						size="medium"
						onClick={(ev) => {
							if (value.name && !value.error) {
								handleClose({
									...ev,
									customEvent: {
										name: "edit",
										title: value.name,
									},
								});
							} else {
								setValue((prevState) => ({
									...prevState,
									error: true,
								}));
							}
						}}
					/>
				</DialogActions>
			</Dialog>
		</div>
	);
}

function CreateDialog({
	isOpen,
	title,
	description,
	handleClose,
	leftLabel,
	rightLabel,
	placeholder,
}) {
	const [value, setValue] = useState({
		name: "",
		error: false,
	});

	const onChangeHandler = (ev) => {
		setValue((prevState) => ({
			...prevState,
			name: ev.target.value,
			error: false,
		}));
	};

	return (
		<div>
			<Dialog
				open={isOpen}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>
					<span>{title}</span>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<span>{description}</span>
					</DialogContentText>
					<SUSETextField
						id="name"
						label={placeholder}
						variant="filled"
						style={{ maxWidth: "100%" }}
						value={value.name}
						onChange={onChangeHandler}
						error={value.error}
						helperText={value.error && "Incorrect entry."}
					/>
				</DialogContent>
				<DialogActions>
					<SUSEButton
						label={leftLabel}
						variant="textPrimary"
						size="medium"
						onClick={handleClose}
					/>
					<SUSEButton
						label={rightLabel}
						variant="contained"
						size="medium"
						onClick={(ev) => {
							if (value.name && !value.error) {
								handleClose({
									...ev,
									customEvent: {
										name: "create",
										title: value.name,
									},
								});
							} else {
								setValue((prevState) => ({
									...prevState,
									error: true,
								}));
							}
						}}
					/>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default function DialogFactory({ type, ...props }) {
	if (type === "create") {
		return CreateDialog(props);
	} else if (type === "delete") {
		return DeleteDialog(props);
	} else if (type === "edit") {
		return EditDialog(props);
	} else if (type === "") {
		// Default
		return null;
	} else {
		throw new Error("Unknown Dialog type");
	}
}

DialogFactory.propTypes = {
	type: PropTypes.oneOf(["create", "delete", "edit", ""]).isRequired,
};

CreateDialog.propTypes = {
	props: PropTypes.exact({
		isOpen: PropTypes.bool,
		title: PropTypes.string,
		description: PropTypes.string,
		handleClose: PropTypes.func,
		leftLabel: PropTypes.string,
		rightLabel: PropTypes.string,
		placeholder: PropTypes.string,
	}).isRequired,
};

DeleteDialog.propTypes = {
	props: PropTypes.exact({
		isOpen: PropTypes.bool,
		title: PropTypes.string,
		description: PropTypes.string,
		handleClose: PropTypes.func,
		leftLabel: PropTypes.string,
		rightLabel: PropTypes.string,
	}).isRequired,
};

EditDialog.propTypes = {
	props: PropTypes.exact({
		isOpen: PropTypes.bool,
		title: PropTypes.string,
		taskTitle: PropTypes.string,
		description: PropTypes.string,
		handleClose: PropTypes.func,
		leftLabel: PropTypes.string,
		rightLabel: PropTypes.string,
		placeholder: PropTypes.string,
	}).isRequired,
};
