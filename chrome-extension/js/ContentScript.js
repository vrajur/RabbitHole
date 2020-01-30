console.log("hello world from content script");


const div = document.createElement('div');
div.id = "rh-content-overlay";
document.body.prepend(div);

function updateIsStarred(isStarredValue) {
	div.style.opacity = isStarredValue ? 0.25 : 0;
}

chrome.runtime.onMessage.addListener( (msg) => {
	console.log("Message from background script: ", msg);
	if (msg.id == "tab-activated") {
		console.log("isStarred State: ", msg.data.isStarred);
		updateIsStarred(msg.data.isStarred);
	} else if (msg.id == "page-loaded") {
		console.log("isStarred State: ", msg.data.isStarred);
		updateIsStarred(msg.data.isStarred);
	}

});

window.addEventListener('keyup', (e) => {
	if (e.ctrlKey && e.shiftKey && e.key === "S") {
		console.log("Star page!");
		chrome.runtime.sendMessage({id: 'star-page'}, async (e) => {
			console.log("Response from star-page message: ", e);			
			updateIsStarred(e.data.isStarred);
		});
	}
});