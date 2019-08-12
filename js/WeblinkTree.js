import TreeNode from "./TreeNode.js";
import StorageItem from "../js/StorageItem.js";

export default class WeblinkTree extends TreeNode {

	constructor(url) {
		super({url: url});

		this.markups = {
			isStarred: false,
			highlights: null
		}
	}

	toggleIsStarred() {
		this.markups.isStarred = !this.markups.isStarred;
		return this.markups.isStarred;
	}

	get isStarred() {
		return this.markups.isStarred;
	}

	set isStarred(val) {
		this.markups.isStarred = val;
		return this.markups.isStarred;
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