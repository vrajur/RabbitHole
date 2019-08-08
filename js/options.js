import SearchTab from "./SearchTab.js";
import SearchTask from "./SearchTask.js";
import SearchTree from "./SearchTree.js";
import WeblinkTree from "./WeblinkTree.js";
import SearchTabCollection from "./SearchTabCollection.js";
import SearchTaskCollection from "./SearchTaskCollection.js";
import SearchTreeCollection from "./SearchTreeCollection.js";
import WeblinkTreeCollection from "./WeblinkTreeCollection.js";
import { SearchTabState } from "./Enums.js";



console.log("options.js");

setInterval(() => {

	chrome.runtime.getBackgroundPage((bkg) => {
		console.log("Background: ", bkg);

		let lastSearchTab = bkg.lastSearchTab;
		console.log("Last SearchTab: ", bkg.lastSearchTab);
		let lastSearchTask = bkg.lastSearchTask;
		console.log("Last SearchTask: ", bkg.lastSearchTask);

		let searchTrees = [];
		let numSearchTrees = lastSearchTask.searchTrees.length;
		let count = 1;

		for (let searchTreeUUID of lastSearchTask.searchTrees) {
			SearchTree.get(searchTreeUUID, (searchTree) => {
				searchTrees.push(searchTrees);
				tryNext();
			});
		}

		function tryNext() {
			count++;
			debugger;
			// if (count == numSearchTrees) {
				console.log("SearchTrees - Orig: ", lastSearchTask.searchTrees);
				console.log("SearchTrees - Reco: ", searchTrees);
			// }
		}

	});




}, 2000);



