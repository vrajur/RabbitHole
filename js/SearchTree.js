import Utilities from "./Utilities.js";
import { SearchTreeState } from "./Enums.js";


export default class SearchTree {

	constructor(queryString) {
		this.UUID = Utilities.uuidv4();
		this.queryString = queryString;
		this.weblinkTreeNodes = [];
		this.weblinkQueue = [];
		this.state = SearchTreeState.IN_PROGRESS_INACTIVE;

		this.metadata = {
			date: new Date(),
			location: null
		}
	}

	addWeblinkTree(weblinkTreeUUID) {
		return this.weblinkTreeNodes.push(weblinkTreeUUID);
	}

	removeWeblinkTree(weblinkTreeUUID) {
		let idx = this.weblinkTreeNodes.indexOf(weblinkTreeUUID);
		if (idx > -1) {
			this.weblinkTreeNodes.splice(idx, 1);
			return true;
		} 
		else {
			return false;
		}
	}

	visited(weblinkTreeUUID) {
		return weblinkTreeUUID in this.weblinkTreeNodes;
	}

	inQueue(weblinkTreeUUID) {
		return weblinkTreeUUID in this.weblinkQueue;
	}

	queueWeblinkTree(weblinkTreeUUID) {
		return this.weblinkQueue.push(weblinkTreeUUID);
	}

	removeFromQueue(weblinkTreeUUID) {
		let idx = this.weblinkQueue.indexOf(weblinkTreeUUID);
		if (idx > -1) {
			this.weblinkQueue.splice(idx, 1);
			return true;
		} 
		else {
			return false;
		}
	}

	dequeueWeblinkTree(weblinkTreeUUID) {
		if (this.removeFromQueue(weblinkTreeUUID)) {
			this.addWeblinkTree(weblinkTreeUUID);
			return true;
		} 
		else { 
			return false;
		}
	}

	sync() {
		debugger; 
	}

}