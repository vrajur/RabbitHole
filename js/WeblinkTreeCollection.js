import StorageItem from "../js/StorageItem.js";
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