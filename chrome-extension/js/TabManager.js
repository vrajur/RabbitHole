import { Node, NodeVisit } from "./Node.js";

export class TabManager {

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
