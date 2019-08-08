import SearchTab from "./SearchTab.js";
import SearchTask from "./SearchTask.js";
import SearchTree from "./SearchTree.js";
import WeblinkTree from "./WeblinkTree.js";
import SearchTabCollection from "./SearchTabCollection.js";
import SearchTaskCollection from "./SearchTaskCollection.js";
import SearchTreeCollection from "./SearchTreeCollection.js";
import WeblinkTreeCollection from "./WeblinkTreeCollection.js";
import { SearchTabState } from "./Enums.js";

export default class BackgroundManager {

	constructor() {

		this.SearchTabCollection  = new SearchTabCollection();
		this.SearchTaskCollection = new SearchTaskCollection();
		this.SearchTreeCollection = new SearchTreeCollection();
		this.WeblinkTreeCollection = new WeblinkTreeCollection();
		
		// Register Listeners:
		chrome.tabs.onCreated.addListener((tab) => this.handleOnCreated(tab, (res) => console.log("[ONCREATED] Debug Output: ", res)));

		chrome.tabs.onUpdated.addListener((tabId) => this.handleOnUpdated(tabId, (res) => console.log("[ONUPDATED] Debug Output: ", res)));
	}


	handleOnCreated(tab, debugCallback) {
		console.log("New tab created: ", tab);

		let debugOutput = {};
		if (debugCallback) { debugOutput["createdNewTask"] = false; }

		let chromeTabID, searchTab, previousSearchTabUUID, previousTabTaskUUID;
		let currentSearchTaskAssignment = null;

		createSearchTab(this); // Executes chain of functions below


		function createSearchTab(f_BackgroundManager) {
			// debugger;
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

			// debugger;

			f_BackgroundManager.SearchTaskCollection.addTaskAssignment(currentSearchTaskAssignment.UUID, searchTab.UUID);

			searchTab.assignedSearchTask = currentSearchTaskAssignment.UUID;
			searchTab.sync();

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

	handleOnUpdated(tabId, debugCallback) {
		console.log("On Updated: ", tabId);

		let debugOutput = {};

		let chromeTab, tabUUID, taskUUID, url, state;
		let searchTab, searchTask=-17, node; 

		getChromeTab(this); // Executes chain of functions below



		function getChromeTab(f_BackgroundManager) {
			debugger;
			chrome.tabs.get(tabId, (tab) => {
				//debugger;
				
				chromeTab = tab;

				if (debugCallback) {
					debugOutput["tab"] = chromeTab;
					console.log("ChromeTab: ", chromeTab);
				}

				getSearchTab(f_BackgroundManager);
			});
		} // END getChromeTab()

		function getSearchTab(f_BackgroundManager) {

			//debugger;

			tabUUID = f_BackgroundManager.SearchTabCollection.getSearchTabUUID(tabId);

			if (tabUUID != null) {
				SearchTab.get(tabUUID, (tab) => {
					// debugger;

					searchTab = tab;

					if (debugCallback) {
						debugOutput["tabUUID"] = tabUUID;
						debugOutput["searchTab"] = searchTab;	
						console.log("Tab UUID: ", tabUUID);
						console.log("SearchTab: ", searchTab);
					}

					getSearchTask(f_BackgroundManager);
				});
			} // END if (tabUUID != null)
		} // END getSearchTab()

		function getSearchTask(f_BackgroundManager) {

			//debugger;
			
			taskUUID = f_BackgroundManager.SearchTaskCollection.getTaskAssignment(tabUUID);

			if (taskUUID != null) {
				SearchTask.get(taskUUID, (task) => {
					//debugger;

					searchTask = task;

					if (debugCallback) {
						debugOutput["taskUUID"] = taskUUID;	
						debugOutput["searchTask"] = searchTask;	
						console.log("Task UUID: ", taskUUID);
						console.log("SearchTask: ", searchTask);
					}

					getTabState(f_BackgroundManager);
				}); 
			} // END if (task != null)
		} // END getSearchTask()

		function getTabState(f_BackgroundManager) {

			// debugger; //searchTask
			
			const url = chromeTab.url;
			let isNew, isQuery, tabState;

			if (debugCallback) {
				debugOutput["url"] = url;
				console.log("Url: ", url);
			}

			chrome.history.search({text:url}, (historyItems) => {
				isNew = historyItems.length == 0;
				isQuery = url.includes("google.com/search?q=");	 // Put this logic somewhere else

				if (isNew && isQuery) {
					state = SearchTabState.ON_NEW_SEARCH_PAGE;
				} else if (isNew && !isQuery) {
					state = SearchTabState.ON_NEW_WEBLINK_PAGE;
				} else if (!isNew && isQuery) {
					state = SearchTabState.ON_OLD_SEARCH_PAGE;
				} else if (!isNew && !isQuery) {
					state = SearchTabState.ON_OLD_WEBLINK_PAGE;
				} else {
					state = SearchTabState.NONE; // Should never get here
				}

				if (debugCallback) {
					debugOutput["tabState"] = state;
					console.log("Tab State: ", state);
				}

				handleTabState(f_BackgroundManager);

			});
		} // END getTabState()

		function handleTabState(f_BackgroundManager) {

			debugger; // searchTask;
			
			searchTab.previousState = searchTab.currentState;
			searchTab.currentState = state;

			switch (state) {

				case SearchTabState.ON_NEW_SEARCH_PAGE:
					let query = document.getElementsByClassName("gLFyf gsfi")[0].value;	// Get query
					node = new SearchTree(url, query);									// Create new SearchTree
					searchTask.addSearchTree(node.UUID);								// Add to SearchTask
					searchTab.activeSearchTree = node;									// Set activeSearchTree for Tab
					if (debugCallback) {
						debugOutput["query"] = node.queryString();
						console.log("Search Query: ", node.queryString());
					}
					debugger;
					finish();															// Finish
					break;

				case SearchTabState.ON_NEW_WEBLINK_PAGE:
					node = new WeblinkTree(url);										// Create new WeblinkTree
					SearchTree.get(searchTask.activeSearchTree, (searchTree) => {		// Get activeSearchTree
						//debugger;
						searchTree.addWeblinkTree(node.UUID);							// Add WeblinkTree to SearchTree
						searchTree.sync();												// Update SearchTree
						searchTab.activeWeblinkTree = node.UUID;						// Set activeWeblinkTree for Tab
						debugger;
						finish();														// Finish
					});
					break;
				case SearchTabState.ON_OLD_SEARCH_PAGE:
					// Get old SearchTree 
					// TODO Use SearchTreeCollection to look up by query
					finish();															// Finish
					break;
				case SearchTabState.ON_OLD_WEBLINK_PAGE:
					// Get old WeblinkTree 
					// TODO Use WeblinkTreeCollection to look up by Url
					finish();															// Finish
					break;

				default:
					console.error("Unknown Tab State: ", state);
					finish();
			}

			function finish() {

				// debugger; 

				searchTask.sync();
				searchTab.sync();

				if (node != undefined) {
					node.sync();
					
					if (debugCallback) {
						debugOutput["nodeType"] = node.constructor.name;
						console.log("Node Type: ", node.constructor.name);
					}
				}

				// TEMPORARY: Save current searchTab:
				chrome.storage.sync.set({"lastSearchTab": searchTab.UUID}, () => {
					console.log("lastSearchTab: ", searchTab.UUID);
				});

				chrome.storage.sync.get("lastSearchTab", (searchTabUUID) => {
					console.log("TEST - lastSearchTab Retreival: ", searchTabUUID);
				});

				window.lastSearchTab = searchTab;
				window.lastSearchTask = searchTask;

				if (debugCallback) {
					debugOutput["searchTab"] = searchTab;
					debugOutput["searchTask"] = searchTask;

					console.log("Search Tab: ", searchTab);
					console.log("Search Task: ", searchTask);

					debugCallback(debugOutput);
				}
			} // END finish()
		} // END handleTabState()
	} // END handleOnUpdated()

}