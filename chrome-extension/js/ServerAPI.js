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
		};

		return (await ServerAPI.sendRequest(body)).data.addNode;
	}

	static async getOrCreateNodeDataWithoutVisits(url) {

		if (!url) { return null; }

		const body = {
			query: `mutation {
				getOrCreateNode(url: "${url}") {
					id
					url
					isStarred
				}
			}`
		};

		// Get query results
		let nodeData = null;
		const queryResult = (await ServerAPI.sendRequest(body)).data.getOrCreateNode;

		// Populate Node Data using Query Results:
		if (queryResult) {
			nodeData = {
				nodeId: null,
				url: null,
				isStarred: null,
			};

			debugger;
			nodeData.nodeId = queryResult.id;
			nodeData.url = queryResult.url;
			nodeData.isStarred = queryResult.isStarred;
		}

		return nodeData;
	}

	static async getLastNodeVisitId(nodeId) {

		if (!nodeId) { return null; }
		
		const body = {
			query: `query {
				getLastNodeVisitId(nodeId: "${nodeId}") { 
					id
				}
			}`
		}

		// Get query results
		const queryResult = (await ServerAPI.sendRequest(body)).data.getLastNodeVisitId;

		return queryResult ? queryResult.id : null;
	}

	static async getNodeVisit(nodeVisitId) {
		
	}

	static async getLastNodeVisit(nodeId) {

		if (!nodeId) { return null; }

		const body = {
			query: `query {
				getLastNodeVisit(nodeId: "${nodeId}") {
					id
					nodeId
					timestamp
				}
			}`
		};

		// Get query results
		let nodeVisitData = null;
		const queryResult = (await ServerAPI.sendRequest(body)).data.getLastNodeVisit;

		// Populate Node Visit Data using Query Results:
		if (queryResult) {
			
			nodeVisitData = {
				nodeId: null,
				nodeVisitId: null,
				timestamp: null
			}

			nodeVisitData.nodeVisitId = id;
			nodeVisitData.nodeId = queryResult.nodeId;
			nodeVisitData.timestamp = queryResult.timestamp;
		}

		return nodeVisitData;
	}

}