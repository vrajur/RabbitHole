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
		chrome.tabs.onCreated.addListener((e) => this.handleOnCreated(e, (res) => console.log("Debug Output: ", res)));


	}


	handleOnCreated(tab, debugCallback) {
		console.log("New tab created: ", tab);

		let debugOutput = {};
		if (debugCallback) { debugOutput["createdNewTask"] = false; }

		let chromeTabID, searchTab, previousSearchTabUUID, previousTabTaskUUID;
		let currentSearchTaskAssignment = null;

		createSearchTab(this); // Executes chain of functions below


		function createSearchTab(f_BackgroundManager) {
			chromeTabID = tab.id;
			searchTab = new SearchTab(chromeTabID);
			searchTab.sync();
			f_BackgroundManager.SearchTabCollection.addSearchTab(chromeTabID, searchTab.UUID);

			if (debugCallback) {
				debugOutput["chromeTabID"] = chromeTabID;
				debugOutput["searchTab"] = searchTab;
				console.log("ChromeTabID: ", chromeTabID);
				console.log("New SearchTab: ", searchTab);
				console.log("Added SearchTab to SearchTabCollection: ", f_BackgroundManager.SearchTabCollection);
			}

			getSearchTask(f_BackgroundManager);
		} // END createSearchTab

		function getSearchTask(f_BackgroundManager) {
			console.log("Previous Opener Tab ID: ", tab.openerTabId);

			if (tab.openerTabId) {
				previousSearchTabUUID = f_BackgroundManager.SearchTabCollection.getSearchTabUUID(tab.openerTabId);
				previousTabTaskUUID = f_BackgroundManager.SearchTaskCollection.getTaskAssignment(previousSearchTabUUID);

				if (debugCallback) {
					debugOutput["previousSearchTabUUID"] = previousSearchTabUUID;
					debugOutput["previousTabTaskUUID"] = previousTabTaskUUID;	
					console.log("Previous Search Tab: ", previousSearchTabUUID);
					console.log("Previous Tab SearchTask: ", previousTabTaskUUID);
				}

				if (previousTabTaskUUID != null) {
					// Get SearchTask using previousTabTaskUUID

					SearchTask.get(previousTabTaskUUID, (previousTabTask) => {
						currentSearchTaskAssignment = previousTabTask;

						if (debugCallback) {
							debugOutput["previousTabTask"] = previousTabTask;
							console.log("Determined new tab can use previous tab's search task", currentSearchTaskAssignment);
						}

						createTabToTaskAssignment(f_BackgroundManager);
					}); // END SearchTask.get()

				} else { 
					createNewSearchTask(); 
				}
			} else { 
				createNewSearchTask(); 
			} // END if (tab.openerTabId)

			function createNewSearchTask() {
				// Create new searchTask for currentTabTask 
				currentSearchTaskAssignment = new SearchTask();
				currentSearchTaskAssignment.sync();

				if (debugCallback) { 
					debugOutput["createdNewTask"] = true; 
					debugOutput["currentSearchTaskAssignmentUUID"] = currentSearchTaskAssignment.UUID;
					console.log("Created new search task for new tab", currentSearchTaskAssignment);
				}

				createTabToTaskAssignment(f_BackgroundManager);

			} // END createNewSearchTask()
		} // END getSearchTask()

		function createTabToTaskAssignment(f_BackgroundManager) {

			f_BackgroundManager.SearchTaskCollection.addTaskAssignment(currentSearchTaskAssignment.UUID, searchTab.UUID);
			if (debugCallback) {
				debugOutput["chromeTabID"] = chromeTabID;
				debugOutput["searchTab"] = searchTab;
				debugOutput["previousChromeTabID"] = tab.openerTabId;	
				debugOutput["currentSearchTaskAssignmentUUID"] = currentSearchTaskAssignment.UUID;
			}

			if (debugCallback) {
				debugCallback(debugOutput);
			}
		} // END createTabToTaskAssignment
	} // END handleOnCreated()


}