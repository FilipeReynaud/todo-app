import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: JSON.parse(window.sessionStorage.getItem("user")) || null,
	loggedIn: JSON.parse(window.sessionStorage.getItem("loggedIn")) === true,
	collections:
		JSON.parse(window.sessionStorage.getItem("collections")) || null,
	activeCollection:
		JSON.parse(window.sessionStorage.getItem("activeCollection")) || null,
};

const getTaskStatus = (completed) => (completed ? "completed" : "active");

const findTaskById = (tasks, taskId, justIndex) => {
	let taskFound = null;
	const arrayIdx = tasks.findIndex((el) => el.id === taskId);

	if (arrayIdx > -1) {
		taskFound = tasks[arrayIdx];
	}

	return justIndex ? arrayIdx : [taskFound, arrayIdx];
};

export const globalSlice = createSlice({
	name: "globalAppState",
	initialState,
	reducers: {
		logout: (state) => {
			window.sessionStorage.setItem("user", null);
			window.sessionStorage.setItem("loggedIn", JSON.stringify(false));
			window.sessionStorage.setItem("collections", null);
			window.sessionStorage.setItem("activeCollection", null);
			return {
				...state,
				user: null,
				loggedIn: false,
				collections: null,
				activeCollection: null,
			};
		},
		setUser: (state, action) => {
			window.sessionStorage.setItem(
				"user",
				JSON.stringify(action.payload)
			);
			return {
				...state,
				user: action.payload,
			};
		},
		setLoggedIn: (state, action) => {
			window.sessionStorage.setItem("loggedIn", JSON.stringify(true));
			return {
				...state,
				loggedIn: action.payload,
			};
		},
		setActiveCollection: (state, action) => {
			let c = null;
			if (action.payload) {
				c = {
					id: action.payload.id,
					name: action.payload.name,
				};
				window.sessionStorage.setItem(
					"activeCollection",
					JSON.stringify(c)
				);
			} else {
				window.sessionStorage.setItem("activeCollection", null);
			}

			return {
				...state,
				activeCollection: c,
			};
		},
		setCollections: (state, action) => {
			window.sessionStorage.setItem(
				"collections",
				JSON.stringify(action.payload)
			);
			return {
				...state,
				collections: action.payload,
			};
		},
		changeTaskStatus: (state, action) => {
			const prevState = JSON.parse(JSON.stringify(state));
			const new_status = getTaskStatus(action.payload.isCompleted);
			const old_status = getTaskStatus(!action.payload.isCompleted);

			const [task, arrayIdx] = findTaskById(
				prevState.collections[prevState.activeCollection.id].tasks[
					old_status
				],
				action.payload.id
			);

			if (arrayIdx > -1) {
				// Remove from current status
				prevState.collections[prevState.activeCollection.id].tasks[
					old_status
				].splice(arrayIdx, 1);

				// Add to new status
				prevState.collections[prevState.activeCollection.id].tasks[
					new_status
				].push(task);
			}

			return { ...state, collections: prevState.collections };
		},
		createTask: (state, action) => {
			const prevState = JSON.parse(JSON.stringify(state));

			prevState.collections[
				prevState.activeCollection.id
			].tasks.active.push({
				title: action.payload.title,
				id: action.payload.id,
			});

			return { ...state, collections: prevState.collections };
		},
		deleteTask: (state, action) => {
			const prevState = JSON.parse(JSON.stringify(state));
			if (action.payload.id >= 0) {
				const status = getTaskStatus(action.payload.isCompleted);

				const arrayIdx = findTaskById(
					prevState.collections[prevState.activeCollection.id].tasks[
						status
					],
					action.payload.id,
					true
				);
				if (arrayIdx > -1) {
					// Delete
					prevState.collections[prevState.activeCollection.id].tasks[
						status
					].splice(arrayIdx, 1);
				}
			}
			return { ...state, collections: prevState.collections };
		},
		editTask: (state, action) => {
			const prevState = JSON.parse(JSON.stringify(state));
			if (action.payload.id >= 0) {
				const status = getTaskStatus(action.payload.isCompleted);

				const arrayIdx = findTaskById(
					prevState.collections[prevState.activeCollection.id].tasks[
						status
					],
					action.payload.id,
					true
				);

				if (arrayIdx > -1) {
					// Edit task
					prevState.collections[prevState.activeCollection.id].tasks[
						status
					][arrayIdx].title = action.payload.title;
				}
			}
			return { ...state, collections: prevState.collections };
		},
		createCollection: (state, action) => {
			const prevState = JSON.parse(JSON.stringify(state));

			prevState.collections[action.payload.id] = {
				name: action.payload.name,
				tasks: {
					active: [],
					completed: [],
				},
			};

			return { ...state, collections: prevState.collections };
		},
		editCollection: (state, action) => {
			const prevState = JSON.parse(JSON.stringify(state));

			if (action.payload.id >= 0) {
				prevState.collections[action.payload.id].name =
					action.payload.name;
			}

			return {
				...state,
				collections: prevState.collections,
			};
		},
		deleteCollection: (state, action) => {
			const prevState = JSON.parse(JSON.stringify(state));

			if (action.payload.id >= 0) {
				delete prevState.collections[action.payload.id];
			}

			return {
				...state,
				collections: prevState.collections,
			};
		},
	},
});

export const {
	logout,
	setUser,
	setLoggedIn,
	setActiveCollection,
	setCollections,
	changeTaskStatus,
	deleteTask,
	createTask,
	editTask,
	createCollection,
	editCollection,
	deleteCollection,
} = globalSlice.actions;

export default globalSlice.reducer;
