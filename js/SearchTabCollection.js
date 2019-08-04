import SearchTab from "./SearchTab.js";


export default class SearchTabCollection {

	constructor() {
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
		console.warn("Test this");
		if (!this.searchTabExists(searchTabUUID)) {
			return null;
		}
		else {
			return this._UUID2chromeID[searchTabUUID];
		}
	}

	sync() {
		console.warn("Test this");
		debugger;
	}
}