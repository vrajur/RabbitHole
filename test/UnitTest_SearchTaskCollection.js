// Import Class:
import SearchTaskCollection from "../js/SearchTaskCollection.js";

xdescribe("SearchTaskCollection Test Suite", function() {

	beforeEach(function() {
		this.SearchTaskCollection = new SearchTaskCollection();
	});

	it("tests the constructor", function() {
		expect(this.SearchTaskCollection).not.toBe(undefined);
	});

});