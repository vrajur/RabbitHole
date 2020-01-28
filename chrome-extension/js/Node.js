import { ServerAPI } from "./ServerAPI.js";

export class Node {

	constructor() {
		this._nodeId = null;
		this._url = null;
		this._previousNodeVisit = null;
		this._isStarred = null;
	}

	async initialize(url) {
		// Query node data from server
		const nodeData = await ServerAPI.getOrCreateNodeDataWithoutVisits(url);

		// Store retrieved fields in newly created node object
		debugger;
		this._nodeId = nodeData.nodeId;
		this._url = nodeData.url;
		this._isStarred = nodeData.isStarred;

		// Populate node with previous node visit data:
		const previousNodeVisitId = await ServerAPI.getLastNodeVisitId(nodeData.nodeId);
		this._previousNodeVisit = new NodeVisit();
		this._previousNodeVisit.initalize(previousNodeVisitId);
	}

}

export class NodeVisit {
	constructor() {
		this._nodeId = null;
		this._nodeVisitId = null;
		this._timestamp = null;
	}

	async initialize(nodeVisitId) {
		// Query timestamp from server
	}


}