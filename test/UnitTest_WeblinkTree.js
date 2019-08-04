// Import Class:
import WeblinkTree from "../js/WeblinkTree.js";
import Utilities from "../js/Utilities.js";


describe("WeblinkTree Test Suite", function() {

	beforeEach(function() {
		this.url = "https://example.com";
		this.WeblinkTree = new WeblinkTree(this.url);
	});

	it("tests the constructor", function() {
		expect(this.WeblinkTree).not.toBe(undefined);
		expect(this.WeblinkTree.UUID.length).toBe(36);
		expect(this.WeblinkTree.url).toEqual(this.url);
		expect(this.WeblinkTree.prevNode).toBe(null);
		expect(this.WeblinkTree.nextNode).toBe(null);
		expect(this.WeblinkTree.childNodes).toEqual([]);
		expect(this.WeblinkTree.metadata.date instanceof Date).toBe(true);
		expect(this.WeblinkTree.metadata.location).toBe(null);
		expect(this.WeblinkTree.isStarred).toBe(false);
		expect(this.WeblinkTree.markups.highlights).toBe(null);


		let WeblinkTreeNull = new WeblinkTree();
		expect(WeblinkTreeNull.url).toBe(null);
	});

	it("tests toggleIsStarred", function() {
		expect(this.WeblinkTree.isStarred).toBe(false);
		expect(this.WeblinkTree.toggleIsStarred()).toBe(true);
		expect(this.WeblinkTree.toggleIsStarred()).toBe(false);
	});

	it("tests getter/setter isStarred", function() {
		expect(this.WeblinkTree.isStarred).toBe(false);
		
		this.WeblinkTree.isStarred = true;
		expect(this.WeblinkTree.isStarred).toBe(true);
		
		this.WeblinkTree.isStarred = false;
		expect(this.WeblinkTree.isStarred).toBe(false);
	});

});