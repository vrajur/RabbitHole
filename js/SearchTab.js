import { SearchTabState } from "./Enums.js";
import Utilities from "./Utilities.js";



export default class SearchTab {

	constructor(chromeTabID) {
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


	sync() {
		console.log("Chrome: ", chrome.storage);
		debugger;
	}

}