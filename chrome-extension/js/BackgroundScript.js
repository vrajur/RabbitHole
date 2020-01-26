console.log("Hello world from the background script!");

let currentNode = null;

// Query to get all nodes:
const url = "http://localhost:4000/";
const method = "POST";
const headers = {
	"Content-Type": "application/json"
};

async function sendRequest(data) {
	
	console.log("Sending: ", JSON.stringify(data));

	const response = await fetch(url, {
		method: method,
		headers: headers,
		body: JSON.stringify(data)
	});

	return await response.json();
}

async function getAllNodes() {
	const body = {
		query: `query {
			getAllNodes {
				id
				url
			}
		}`
	};
	
	return (await sendRequest(body)).data.getAllNodes;
}

async function addNode(url) {

	if (!url) {
		return null;
	}

	const body = {
		query: `mutation {
			addNode(url: "${url}") {
				id
				isStarred
			}
		}`
	}

	return (await sendRequest(body)).data;
}

// Immediately Executed Function
// (async () => {
// 	let nodes = await getAllNodes();
// 	console.log(`getAllNodes: `, nodes);


// 	let node = await addNode();
// 	console.log(`addNode: `, node);

// })();


chrome.webNavigation.onCompleted.addListener(async (e) => {
	let node = await addNode(e.url);
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