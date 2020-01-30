console.log("Hello world from the background script!");
import { ServerAPI } from "./ServerAPI.js";
import { TabManager } from "./TabManager.js";

const tabManager = new TabManager();
let currentNode = null;


// Switch Focus:
chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log(`Tab activated --> will run tabManager.switchFocus() -- note that the new tab's url may not be set at this point`);
	chrome.tabs.get(activeInfo.tabId, async (tab) => {
		console.log(`Tab retrieved --> tabManager.switchFocus(tabId=${tab.id}, url=${tab.url}) -- note that the new tab's url may not be set at this point`);
		await tabManager.switchFocus(tab.id, tab.url);

		// update content script with tabManager._currentNode.isStarred value
		sendRuntimeMessage.sendIsStarred(tabManager._activeTabId, {isStarred: tabManager._currentNode.isStarred});
		sendRuntimeMessage.getCaches(tabManager._activeTabId, null);

		console.log("Sent a message to tabId: ", tabManager._activeTabId);
	});
});

// Tab closed
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`Tab closed --> tabManager.closeTab(tabId=${tabId})`);
});

// Page loaded:
chrome.webNavigation.onCompleted.addListener(async (info) => {
	console.log(`Page loaded --> tabManager.pageLoaded(tabId=${info.tabId}, url=${info.url})`);
	await tabManager.pageLoaded(info.url);
	sendRuntimeMessage.sendIsStarred(tabManager._activeTabId, {isStarred: tabManager._currentNode.isStarred});
	sendRuntimeMessage.getCaches(tabManager._activeTabId, null);

});

// Tab opened:
chrome.tabs.onCreated.addListener((tab) => {
	console.log(`Tab created --> tabManager.openTab(tabId=${tab.id}) -- note should always run before tabManager.switchFocus() and tabManager.pageLoaded()`);
});

// Tab highlighted
chrome.tabs.onHighlighted.addListener((tab) => {
	console.log(`Tab highlighted --> this event can be triggered for selection of multiple tabs (by holding shift key)`);
});



// SendMessage Function Definitions:
const sendRuntimeMessage = {
	getCaches: (tabId, data) => {
		chrome.tabs.sendMessage(tabId, {id: 'get-cache', data: data}, async (data) => {
			console.log("domCache: ", data.domCache);
			console.log("faviconPath: ", data.faviconPath);
			await tabManager._currentNode.currentNodeVisit.setFaviconPath(data.faviconPath);
			// await tabManager._currentNode.currentNodeVisit.setDomCache(data.domCache);
		});
	},
	sendIsStarred: (tabId, data) => {
		chrome.tabs.sendMessage(tabId, {id: 'send-is-starred', data: data}, {}, ()=>{});
	}, 
}

// ReceiveMessage Function Definitions:
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	console.log("Message received: ", msg);
	if (msg.id == "star-page") {
		// tabManager._currentNode.setIsStarred(!tabManager._currentNode.isStarred);
		(async () => {
			await tabManager._currentNode.setIsStarred(!tabManager._currentNode.isStarred);
			sendResponse({id: 'star-page-response', data: {isStarred: tabManager._currentNode.isStarred}});
		})();
		return true;
	}
});
