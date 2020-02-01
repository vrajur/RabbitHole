console.log("hello world from content script");

const div = document.createElement('div');
div.id = "rh-content-overlay";
document.body.prepend(div);


function appendDomCache(domCache) {
	let domDiv = document.getElementById('dom-div')
	if (!domDiv) {
		domDiv = document.createElement('div');
		domDiv.id = 'dom-div';
		document.body.prepend(domDiv);
	} 

	if (domDiv.children.length > 0) {
		return;
	}

	// domCache.querySelector("#dom-div").remove();
	debugger;
	domString = domCache.querySelector('body').innerHTML.toString();
	// domDiv.appendChild(domCache);
	let template = document.createElement('div');
	template.innerHTML = unescape(escape(domString))
	domDiv.appendChild(template);
}

function getDomCache() {
	domCache = document.getElementsByTagName('html')[0].cloneNode(true);
	domCache.querySelector("#rh-content-overlay").remove();
	domString = domCache.innerHTML.toString();

	// appendDomCache(domCache); // For testing purposes

	return domString;
}

function getFaviconPath() {
	const hostDomain = window.location.host;
	const faviconPath = `https://www.google.com/s2/favicons?domain=${hostDomain}`
	return faviconPath;

	const faviconElement = document.createElement("img");
	faviconElement.src = faviconPath;
	faviconElement.height = 25;
	faviconElement.width = 25;
	div.appendChild(faviconElement);

}

function getCaches() {
	domCache = getDomCache();
	faviconPath = getFaviconPath();
	console.log("Caches downloaded: ", {dom: domCache, favicon: faviconPath});
	return {
		domCache: domCache,
		faviconPath: faviconPath
	}
}

function updateIsStarred(isStarredValue) {
	div.style.opacity = isStarredValue ? 0.25 : 0;
}



chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {
	console.log("Message from background script: ", msg);
	
	switch (msg.id) {
		case 'send-is-starred': 
			console.log("isStarred State: ", msg.data.isStarred);
			updateIsStarred(msg.data.isStarred);
			break;

		case 'get-cache':
			sendResponse(getCaches());
			break;
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