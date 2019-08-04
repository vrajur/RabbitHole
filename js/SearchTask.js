import Utilities from "./Utilities.js";


export default class SearchTask {

	constructor() {
		this.UUID = Utilities.uuidv4();
		this.searchTrees = [];
		this.searchQueue = new Set();
		this.assignedTabs = [];
	}


	addSearchTree(searchTreeUUID) {
		return this.searchTrees.push(searchTreeUUID);
	}

	removeSearchTree(searchTreeUUID) {
		let idx = this.searchTrees.indexOf(searchTreeUUID);
		if (idx > -1) {
			this.searchTrees.splice(idx, 1);
			return true;
		}
		else {
			return false;
		}
	}

	exists(searchTreeUUID) {
		return this.searchTrees.includes(searchTreeUUID);
	}

	queueSearchTree(searchTreeUUID) {
		this.searchQueue.add(searchTreeUUID);
	}

	removeFromQueue(searchTreeUUID) {
		if (this.searchQueue.has(searchTreeUUID)) {
			this.searchQueue.delete(searchTreeUUID);
			return true;
		}
		else {
			return false;
		}
	}

	dequeueSearchTree(searchTreeUUID) {
		if (this.removeFromQueue(searchTreeUUID)) {
			this.addSearchTree(searchTreeUUID);
			return true;
		} 
		else { 
			return false;
		}
	}

	isQueued(searchTreeUUID) {
		return this.searchQueue.has(searchTreeUUID);
	}


	sync() {
		console.warn("Test this");
		debugger;
	}

}