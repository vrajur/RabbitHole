// Import Class:
import * as Enums from "../js/Enums.js";

xdescribe("Enums Test Suite", function() {

	beforeEach(function() {
		this.Enums = new Enums();
	});

	it("tests the constructor", function() {
		expect(this.Enums).not.toBe(undefined);
	});

});