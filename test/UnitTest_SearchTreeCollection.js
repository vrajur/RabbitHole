// Import Class:
import SearchTreeCollection from "../js/SearchTreeCollection.js";

xdescribe("SearchTreeCollection Test Suite", function() {

	beforeEach(function() {
		this.SearchTreeCollection = new SearchTreeCollection();
	});

	it("tests the constructor", function() {
		expect(this.SearchTreeCollection).not.toBe(undefined);
	});

});