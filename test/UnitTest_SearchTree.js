// Import Class:
import SearchTree from "../js/SearchTree.js";
import Utilities from "../js/Utilities.js";
import { SearchTreeState } from "../js/Enums.js";

describe("SearchTree Test Suite", function() {

	beforeEach(function() {

		this.weblinkUUID1 = Utilities.uuidv4();
		this.weblinkUUID2 = Utilities.uuidv4();
		this.weblinkUUID3 = Utilities.uuidv4();

		this.queryString = "test query";
		this.url = "https://example.com";
		this.SearchTree = new SearchTree(this.url, this.queryString);
	});

	it("tests the constructor", function() {
		expect(this.SearchTree).not.toBe(undefined);
		expect(this.SearchTree.UUID.length).toBe(36);
		expect(this.SearchTree.url).toEqual(this.url);
		expect(this.SearchTree.queryString).toEqual(this.queryString);
		expect(this.SearchTree.state).toBe(SearchTreeState.IN_PROGRESS_INACTIVE);

		expect(this.SearchTree.metadata.date instanceof Date).toBe(true);
		expect(this.SearchTree.metadata.location).toBe(null);

		let SearchTreeNull;
		setTimeout(() => {
			SearchTreeNull = new SearchTree();
			expect(SearchTreeNull.queryString).toBe(null);
			expect(SearchTreeNull.url).toBe(null);
			expect(SearchTreeNull.metadata.date instanceof Date).toBe(true);
			expect(this.SearchTree.metadata.date < SearchTreeNull.metadata.date).toBe(true);

		}, 500);
	});

	
	it("tests addWeblinkTree", function() {
		expect(this.SearchTree.addWeblinkTree(this.weblinkUUID1)).toBe(1);
		expect(this.SearchTree.addWeblinkTree(this.weblinkUUID2)).toBe(2);
		expect(this.SearchTree.addWeblinkTree(this.weblinkUUID3)).toBe(3);

		expect(this.SearchTree.childNodes).toEqual([this.weblinkUUID1, this.weblinkUUID2, this.weblinkUUID3]);
	});
	
	it("tests removeWeblinkTree", function() {
		expect(this.SearchTree.addWeblinkTree(this.weblinkUUID1)).toBe(1);
		expect(this.SearchTree.addWeblinkTree(this.weblinkUUID2)).toBe(2);
		
		// Try to remove invalid UUID:
		expect(this.SearchTree.removeWeblinkTree(this.weblinkUUID3)).toBe(false);
		expect(this.SearchTree.childNodes).toEqual([this.weblinkUUID1, this.weblinkUUID2]);

		// Try to remove valid UUID:
		expect(this.SearchTree.removeWeblinkTree(this.weblinkUUID1)).toBe(true);
		expect(this.SearchTree.childNodes).toEqual([this.weblinkUUID2]);

		// Try to remove previously removed UUID:
		expect(this.SearchTree.removeWeblinkTree(this.weblinkUUID1)).toBe(false);
		expect(this.SearchTree.childNodes).toEqual([this.weblinkUUID2]);
	});
	
	it("tests visited", function() {
		expect(this.SearchTree.addWeblinkTree(this.weblinkUUID1)).toBe(1);
		expect(this.SearchTree.addWeblinkTree(this.weblinkUUID2)).toBe(2);
		
		// Check invalid UUID:
		expect(this.SearchTree.visited(this.weblinkUUID3)).toBe(false);

		// Check valid UUID:
		expect(this.SearchTree.visited(this.weblinkUUID1)).toBe(true);
		expect(this.SearchTree.visited(this.weblinkUUID2)).toBe(true);
	});

	it("tests queueWeblinkTree", function() {
		expect(this.SearchTree.queueWeblinkTree(this.weblinkUUID1)).toBe(1);
		expect(this.SearchTree.queueWeblinkTree(this.weblinkUUID2)).toBe(2);
		expect(this.SearchTree.queueWeblinkTree(this.weblinkUUID3)).toBe(3);

		expect(this.SearchTree.childQueue).toEqual([this.weblinkUUID1, this.weblinkUUID2, this.weblinkUUID3]);
	});
	
	it("tests removeFromQueue", function() {
		expect(this.SearchTree.queueWeblinkTree(this.weblinkUUID1)).toBe(1);
		expect(this.SearchTree.queueWeblinkTree(this.weblinkUUID2)).toBe(2);
		
		// Try to remove invalid UUID:
		expect(this.SearchTree.removeFromQueue(this.weblinkUUID3)).toBe(false);
		expect(this.SearchTree.childQueue).toEqual([this.weblinkUUID1, this.weblinkUUID2]);

		// Try to remove valid UUID:
		expect(this.SearchTree.removeFromQueue(this.weblinkUUID1)).toBe(true);
		expect(this.SearchTree.childQueue).toEqual([this.weblinkUUID2]);

		// Try to remove previously removed UUID:
		expect(this.SearchTree.removeFromQueue(this.weblinkUUID1)).toBe(false);
		expect(this.SearchTree.childQueue).toEqual([this.weblinkUUID2]);
	});
	
	it("tests dequeueWeblinkTree", function() {
		expect(this.SearchTree.queueWeblinkTree(this.weblinkUUID1)).toBe(1);
		expect(this.SearchTree.addWeblinkTree(this.weblinkUUID2)).toBe(1);
		
		// Try to dequeue invalid UUIDs:
		expect(this.SearchTree.dequeueWeblinkTree(this.weblinkUUID3)).toBe(false);
		expect(this.SearchTree.childQueue).toEqual([this.weblinkUUID1]);
		expect(this.SearchTree.childNodes).toEqual([this.weblinkUUID2]);

		// Try to dequeue already added UUID:
		expect(this.SearchTree.dequeueWeblinkTree(this.weblinkUUID2)).toBe(false);
		expect(this.SearchTree.childQueue).toEqual([this.weblinkUUID1]);
		expect(this.SearchTree.childNodes).toEqual([this.weblinkUUID2]);

		// Try to dequeue queued UUID:
		expect(this.SearchTree.dequeueWeblinkTree(this.weblinkUUID1)).toBe(true);
		expect(this.SearchTree.childQueue).toEqual([]);
		expect(this.SearchTree.childNodes).toEqual([this.weblinkUUID2, this.weblinkUUID1]);

	});
	
	it("tests isQueued", function() {
		expect(this.SearchTree.queueWeblinkTree(this.weblinkUUID1)).toBe(1);
		expect(this.SearchTree.queueWeblinkTree(this.weblinkUUID2)).toBe(2);
		
		// Check invalid UUID:
		expect(this.SearchTree.isQueued(this.weblinkUUID3)).toBe(false);

		// Check valid UUID:
		expect(this.SearchTree.isQueued(this.weblinkUUID1)).toBe(true);
		expect(this.SearchTree.isQueued(this.weblinkUUID2)).toBe(true);
	});
	
	xit("tests sync", function() {
		
	});



});