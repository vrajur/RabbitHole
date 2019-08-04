// Import Class:
import * as WeblinkTreeCollection from "../js/WeblinkTreeCollection.js";

xdescribe("WeblinkTreeCollection Test Suite", function() {

	beforeEach(function() {
		this.WeblinkTreeCollection = new WeblinkTreeCollection();
	});

	it("tests the constructor", function() {
		expect(this.WeblinkTreeCollection).not.toBe(undefined);
	});

});