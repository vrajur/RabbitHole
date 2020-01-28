import { ServerAPI } from "./ServerAPI.js";

class TabManager {

	constructor() {
		this._nodeDirectory = {}; // Mapping of tabs to nodes (nodes contain visits)
		this._activeTabId = null;
		this._currentNode = null;
	}

	async getNode(url) {
		let node = new Node();
		await node.initialize();
		return node;
	}

	switchFocus(tabId) {
		this._activeTabId = tabId;
		this._currentVisit = this._nodeDirectory[this._activeTabId];
	}

	async pageLoaded(url) {
		// get current node
		// get most recent visits (or history of visits)
		this._currentNode = await getNode(url);
		this._nodeDirectory[this._activeTabId] = this._currentNode;
	}

	openTab(tabId) {
		// create new visit and node (get if exists)
		// add new tabId to directory
		this._activeTabId = tabId;
		this._currentNode = 
		this._nodeDirectory[this._activeTabId] = 
	}
}

class Node {

	constructor(url) {
		this._nodeId = null;
		this._url = null;
		this._previousNodeVisit = null;
		this._isStarred = false;
	}

	async initialize(data) {
		// Query node_id, isStarred, previousVisitId from server
		let previousNodeVisitId;

		// Get Previous visit information from server
		this._previousNodeVisit = new NodeVisit();
		this._previousNodeVisit.initalize(previousVisitId);

		// Store retrieved fields in newly created node object
	}

}

class NodeVisit {
	constructor() {
		this._nodeId = null;
		this._nodeVisitId = null;
		this._timestamp = null;
	}

	async initialize(nodeVisitId) {
		// Query timestamp from server
	}


}