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

		if (!url) { console.log(`Invalid url: ${url}`); return null; }

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

		if (!nodeData) { console.log(`Invalid queryReponse: ${queryReponse}`)};

		return nodeData;
	}

	static async setNodeIsStarredValue(nodeId, isStarredValue) {

		if (!nodeId || typeof isStarredValue !== 'boolean') { console.log(`Invalid input: nodeId: ${nodeId} isStarredValue: ${isStarredValue}`); return null; }

		const body = {
			query: `mutation {
				setNodeIsStarredValue(nodeId: "${nodeId}", isStarredValue: ${isStarredValue}) {
					id
					url
					isStarred
				}
			}`
		};

		// Get query results
		const queryResult = (await ServerAPI.sendRequest(body)).data.setNodeIsStarredValue;

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

	static async addNodeVisit(nodeId) {

		if (!nodeId) { console.log("Invalid nodeId: ", nodeId); return null; }

		const body = {
			query: 	`mutation {
				addNodeVisit(nodeId: "${nodeId}") {
					id
					nodeId
					timestamp
				}
			}`
		}

		// Get query results:
		const queryResult = (await ServerAPI.sendRequest(body)).data.addNodeVisit;

		// Populate node visit data using query results
		const nodeVisitData = queryResult ? {
			nodeVisitId: queryResult.id,
			nodeId: queryResult.nodeId,
			timestamp: queryResult.timestamp
		} : null;

		return nodeVisitData;
	}

	static async addNodeVisitToNode(nodeId, nodeVisitId) {

		if (!nodeId || !nodeVisitId) { console.log(`Invalid inputs: nodeId: ${nodeId} nodeVisitId: ${nodeVisitId}`); return null; }

		const body = {
			query: 	`mutation {
				addNodeVisitToNode(nodeId: "${nodeId}", nodeVisitId: "${nodeVisitId}") {
					id
					url 
					isStarred
				}
			}`
		}

		// Get query results from server:
		const queryResult = (await ServerAPI.sendRequest(body)).data.addNodeVisitToNode;

		// Populate node visit data using query results
		const nodeData = queryResult ? {
			nodeId: queryResult.id,
			url: queryResult.url,
			isStarred: queryResult.isStarred
		} : null;

		return nodeData;
	}

	static async addDomCache(nodeVisitId, domCache) {

		if (!nodeVisitId ) { console.log('Invalid nodeVisitId: ', nodeVisitId); return null; }

		const body = {
			query: 	`mutation {
				addDomCache(nodeVisitId: "${nodeVisitId}", domCache: "${escape(domCache)}") {
					id
					domCache
				}
			}`
		};

		// Get query results from server:
		const queryResult = (await ServerAPI.sendRequest(body)).data.addDomCache;

		// Store results:
		const nodeVisitData = queryResult ? {
			nodeVisitId: queryResult.id,
			domCache: queryResult.domCache
		} : null;

		return nodeVisitData;
	}

	static async addFaviconPath(nodeVisitId, faviconPath) {

		if (!nodeVisitId ) { console.log('Invalid nodeVisitId: ', nodeVisitId); return null; }

		const body = {
			query: 	`mutation {
				addFaviconPath(nodeVisitId: "${nodeVisitId}", faviconPath: "${faviconPath}") {
					id
					faviconPath
				}
			}`
		};

		// Get query results from server:
		const queryResult = (await ServerAPI.sendRequest(body)).data.addFaviconPath;

		// Store results:
		const nodeVisitData = queryResult ? {
			nodeVisitId: queryResult.id,
			faviconPath: queryResult.faviconPath
		} : null;

		return nodeVisitData;
	}

	//DEPRECATED
	static async getLastNodeVisit(nodeId) {

		console.warn("DEPRECATED FUNCTION: getLastNodeVisit");

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