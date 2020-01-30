console.log("Hello world from the background script!");
import { ServerAPI } from "./ServerAPI.js";
import { TabManager } from "./TabManager.js";

const tabManager = new TabManager();
let currentNode = null;


// Immediately Executed Function
// (async () => {
// 	let nodes = await getAllNodes();
// 	console.log(`getAllNodes: `, nodes);


// 	let node = await addNode();
// 	console.log(`addNode: `, node);

// })();


// chrome.webNavigation.onCompleted.addListener(async (e) => {
// 	let node = await ServerAPI.addNode(e.url);
// 	console.log("Added Node: ", node);
// 	currentNode = node;
// });


// Switch Focus:
chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log(`Tab activated --> will run tabManager.switchFocus() -- note that the new tab's url may not be set at this point`);
	chrome.tabs.get(activeInfo.tabId, async (tab) => {
		console.log(`Tab retrieved --> tabManager.switchFocus(tabId=${tab.id}, url=${tab.url}) -- note that the new tab's url may not be set at this point`);
		await tabManager.switchFocus(tab.id, tab.url);

		// update content script with tabManager._currentNode.isStarred value
		chrome.tabs.sendMessage(tabManager._activeTabId, {id: "tab-activated", data: {isStarred: tabManager._currentNode.isStarred}});
		console.log("Sent a message to tabId: ", tabManager._activeTabId);
	});
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`Tab closed --> tabManager.closeTab(tabId=${tabId})`);
});

chrome.webNavigation.onCompleted.addListener(async (info) => {
	console.log(`Page loaded --> tabManager.pageLoaded(tabId=${info.tabId}, url=${info.url})`);
	await tabManager.pageLoaded(info.url);
	chrome.tabs.sendMessage(tabManager._activeTabId, {id: "page-loaded", data: {isStarred: tabManager._currentNode.isStarred}});

});

chrome.tabs.onCreated.addListener((tab) => {
	console.log(`Tab created --> tabManager.openTab(tabId=${tab.id}) -- note should always run before tabManager.switchFocus() and tabManager.pageLoaded()`);
});

chrome.tabs.onHighlighted.addListener((tab) => {
	console.log(`Tab highlighted --> this event can be triggered for selection of multiple tabs (by holding shift key)`);
});


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


// chrome.extension.onConnect.addListener(function(port) {
// 	console.log("Connected .....");
//     port.onMessage.addListener(function(msg) {
//     	console.log("message recieved:" + msg);

//     	if (msg == 'handshake') {
//     		port.postMessage({msg: 'node-state', data: currentNode});
//     	}
//         port.postMessage("Hi Popup.js");
//     });
// });