// console.log("Hello from popup.js");

// const COLOR_OPTIONS = {0: '', 1: 'yellow'};
// let colorState = COLOR_OPTIONS[0];

// // const messageChannel = chrome.runtime.connect({name: "Background Script Communication Channel"});
// // messageChannel.postMessage("handshake");



// // const button = document.getElementById('flag-page');
// // button.addEventListener('mouseup', () => {
// // 	console.log("Pushed button");
// // 	messageChannel.postMessage("Pushed button");
// // });

// chrome.runtime.onMessage.addListener( (msg) => {
// 	console.log("Message from background script: ", msg);
// 	if (msg.id == "tab-activated") {
// 		console.log("isStarred State: ", msg.data.isStarred);
// 	}
// });