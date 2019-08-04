import Utilties from "./Utilities.js";


export default class SearchTask {

	constructor() {
		this.UUID = Utilties.uuidv4();
		this.searchTrees = [];
		this.searchQueue = new Set();
	}


	addSearchTree(searchTreeUUID) {
		this.searchTrees.push(searchTreeUUID);
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
		return searchTreeUUID in this.searchTrees;
	}

	inQueue(searchTreeUUID) {
		return searchTreeUUID in this.searchQueue;
	}

	removeFromQueue(searchTreeUUID) {
		let idx = this.searchQueue.indexOf(searchTreeUUID);
		if (idx > -1) {
			this.searchQueue.splice(idx, 1);
			return true;
		} 
		else {
			return false;
		}
	}

	dequeue(searchTreeUUID) {
		if (this.removeFromQueue(searchTreeUUID)) {
			this.addWeblinkTree(searchTreeUUID);
			return true;
		} 
		else { 
			return false;
		}
	}

	sync() {
		console.warn("Test this");
		debugger;
	}

}