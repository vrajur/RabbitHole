import Utilities from "./Utilities.js";


export default class SearchTreeCollection  {

	constructor() {
		this.searchTrees = [];
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
		return searchTreeUUID in this.searchTrees;
	}

	sync() {
		debugger;
	}

}