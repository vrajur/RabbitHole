console.log("Testing Browser Extension Events");



function onCreated(newTab) {
	console.log("On Created: ", newTab);
}
function onUpdated(tabId) {
	console.log("On Updated: ", tabId);
	chrome.tabs.get(tabId, (tab) => {
		console.log("Updated Tab URL: ", tab.url);
	});
}
function onMoved(tab) {
	console.log("On Moved: ", tab);
}
function onSelectionChanged(tab) {
	console.log("On SelectionChanged: ", tab);
}
function onActiveChanged(tab) {
	console.log("On ActiveChanged: ", tab);
}
function onActivated(tab) {
	console.log("On Activated: ", tab);
}
function onHighlightChanged(tab) {
	console.log("On HighlightChanged: ", tab);
}
function onHighlighted(tab) {
	console.log("On Highlighted: ", tab);
}
function onDetached(tab) {
	console.log("On Detached: ", tab);
}
function onAttached(tab) {
	console.log("On Attached: ", tab);
}
function onRemoved(tab) {
	console.log("On Removed: ", tab);
}
function onReplaced(tab) {
	console.log("On Replaced: ", tab);
}
function onZoomChange(tab) {
	console.log("On ZoomChange: ", tab);
}

chrome.tabs.onCreated.addListener((e) => onCreated(e));
chrome.tabs.onUpdated.addListener((e) => onUpdated(e));
chrome.tabs.onMoved.addListener((e) => onMoved(e));
chrome.tabs.onSelectionChanged.addListener((e) => onSelectionChanged(e));
chrome.tabs.onActiveChanged.addListener((e) => onActiveChanged(e));
chrome.tabs.onActivated.addListener((e) => onActivated(e));
chrome.tabs.onHighlightChanged.addListener((e) => onHighlightChanged(e));
chrome.tabs.onHighlighted.addListener((e) => onHighlighted(e));
chrome.tabs.onDetached.addListener((e) => onDetached(e));
chrome.tabs.onAttached.addListener((e) => onAttached(e));
chrome.tabs.onRemoved.addListener((e) => onRemoved(e));
chrome.tabs.onReplaced.addListener((e) => onReplaced(e));
chrome.tabs.onZoomChange.addListener((e) => onZoomChange(e));
