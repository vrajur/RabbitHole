console.log("Hello from popup.js");

// const COLOR_OPTIONS = {0: '', 1: 'yellow'};
// let colorState = COLOR_OPTIONS[0];

// const port = chrome.extension.connect({name: "Background Script Communication Channel"});
// port.postMessage("handshake");


// const button = document.getElementById('flag-page');
// button.addEventListener('mouseup', () => {
// 	console.log("Pushed button");
// 	port.postMessage("Pushed button");
// });

// port.onMessage.addListener( (mesg) => {
// 	console.log("Message from background script: ", mesg);
// 	if (mesg.msg == "node-state") {
// 		console.log("Node: ", mesg.data.isStarred);
// 	}
// });