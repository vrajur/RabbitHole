// Import Class:
import SearchTree from "../js/SearchTree.js";

xdescribe("SearchTree Test Suite", function() {

	beforeEach(function() {
		this.SearchTree = new SearchTree();
	});

	it("tests the constructor", function() {
		expect(this.SearchTree).not.toBe(undefined);
	});

});