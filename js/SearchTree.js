import TreeNode from "./TreeNode.js";
import StorageItem from "./StorageItem.js";
import Utilities from "./Utilities.js";
import { SearchTreeState } from "./Enums.js";


export default class SearchTree extends TreeNode {

	constructor(url, queryString = null) {
		super({url: url});
		this.queryString = queryString;
		this.state = SearchTreeState.IN_PROGRESS_INACTIVE;
	}

	addWeblinkTree(weblinkTreeUUID) {
		return this.childNodes.push(weblinkTreeUUID);
	}

	removeWeblinkTree(weblinkTreeUUID) {
		return this.removeTreeNode(weblinkTreeUUID);
	}

	visited(weblinkTreeUUID) {
		return this.isChild(weblinkTreeUUID);
	}

	queueWeblinkTree(weblinkTreeUUID) {
		return this.queueTreeNode(weblinkTreeUUID);
	}

	dequeueWeblinkTree(weblinkTreeUUID) {
		return this.dequeueTreeNode(weblinkTreeUUID);
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