import Utilities from "./Utilities.js";
import StorageItem from "./StorageItem.js";


export default class SearchTask extends StorageItem {

	constructor() {
		super();
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

	sync(callback) {
		const tag = this.constructor.name;
		StorageItem.set(tag, this, callback);
	}

	static get(UUID, callback) {
		StorageItem.get(this.name, UUID, (res) => {
			const key = StorageItem.getKey(this.name, UUID);
			let obj = new this();
			obj = Object.assign(obj, res[key]);
			callback(obj);
		});
	} 

	static set(obj, callback) {
		if (obj.constructor.name != this.name) {
			console.error("Invalid object passed to subclassed StorageItem.set(): ", obj);
			return -1;
		}
		StorageItem.set(this.name, obj, callback);
	} 

}