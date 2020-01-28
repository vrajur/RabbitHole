console.log("Utility functions loaded");

// Query to get all nodes:
const url = "http://localhost:4000/";
const method = "POST";
const headers = {
	"Content-Type": "application/json"
};

async function sendRequest(data) {
	
	console.log("Sending: ", JSON.stringify(data));

	const response = await fetch(url, {
		method: method,
		headers: headers,
		body: JSON.stringify(data)
	});

	return await response.json();
}

export async function getAllNodes() {
	const body = {
		query: `query {
			getAllNodes {
				id
				url
			}
		}`
	};
	
	return (await sendRequest(body)).data.getAllNodes;
}

export async function addNode(url) {

	if (!url) {
		return null;
	}

	const body = {
		query: `mutation {
			addNode(url: "${url}") {
				id
				isStarred
			}
		}`
	}

	return (await sendRequest(body)).data;
}