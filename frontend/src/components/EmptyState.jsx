import React, { useState, useEffect } from "react";

// PropTypes
import PropTypes from "prop-types";

// Store
import { useSelector, useDispatch } from "react-redux";
import { createCollection, createTask } from "../globalSlice";

// MUI
import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

// Components
import SUSEButton from "./Button";
import DialogFactory from "./DialogFactory";
import Loading from "./Loading";

// Assets
import EmptyDashboardImg from "../assets/Empty_Dashboard.svg";
import EmptyCollectionImg from "../assets/Empty_Collection.svg";

// Internal
import {
	createCollection as createCollectionRemote,
	createTask as createTaskRemote,
} from "../APICalls";

export default function EmptyState({ page }) {
	const user = useSelector((state) => state.app.user);
	const activeCollection = useSelector((state) => state.app.activeCollection);

	const dispatch = useDispatch();
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogInfo, setDialogInfo] = useState({ type: "" });

	const [pageInfo, setPageInfo] = useState({});
	const [callingAPI, setCallingAPI] = useState(false);

	useEffect(() => {
		let mounted = true;

		if (mounted) {
			const info = getSpecificInfo();

			if (info) {
				setPageInfo({ title: info[0], desc: info[1], img: info[2] });
			}
		}
		return () => {
			mounted = false;
		};
	}, []);

	const toggleModal = (event) => {
		setOpenDialog((prevState) => !prevState);

		if (event && event.customEvent) {
			if (event.customEvent.name === "create") {
				createEntity(event.customEvent.title);
			}
		}
	};

	const createEntity = (title) => {
		setCallingAPI(true);
		if (page === "dashboard") {
			const body = {
				name: title,
				user_id: user.id,
			};
			createCollectionRemote(body)
				.then((response) => {
					if (response && response[0] === 201) {
						let id = response[1];
						dispatch(createCollection({ name: title, id: id }));
					}
					setCallingAPI(false);
				})
				.catch((error) => {
					console.error(error);
					setCallingAPI(false);
				});
		} else if (page === "collection") {
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
						dispatch(createTask({ title: title, id: id }));
					}
					setCallingAPI(false);
				})
				.catch((error) => {
					console.error(error);
					setCallingAPI(false);
				});
		} else {
			setCallingAPI(false);
			throw new Error("Unknown page type");
		}
	};

	const getSpecificInfo = () => {
		if (page === "dashboard") {
			return [
				"Collection",
				"Create a new category for future tasks",
				EmptyDashboardImg,
			];
		} else if (page === "collection") {
			return ["Task", "Add your new todo.", EmptyCollectionImg];
		} else {
			throw new Error("Unknown page type");
		}
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
					placeholder={dialogInfo.placeholder}
				/>
			)}
			<Box
				className="dashboard-main-box display-flex-center-imp"
				style={{ flexDirection: "column", rowGap: 20 }}
			>
				<div style={{ height: "50%", width: "50%" }}>
					<img
						src={pageInfo.img}
						alt="Empty State Logo"
						className="empty-state-logo"
					/>
				</div>
				<span>
					It seems that you don't have any {getSpecificInfo()[0]} yet.
					Start by creating a new one!
				</span>
				<SUSEButton
					variant="contained"
					label={
						<>
							<Add /> Create new {getSpecificInfo()[0]}
						</>
					}
					onClick={() => {
						setDialogInfo({
							type: "create",
							title: `Create ${pageInfo.title}`,
							description: pageInfo.desc,
							leftLabel: "Cancel",
							rightLabel: "Create",
							placeholder: `${pageInfo.title} Name`,
						});
						toggleModal();
					}}
				/>
			</Box>
		</>
	);
}

EmptyState.prototypes = {
	page: PropTypes.oneOf(["dashboard", "collection"]).isRequired,
};
