import { Node, NodeVisit } from "./Node.js";

export class TabManager {

	constructor() {
		this._nodeDirectory = {}; // Mapping of tabs to nodes (nodes contain visits)
		this._activeTabId = null;
		this._currentNode = null;
	}

	async getNode(url) {
		let node = new Node();
		await node.initialize(url);
		return node;
	}

	async switchFocus(tabId, url) {
		this._activeTabId = tabId;
		this._currentNode = this._nodeDirectory[this._activeTabId];
		if (url && !this._currentNode) {
			this._currentNode = await this.getNode(url);
			this._nodeDirectory[this._activeTabId] = this._currentNode;
			console.log("switch focus has fetched node: ", this._currentNode);
		}
		console.log("TabManager SwitchFocus: new node: ", this._currentNode);
	}

	async pageLoaded(url) {
		// get current node
		// get most recent visits (or history of visits)
		this._currentNode = await this.getNode(url);
		this._nodeDirectory[this._activeTabId] = this._currentNode;
		console.log("TabManager PageLoaded: new node: ", this._currentNode);

	}

	openTab(tabId) {
		// create new visit and node (get if exists)
		// add new tabId to directory
		this._activeTabId = tabId;
		this._nodeDirectory[this._activeTabId] = null;
		this._currentNode = null;
	}

	closeTab(tabId) {
		delete this._nodeDirectory[this._activeTabId];
	}
}
