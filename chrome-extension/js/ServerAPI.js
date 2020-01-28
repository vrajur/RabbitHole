export class ServerAPI {

	static _url = "http://localhost:4000/";
	static _method = "POST";
	static _headers = {
		"Content-Type": "application/json"
	};

	static async sendRequest(data) {
		const response = await fetch(ServerAPI._url, {
			method: ServerAPI._method,
			headers: ServerAPI._headers,
			body: JSON.stringify(data)
		});
		return await response.json();
	}

	static async getAllNodes() {
		const body = {
			query: `query {
				getAllNodes {
					id
					url
				}
			}`
		};
		return (await ServerAPI.sendRequest(body)).data.getAllNodes;
	}

	static async addNode(url) {

		if (!url) { return null; }

		const body = {
			query: `mutation {
				addNode(url: "${url}") {
					id
					url
					isStarred
				}
			}`
		}

		return (await ServerAPI.sendRequest(body)).data.addNode;
	}

	static async getOrCreateNode(url) {

		// TODO 

	}

}