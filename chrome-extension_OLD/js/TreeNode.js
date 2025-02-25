import StorageItem from "./StorageItem.js";
import Utilities from "./Utilities.js";

export default class TreeNode extends StorageItem {

	constructor({url = null, childNodes = [], childQueue = [], prevNode = null, nextNode = null, location = null} = {}) {
		super();
		this.UUID = Utilities.uuidv4();
		this.url = url;

		this.childNodes = childNodes;
		this.childQueue = childQueue;

		this.prevNode = prevNode;
		this.nextNode = nextNode;

		this.metadata = {
			date: new Date(),
			location: location
		};
	}

	addTreeNode(treeNodeUUID) {
		return this.childNodes.push(treeNodeUUID);
	}

	removeTreeNode(treeNodeUUID) {
		let idx = this.childNodes.indexOf(treeNodeUUID);
		if (idx > -1) {
			this.childNodes.splice(idx, 1);
			return true;
		} 
		else {
			return false;
		}
	}

	isChild(treeNodeUUID) {
		return this.childNodes.includes(treeNodeUUID);
	}

	queueTreeNode(treeNodeUUID) {
		return this.childQueue.push(treeNodeUUID);
	}

	removeFromQueue(treeNodeUUID) {
		let idx = this.childQueue.indexOf(treeNodeUUID);
		if (idx > -1) {
			this.childQueue.splice(idx, 1);
			return true;
		} 
		else {
			return false;
		}
	}

	dequeueTreeNode(treeNodeUUID) {
		if (this.removeFromQueue(treeNodeUUID)) {
			this.addTreeNode(treeNodeUUID);
			return true;
		} 
		else { 
			return false;
		}
	}

	isQueued(treeNodeUUID) {
		return this.childQueue.includes(treeNodeUUID);
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