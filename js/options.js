import SearchTab from "./SearchTab.js";
import SearchTask from "./SearchTask.js";
import SearchTree from "./SearchTree.js";
import WeblinkTree from "./WeblinkTree.js";
import SearchTabCollection from "./SearchTabCollection.js";
import SearchTaskCollection from "./SearchTaskCollection.js";
import SearchTreeCollection from "./SearchTreeCollection.js";
import WeblinkTreeCollection from "./WeblinkTreeCollection.js";
import { SearchTabState } from "./Enums.js";


let lastHTML = document.body.outerHTML;

console.log("options.js");

const downloadLink = document.getElementById("search-history-download");
downloadLink.addEventListener("click", (e) => {

	// let searchLabel = "page";
	// let labelInput = document.getElementById("topic-label").value;
	// let label = document.getElementById("label");

	// if (labelInput) {
	// 	searchLabel = labelInput;
	// }
	
	// labelInput.style.display = "none";
	// downloadLink.download = labelInput + ".html";
	// downloadLink.setAttribute("download", labelInput + ".html");
	
	downloadLink.href='data:text/html;charset=UTF-8,'+encodeURIComponent(lastHTML);
});

setInterval(() => {

	chrome.runtime.getBackgroundPage((bkg) => {
		console.log("Background: ", bkg);

		let lastSearchTab = bkg.lastSearchTab;
		console.log("Last SearchTab: ", bkg.lastSearchTab);
		let lastSearchTask = bkg.lastSearchTask;
		console.log("Last SearchTask: ", bkg.lastSearchTask);

		let searchTrees = [];
		let numSearchTrees = lastSearchTask.searchTrees.length;
		let count = 0;

		for (let searchTreeUUID of lastSearchTask.searchTrees) {
			SearchTree.get(searchTreeUUID, (searchTree) => {
				searchTrees.push(searchTree);
				tryNext();
			});
		}

		function tryNext() {
			count++;
			if (count == numSearchTrees) {
				console.log("SearchTrees - Orig: ", lastSearchTask.searchTrees);
				console.log("SearchTrees - Reco: ", searchTrees);

				(make_renderTrees(searchTrees))();
			}
		}

	});

	chrome.storage.sync.get(null, (res) => {
		debugger;
		// console.log(res);
	});


}, 1000);




function make_renderTrees(searchTrees, callback) {
	return function() {
		let taskDiv = document.getElementById("SearchTask");
		
		// Remove Children:
		while (taskDiv.children.length > 0) {
		    taskDiv.removeChild(taskDiv.children[0]);
		}

		// Append new children:
		let numSearchTrees;
		let wcount = 0;
		let numToWaitFor = 0;
		for (let tree of searchTrees) {

			let treeDiv = document.createElement("div");
			treeDiv.className = "container";

			let h4 = document.createElement("h4");
			let b = document.createElement("b");
			b.innerHTML = tree.queryString;
			
			for (let wtreeUUID of tree.childNodes) {

				numToWaitFor++;


				WeblinkTree.get(wtreeUUID, (wtree) => {
					wcount++;
					let wtreeDiv = document.createElement("div");
					wtreeDiv.className = "container2";

					let h4 = document.createElement("h4");
					let b = document.createElement("b");
					let a = document.createElement("a");
					a.href = wtree.url;
					a.innerHTML = wtree.url;
					
					b.appendChild(a);
					h4.appendChild(b);
					wtreeDiv.appendChild(h4);
					treeDiv.appendChild(wtreeDiv);

					if (wcount == numToWaitFor) {
						let labelInput = document.getElementById("topic-label").value;
						document.getElementById("label").innerHTML = labelInput;
						if (labelInput) {
							document.getElementById("search-history-download").download = labelInput + ".html";
						}
						lastHTML = document.getElementById("RenderArea").outerHTML;
						debugger;
					}
				});
			}

			h4.appendChild(b);
			treeDiv.appendChild(h4);
			taskDiv.appendChild(treeDiv);
		}
	}
}