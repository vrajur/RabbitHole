// Import Class:
import * as WeblinkTree from "../js/WeblinkTree.js";
import Utilites from "../js/Utitlies.js";


describe("WeblinkTree Test Suite", function() {

	beforeEach(function() {
		this.url = "https://example.com";
		this.WeblinkTree = new WeblinkTree();
	});

	it("tests the constructor", function() {
		expect(this.WeblinkTree).not.toBe(undefined);

		expect(this.WeblinkTree.UUID.length).toBe(36);
		expect(this.WeblinkTree.url).toEqual(this.url);
		expect(this.WeblinkTree.prevWeblinkUUID).toBe(null);
		expect(this.WeblinkTree.nextWeblinkUUID).toBe(null);
		expect(this.WeblinkTree.weblinkTreeNodes).toEqual([]);
		expect(this.WeblinkTree.metadata.date instanceof Date).toBe(true);
		expect(this.WeblinkTree.metadata.location).toBe(null);
		expect(this.WeblinkTree.markups.isStarred).toBe(false);
		expect(this.WeblinkTree.markups.highlights).toBe(null);
	});



});