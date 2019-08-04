import SearchTab from "./SearchTab.js";


export default class SearchTabCollection {

	constructor() {
		this._chromeID2UUID = {};
		this._UUID2chromeID = {};
	}

	chromeTabExists(chromeTabID) {
		console.warn("Test this");
		return chromeTabID in this._chromeID2UUID;
	}

	searchTabExists(searchTabUUID) {
		console.warn("Test this");
		return searchTabUUID in this._UUID2chromeID;
	}

	addSearchTab(chromeTabID, searchTabUUID) {
		console.warn("Test this");
		if (searchTabUUID in this._UUID2chromeID) {
			return false;
		}
		else {
			this._UUID2chromeID[searchTabUUID] = chromeTabID;
			this._chromeID2UUID[chromeTabID] = searchTabUUID;
			return true;
		}
	}

	removeSearchTab(chromeTabID) {
		console.warn("Test this");
		//TODO ERROR CHECK

		let searchTabUUID = this._chromeID2UUID[chromeTabID];
		delete this._chromeID2UUID[chromeTabID];
		delete this._UUID2chromeID[searchTabUUID];
	}

	getSearchTabUUID(chromeTabID) {
		console.warn("Test this");
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