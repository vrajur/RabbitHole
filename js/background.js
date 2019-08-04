console.log("Background Script");


import { SearchTabState } from "./Enums.js";
import SearchTab from "./SearchTab.js";
import SearchTabCollection from "./SearchTabCollection.js";
import SearchTask from "./SearchTask.js";
import SearchTaskCollection from "./SearchTaskCollection.js";



let chromeTabID = 111;
let searchTab = new SearchTab(chromeTabID);
let searchTabCollection = new SearchTabCollection();

searchTabCollection.addSearchTab(chromeTabID, searchTab.UUID);

console.log('SearchTab: ', searchTab);
console.log('SearchTabCollection: ', searchTabCollection);



searchTab.sync();
debugger;



