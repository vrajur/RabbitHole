// Import Class:
import SearchTab from "../js/SearchTab.js";

xdescribe("SearchTab Test Suite", function() {

	beforeEach(function() {
		this.SearchTab = new SearchTab();
	});

	it("tests the constructor", function() {
		expect(this.SearchTab).not.toBe(undefined);
	});

});