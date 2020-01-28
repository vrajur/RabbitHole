console.log("Hello world from the background script!");
import * as Utils from './Utils.js';


const nodeDirectory = {};
let currentNode = null;



// Immediately Executed Function
// (async () => {
// 	let nodes = await getAllNodes();
// 	console.log(`getAllNodes: `, nodes);


// 	let node = await addNode();
// 	console.log(`addNode: `, node);

// })();


chrome.webNavigation.onCompleted.addListener(async (e) => {
	let node = await Utils.addNode(e.url);
	console.log("Added Node: ", node);
	currentNode = node;
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