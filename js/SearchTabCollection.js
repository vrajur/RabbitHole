import SearchTab from "./SearchTab.js";
import StorageItem from "./StorageItem.js";


export default class SearchTabCollection extends StorageItem {

	constructor() {
		super();
		this._chromeID2UUID = {};
		this._UUID2chromeID = {};
	}

	addSearchTab(chromeTabID, searchTabUUID) {
		if (searchTabUUID in this._UUID2chromeID || chromeTabID in this._chromeID2UUID) {
			return false;
		}
		else {
			this._UUID2chromeID[searchTabUUID] = chromeTabID;
			this._chromeID2UUID[chromeTabID] = searchTabUUID;
			return true;
		}
	}

	chromeTabExists(chromeTabID) {
		return chromeTabID in this._chromeID2UUID;
	}

	searchTabExists(searchTabUUID) {
		return searchTabUUID in this._UUID2chromeID;
	}

	removeSearchTab(chromeTabID) {
		//TODO ERROR CHECK

		if (chromeTabID in this._chromeID2UUID) {
			let searchTabUUID = this._chromeID2UUID[chromeTabID];
			delete this._chromeID2UUID[chromeTabID];
			delete this._UUID2chromeID[searchTabUUID];
			return true;
		} 
		else {
			return false;
		}
	}

	getSearchTabUUID(chromeTabID) {
		if (!this.chromeTabExists(chromeTabID)) {
			return null;
		}
		else {
			return this._chromeID2UUID[chromeTabID];
		}
	}

	getChromeTabID(searchTabUUID) {
		if (!this.searchTabExists(searchTabUUID)) {
			return null;
		}
		else {
			return this._UUID2chromeID[searchTabUUID];
		}
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