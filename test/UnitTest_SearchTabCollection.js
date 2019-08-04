// Import Class:
import SearchTabCollection from "../js/SearchTabCollection.js";

xdescribe("SearchTabCollection Test Suite", function() {

	beforeEach(function() {
		this.SearchTabCollection = new SearchTabCollection();
	});

	it("tests the constructor", function() {
		expect(this.SearchTabCollection).not.toBe(undefined);
	});

});