import { API_URL } from "./data/constants";

export async function fetchUser(userName) {
	try {
		let response = await fetch(`${API_URL}/users/${userName}`);

		let jsonResponse = await response.json();
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}

export async function createUser(body) {
	try {
		let response = await fetch(`${API_URL}/users`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		});

		let jsonResponse = await response.json();
		if (jsonResponse.error) {
			return [response.status, jsonResponse.error];
		}
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}

export async function fetchCollections(userName) {
	try {
		let response = await fetch(`${API_URL}/collections/${userName}`);

		let jsonResponse = await response.json();
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}

export async function createCollection(collection) {
	try {
		let response = await fetch(`${API_URL}/collections`, {
			method: "POST",
			body: JSON.stringify(collection),
			headers: {
				"Content-Type": "application/json",
			},
		});

		let jsonResponse = await response.json();
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}

export async function deleteCollection(collection) {
	try {
		let response = await fetch(`${API_URL}/collections`, {
			method: "DELETE",
			body: JSON.stringify(collection),
			headers: {
				"Content-Type": "application/json",
			},
		});

		let jsonResponse = await response.json();
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}

export async function editCollection(collection) {
	try {
		let response = await fetch(`${API_URL}/collections`, {
			method: "PATCH",
			body: JSON.stringify(collection),
			headers: {
				"Content-Type": "application/json",
			},
		});

		let jsonResponse = await response.json();
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}

export async function createTask(task) {
	try {
		let response = await fetch(`${API_URL}/tasks`, {
			method: "POST",
			body: JSON.stringify(task),
			headers: {
				"Content-Type": "application/json",
			},
		});

		let jsonResponse = await response.json();
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}

export async function deleteTask(taskId, body) {
	try {
		let response = await fetch(`${API_URL}/tasks/${taskId}`, {
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		});

		let jsonResponse = await response.json();
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}

export async function patchTask(taskId, body) {
	try {
		let response = await fetch(`${API_URL}/tasks/${taskId}`, {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		});

		let jsonResponse = await response.json();
		return [response.status, jsonResponse.results];
	} catch (error) {
		console.error(error);
	}
}
