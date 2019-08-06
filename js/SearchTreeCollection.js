import StorageItem from "./StorageItem.js";
import Utilities from "./Utilities.js";


export default class SearchTreeCollection extends StorageItem {

	constructor() {
		super();
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
		return this.searchTrees.includes(searchTreeUUID);
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