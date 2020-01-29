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
		let result = await response.json();
		if (result.errors) {
			result.errors.forEach((e) => {
				console.trace();
				console.error("Error: ", e)
			});
		}
		return result;
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
		const queryResult = (await ServerAPI.sendRequest(body)).data.getOrCreateNode;

		// Populate Node Data using Query Results:
		const nodeData = queryResult ? {
			nodeId: queryResult.id,
			url: queryResult.url,
			isStarred: queryResult.isStarred,
		} : null;

		return nodeData;
	}

	static async getLastNodeVisitId(nodeId) {

		if (!nodeId) { return null; }
		
		const body = {
			query: `query {
				getLastNodeVisitId(nodeId: "${nodeId}")
			}`
		}

		// Get query results
		const queryResult = (await ServerAPI.sendRequest(body)).data.getLastNodeVisitId;
		debugger;

		return queryResult ? queryResult : null;
	}

	static async getNodeVisit(nodeVisitId) {
	
		if (!nodeVisitId) { return null; }

		const body = {
			query: 	`query {
				getNodeVisit(nodeVisitId: "${nodeVisitId}") {
					id
					nodeId
					timestamp
				}
			}`
		}

		// Get query results
		const queryResult = (await ServerAPI.sendRequest(body)).data.getNodeVisit;

		// Populate node visit data using query results
		const nodeVisitData = queryResult ? {
			nodeVisitId: queryResult.id,
			nodeId: queryResult.nodeId,
			timestamp: queryResult.timestamp
		} : null;

		return nodeVisitData;
	}


	//DEPRECATED
	static async getLastNodeVisit(nodeId) {

		console.log("DEPRECATED FUNCTION: getLastNodeVisit");

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
			debugger;
		}

		return nodeVisitData;
	}

}