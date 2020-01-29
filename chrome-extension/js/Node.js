import { ServerAPI } from "./ServerAPI.js";

export class Node {

	constructor() {
		this._nodeId = null;
		this._url = null;
		this._isStarred = null;
		this._currentNodeVisit = null;
	}

	async initialize(url) {
		// Query node data from server
		const nodeData = await ServerAPI.getOrCreateNodeDataWithoutVisits(url);

		// Store retrieved fields in newly created node object
		this._nodeId = nodeData.nodeId;
		this._url = nodeData.url;
		this._isStarred = nodeData.isStarred;

		// Create new node visit:
		const nodeVisit = new NodeVisit();
		await nodeVisit.initialize(this._nodeId);
		await this.addNodeVisit(nodeVisit);
	}

	async addNodeVisit(nodeVisit) {
		await ServerAPI.addNodeVisitToNode(this._nodeId, nodeVisit._nodeVisitId);
		this._currentNodeVisit = nodeVisit; // TODO this should use information returned by the server
	}

	async setIsStarred(isStarredValue) {
		const nodeData = await ServerAPI.setNodeIsStarredValue(this._nodeId, isStarredValue);
		this._isStarred = nodeData.isStarred;
	}

	get nodeId() {
		return this._nodeId;
	}

	get url() {
		return this._url;
	}

	get isStarred() {
		return this._isStarred;
	}

	get currentNodeVisit() {
		return this._currentNodeVisit;
	}

	get timestamp() {
		return this._currentNodeVisit.timestamp;
	}
}

export class NodeVisit {
	constructor() {
		this._nodeVisitId = null;
		this._nodeId = null;
		this._timestamp = null;
	}

 	/**
 	NodeVisit.initialize():
 		This function should initialize an empty nodeVisit by setting the following fields:
 		 - NodeVisitId
 		 - NodeId
 		 - Timestamp
		This data should also be synced to the server.

 	Example: 
 		const visit = new NodeVisit();
 		visit.initialize(nodeId) --> nodeVisitId, nodeId and timestamp generated, and synced with server
 	*/
	async initialize(nodeId) {
		// Get newly created nodeVisitData from server:
		const nodeVisitData = await ServerAPI.addNodeVisit(nodeId);

		// Store results:
		this._nodeVisitId = nodeVisitData.nodeVisitId;
		this._nodeId = nodeVisitData.nodeId;
		this._timestamp = nodeVisitData.timestamp;
	}

	get nodeVisitId() {
		return this._nodeVisitId;
	}

	get nodeId() {
		return this._nodeId;
	}

	get timestamp() {
		return this._timestamp;
	}

	/**
	NodeVisit.populateFromPreviousNodeVisit():
		This function should populate a node visit with data from a previous visit, in particular:
		 - Markups
		 - ActionEvents
	*/
	async populateFromPreviousNodeVisit(previousNodeVisitId) {
		// TODO 
	}
}