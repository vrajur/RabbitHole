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

	it("tests the constructor", function(done) {
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
			done();
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
	
	it("tests get", function(done){
		chrome.storage.sync.clear();
		const testSearchTree = this.SearchTree;
		const key = SearchTree.name+"_"+testSearchTree.UUID;

		// Set with Chrome:
		chrome.storage.sync.set({[key]:testSearchTree}, () => {
			console.log("Chrome Set: ", {[key]:testSearchTree});
		});

		// Get with SearchTree:
		SearchTree.get(testSearchTree.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set", function(done) {
		chrome.storage.sync.clear();
		const testSearchTree = this.SearchTree;
		const key = SearchTree.name+"_"+testSearchTree.UUID;

		// Set with SearchTree:
		SearchTree.set(testSearchTree);

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testSearchTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set and get", function(done) {
		chrome.storage.sync.clear();
		const testSearchTree = this.SearchTree;
		const key = SearchTree.name+"_"+testSearchTree.UUID;

		SearchTree.set(testSearchTree);
		SearchTree.get(testSearchTree.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync", function(done) {
		chrome.storage.sync.clear();
		const testSearchTree = this.SearchTree;
		const key = SearchTree.name+"_"+testSearchTree.UUID;

		// Sync:
		testSearchTree.sync();

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testSearchTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync and get", function(done) {
		chrome.storage.sync.clear();
		const testSearchTree = this.SearchTree;
		const key = SearchTree.name+"_"+testSearchTree.UUID;

		// Sync:
		testSearchTree.sync();

		// Get with SearchTree:
		SearchTree.get(testSearchTree.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests repeated sync and get", function(done) {
		chrome.storage.sync.clear();
		let testSearchTree = this.SearchTree;
		const testArray = [Utilities.uuidv4(), Utilities.uuidv4()];
		testSearchTree.testArray = testArray;

		const N  = 2;
		let numAsyncCalls = N;
		let UUIDs = [testSearchTree.UUID];

		function testIteration() {
			// Sync:
			testSearchTree.sync(() => {
				console.log("ITERATION: ", testSearchTree.UUID);
			});

			// Get with SearchTree:
			SearchTree.get(testSearchTree.UUID, (obj) => {
				try {
					numAsyncCalls--;
					expect(obj).not.toBe(undefined);
					expect(obj.UUID).toBe(testSearchTree.UUID);
					expect(obj.testArray).toEqual(testArray);
					if (numAsyncCalls == 0) {
						expect(UUIDs.length).toBe(N);
						expect(new Set(UUIDs).size).toBe(UUIDs.length);
						done();
					} else {
						testSearchTree.UUID = Utilities.uuidv4();
						UUIDs.push(testSearchTree.UUID);
						testIteration();
					}
				}
				catch (e) {
					done.fail(e)
				}
			});
		}

		testIteration();
	});



});