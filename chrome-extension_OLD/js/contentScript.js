console.log("Content Script with messaging");


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

	debugger; 
	if (msg.message == "queryRequest") {
		let query = document.getElementsByClassName("gLFyf gsfi")[0].value;	// Get query
		sendResponse(query);
	}


});

