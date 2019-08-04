import SearchTab from "./SearchTab.js";
import SearchTask from "./SearchTask.js";
import SearchTabCollection from "./SearchTabCollection.js";
import SearchTaskCollection from "./SearchTaskCollection.js";
import SearchTreeCollection from "./SearchTreeCollection.js";
import WeblinkTreeCollection from "./WeblinkTreeCollection.js";


export default class BackgroundManager {

	constructor() {

		this.SearchTabCollection  = new SearchTabCollection();
		this.SearchTaskCollection = new SearchTaskCollection();
		this.SearchTreeCollection = new SearchTreeCollection();
		this.WeblinkTreeCollection = new WeblinkTreeCollection();
		
		// Register Listeners:
		chrome.tabs.onCreated.addListener((e) => this.handleOnCreated(e));


	}

	handleOnCreated(tab, debug = false) {
		console.log("New tab created: ", tab);

		let debugOutput = {};
		if (debug) { debugOutput["createdNewTask"] = false; }


		// Create SearchTab:

		let chromeTabID = tab.id;
		let searchTab = new SearchTab(chromeTabID);

		this.SearchTabCollection.addSearchTab(chromeTabID, searchTab.UUID);



		console.log("ChromeTabID: ", chromeTabID);
		console.log("New SearchTab: ", searchTab);
		console.log("Added SearchTab to SearchTabCollection: ", this.SearchTabCollection);


		// Create SearchTask: 

		console.log("Previous Opener Tab ID: ", tab.openerTabId);
		let currentSearchTaskAssignment = null;
		if (tab.openerTabId) {
			let previousSearchTabUUID = this.SearchTabCollection.getSearchTabUUID(tab.openerTabId);
			let previousTabTaskUUID = this.SearchTaskCollection.getTaskAssignment(previousSearchTabUUID);

			if (debug) {
				debugOutput["previousSearchTabUUID"] = previousSearchTabUUID;
				debugOutput["previousTabTaskUUID"] = previousTabTaskUUID;
			}

			console.log("Previous Search Tab: ", previousSearchTabUUID);
			console.log("Previous Tab SearchTask: ", previousTabTaskUUID);
			if (previousTabTaskUUID != null) {

				console.warn("TODODODO Implement Get() function using storage");
				// let previousTabTask = SearchTask.get(previousTabTaskUUID);
				currentSearchTaskAssignment = { UUID: previousTabTaskUUID };


				if (debug) {
					// debugOutput["previousTabTask"] = previousTabTask;
				}

				console.log("Determined new tab can use previous tab's search task", currentSearchTaskAssignment);
			}
		}
		if (currentSearchTaskAssignment == null) {
			
			currentSearchTaskAssignment = new SearchTask();
			
			if (debug) { 
				debugOutput["createdNewTask"] = true; 
			}
			
			console.log("Created new search task for new tab", currentSearchTaskAssignment);
		}

		// Create Tab to Task Assignment:
		this.SearchTaskCollection.addTaskAssignment(currentSearchTaskAssignment.UUID, searchTab.UUID);
		console.log("Created Assignment: ", this.SearchTaskCollection);
	
		if (debug) {
			debugOutput["chromeTabID"] = chromeTabID;
			debugOutput["searchTab"] = searchTab;
			debugOutput["previousChromeTabID"] = tab.openerTabId;	
			debugOutput["currentSearchTaskAssignmentUUID"] = currentSearchTaskAssignment.UUID;

		}

		if (debug) {
			return debugOutput
		} 
		else {
			return;
		}

	}






}