import Utilities from "./Utilities.js";


export default class WeblinkTreeCollection  {

	constructor() {
		this.weblinkTrees = [];
	}


	addSearchTree(weblinkTreeUUID) {
		return this.weblinkTrees.push(weblinkTreeUUID);
	}

	removeSearchTree(weblinkTreeUUID) {
		let idx = this.weblinkTrees.indexOf(weblinkTreeUUID);
		if (idx > -1) {
			this.weblinkTrees.splice(idx, 1);
			return true;
		}
		else {
			return false;
		}
	}

	exists(weblinkTreeUUID) {
		return this.weblinkTrees.includes(weblinkTreeUUID);
	}

	sync() {
		debugger;
	}

}