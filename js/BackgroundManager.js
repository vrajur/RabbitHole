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
		chrome.tabs.onCreated.addListener((e) => this.handleOnCreatedNew(e, (res) => console.log("Debug Output: ", res)));


	}


	handleOnCreatedNew(tab, debugCallback) {
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

			debugger; // debugCallback, debugOutput, f_BackgroundManager

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

			debugger; // tab, debugCallback, f_BackgroundManager, debugOutput

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

						debugger; // f_BackgroundManager, debugCallback, debugOutput

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

				debugger; // debugCallback, debugCallback

				if (debugCallback) { 
					debugOutput["createdNewTask"] = true; 
					debugOutput["currentSearchTaskAssignmentUUID"] = currentSearchTaskAssignment.UUID;
					console.log("Created new search task for new tab", currentSearchTaskAssignment);
				}

				createTabToTaskAssignment(f_BackgroundManager);

			} // END createNewSearchTask()
		} // END getSearchTask()
		
		function createTabToTaskAssignment(f_BackgroundManager) {

			debugger; // f_BackgroundManager, debugCallback, debugOutput

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
	} // END handleOnCreatedNew()



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

				SearchTask.get(previousTabTaskUUID, (previousTabTask) => {
					currentSearchTaskAssignment = previousTabTask;
					if (debug) {
						debugOutput["previousTabTask"] = previousTabTask;
					}
					console.log("Determined new tab can use previous tab's search task", currentSearchTaskAssignment);

					debugger;
					createTabToTaskAssignment(this);
				});
			}
		}
		if (currentSearchTaskAssignment == null) {
			
			currentSearchTaskAssignment = new SearchTask();
			currentSearchTaskAssignment.sync();
			
			if (debug) { 
				debugOutput["createdNewTask"] = true; 
			}
			
			console.log("Created new search task for new tab", currentSearchTaskAssignment);

			createTabToTaskAssignment(this);
		}

		function createTabToTaskAssignment(Manager) {

			debugger; 

			// Create Tab to Task Assignment:
			Manager.SearchTaskCollection.addTaskAssignment(currentSearchTaskAssignment.UUID, searchTab.UUID);
			console.log("Created Assignment: ", Manager.SearchTaskCollection);
		
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
		} // End createTabToTaskAssignment()
	}






}