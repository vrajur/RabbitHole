// Import Class:
import SearchTab from "../js/SearchTab.js";
import Utilities from "../js/Utilities.js";
import { SearchTabState } from "../js/Enums.js";

describe("SearchTab Test Suite", function() {

	beforeEach(function() {
		this.chromeTabID = Utilities.randomInt(1000);
		this.SearchTab = new SearchTab(this.chromeTabID);
	});

	it("tests the constructor", function() {
		expect(this.SearchTab).not.toBe(undefined);
		expect(this.SearchTab.chromeTabID).toBe(this.chromeTabID);
		expect(this.SearchTab.UUID).not.toBe(undefined);
		expect(this.SearchTab.UUID.length).toBe(36);
		expect(this.SearchTab.isActive).toBe(true);
		expect(this.SearchTab.urlHistory).toBe(null);

		expect(this.SearchTab.currentState).toBe(SearchTabState.NONE);
		expect(this.SearchTab.previousState).toBe(SearchTabState.NONE);

		expect(this.SearchTab.activeSearchTree).toBe(null);
		expect(this.SearchTab.activeWeblinkTree).toBe(null);
	});

	xit("tests sync", function() {
		expect(true).toBe(true);
	});

});