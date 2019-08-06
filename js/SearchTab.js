import { SearchTabState } from "./Enums.js";
import StorageItem from "./StorageItem.js";
import Utilities from "./Utilities.js";



export default class SearchTab extends StorageItem {

	constructor(chromeTabID) {
		super();
		this.UUID = Utilities.uuidv4();
		this.chromeTabID = chromeTabID;
		this.isActive = true;
		this.assignedSearchTask = null;
		this.urlHistory = null;

		this.currentState = SearchTabState.NONE;
		this.previousState = SearchTabState.NONE;

		this.activeSearchTree = null;
		this.activeWeblinkTree = null;
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