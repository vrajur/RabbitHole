import StorageItem from "../js/StorageItem.js";
import SearchTask from "../js/SearchTask.js";
import Utilities from "../js/Utilities.js";

describe("SearchTask Test Suite", function () {

	beforeEach(function() {
		this.SearchTask = new SearchTask();
		// console.log("SearchTask: ", this.SearchTask);
	});

	it("tests the constructor", function() {
		expect(this.SearchTask).not.toBe(undefined);
		expect(this.SearchTask.UUID).not.toBe(undefined);
		expect(this.SearchTask.searchTrees.length).toBe(0);
		expect(this.SearchTask.searchQueue.size).toBe(0);
		expect(this.SearchTask.assignedTabs).toEqual([]);
	});


	it("tests addSearchTree", function() {
		const searchTreeUUID = Utilities.uuidv4();
		expect(this.SearchTask.addSearchTree(searchTreeUUID)).toBe(1);
		expect(this.SearchTask.searchTrees.length).toBe(1);
		expect(this.SearchTask.searchTrees[0]).toBe(searchTreeUUID);
		expect(this.SearchTask.searchTrees).toEqual([searchTreeUUID]);

		const searchTreeUUID2 = Utilities.uuidv4();
		expect(this.SearchTask.addSearchTree(searchTreeUUID2)).toBe(2);
		expect(this.SearchTask.searchTrees.length).toBe(2);
		expect(this.SearchTask.searchTrees[1]).toBe(searchTreeUUID2);
		expect(this.SearchTask.searchTrees).toEqual([searchTreeUUID, searchTreeUUID2]);

	});

	it("tests exists", function() {
		const fakeUUID = Utilities.uuidv4();
		const searchTreeUUID = Utilities.uuidv4();
		expect(this.SearchTask.addSearchTree(searchTreeUUID)).toBe(1);

		// Test invalid uuids
		expect(this.SearchTask.exists(-1)).toBe(false);
		expect(this.SearchTask.exists('a')).toBe(false);
		expect(this.SearchTask.exists(fakeUUID)).toBe(false);

		// Test valid uuid
		expect(this.SearchTask.exists(searchTreeUUID)).toBe(true);
	});

	it("tests removeSearchTree", function() {
		const searchTreeUUID = Utilities.uuidv4();
		const fakeUUID = Utilities.uuidv4();
		this.SearchTask.addSearchTree(searchTreeUUID);

		// Remove non-existent UUID:
		expect(this.SearchTask.removeSearchTree(fakeUUID)).toBe(false);
		expect(this.SearchTask.searchTrees.length).toBe(1);

		// Remove existing UUID:
		expect(this.SearchTask.removeSearchTree(searchTreeUUID)).toBe(true);
		expect(this.SearchTask.searchTrees.length).toBe(0);

		// Remove previously existsing UUID:
		expect(this.SearchTask.removeSearchTree(searchTreeUUID)).toBe(false);
		expect(this.SearchTask.searchTrees.length).toBe(0);
	});


	it("tests queueSearchTree", function() {
		const searchTreeUUID = Utilities.uuidv4();
		
		this.SearchTask.queueSearchTree(searchTreeUUID);
		expect(this.SearchTask.searchQueue.size).toBe(1);
		expect(this.SearchTask.searchQueue).toEqual(new Set([searchTreeUUID]));

		const searchTreeUUID2 = Utilities.uuidv4();
		
		this.SearchTask.queueSearchTree(searchTreeUUID2);
		expect(this.SearchTask.searchQueue.size).toBe(2);
		expect(this.SearchTask.searchQueue).toEqual(new Set([searchTreeUUID, searchTreeUUID2]));
	});


	it("tests removeFromQueue", function() {
		const searchTreeUUID = Utilities.uuidv4();
		const fakeUUID = Utilities.uuidv4();
		this.SearchTask.queueSearchTree(searchTreeUUID);
			
		// Try non-existent UUID:
		expect(this.SearchTask.removeFromQueue(fakeUUID)).toBe(false);
		expect(this.SearchTask.searchQueue.size).toBe(1);

		// Try existing UUID:
		expect(this.SearchTask.removeFromQueue(searchTreeUUID)).toBe(true);
		expect(this.SearchTask.searchQueue.size).toBe(0);

		// Try previously existing UUID:
		expect(this.SearchTask.removeFromQueue(searchTreeUUID)).toBe(false);
		expect(this.SearchTask.searchQueue.size).toBe(0);
	});

	it("tests dequeueSearchTree", function() {
		const queuedUUID = Utilities.uuidv4();
		const addedUUID = Utilities.uuidv4();
		const fakeUUID = Utilities.uuidv4();

		this.SearchTask.addSearchTree(addedUUID);
		this.SearchTask.queueSearchTree(queuedUUID);

		// Try to dequeue fake UUID:
		expect(this.SearchTask.dequeueSearchTree(fakeUUID)).toBe(false);
		expect(this.SearchTask.searchQueue).toEqual(new Set([queuedUUID]));
		expect(this.SearchTask.searchTrees).toEqual([addedUUID]);

		// Try to dequeue added UUID:
		expect(this.SearchTask.dequeueSearchTree(addedUUID)).toBe(false);
		expect(this.SearchTask.searchQueue).toEqual(new Set([queuedUUID]));
		expect(this.SearchTask.searchTrees).toEqual([addedUUID]);

		// Try to dequeue queued UUID:
		expect(this.SearchTask.dequeueSearchTree(queuedUUID)).toBe(true);
		expect(this.SearchTask.searchQueue).toEqual(new Set());
		expect(this.SearchTask.searchTrees).toEqual([addedUUID, queuedUUID]);

		// Try to dequeue previously queued UUID:
		expect(this.SearchTask.dequeueSearchTree(queuedUUID)).toBe(false);
		expect(this.SearchTask.searchQueue).toEqual(new Set());
		expect(this.SearchTask.searchTrees).toEqual([addedUUID, queuedUUID]);
	});

	it("tests isQueued", function() {
		const queuedUUID = Utilities.uuidv4();
		const addedUUID = Utilities.uuidv4();
		const fakeUUID = Utilities.uuidv4();

		this.SearchTask.addSearchTree(addedUUID);
		this.SearchTask.queueSearchTree(queuedUUID);

		// Try fake UUID:
		expect(this.SearchTask.isQueued(fakeUUID)).toBe(false);

		// Try added UUID:
		expect(this.SearchTask.isQueued(addedUUID)).toBe(false);

		// Try queued UUID:
		expect(this.SearchTask.isQueued(queuedUUID)).toBe(true);
	});


	it("tests get", function(done){
		chrome.storage.sync.clear();
		const testSearchTask = this.SearchTask;
		const key = SearchTask.name+"_"+testSearchTask.UUID;

		// Set with Chrome:
		chrome.storage.sync.set({[key]:testSearchTask}, () => {
			console.log("Chrome Set: ", {[key]:testSearchTask});
		});

		// Get with SearchTask:
		SearchTask.get(testSearchTask.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTask.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set", function(done) {
		chrome.storage.sync.clear();
		const testSearchTask = this.SearchTask;
		const key = SearchTask.name+"_"+testSearchTask.UUID;

		// Set with SearchTask:
		SearchTask.set(testSearchTask);

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testSearchTask.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set and get", function(done) {
		chrome.storage.sync.clear();
		const testSearchTask = this.SearchTask;
		const key = SearchTask.name+"_"+testSearchTask.UUID;

		SearchTask.set(testSearchTask);
		SearchTask.get(testSearchTask.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTask.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync", function(done) {
		chrome.storage.sync.clear();
		const testSearchTask = this.SearchTask;
		const key = SearchTask.name+"_"+testSearchTask.UUID;

		// Sync:
		testSearchTask.sync();

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testSearchTask.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync and get", function(done) {
		chrome.storage.sync.clear();
		const testSearchTask = this.SearchTask;
		const key = SearchTask.name+"_"+testSearchTask.UUID;

		// Sync:
		testSearchTask.sync();

		// Get with SearchTask:
		SearchTask.get(testSearchTask.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTask.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests repeated sync and get", function(done) {
		chrome.storage.sync.clear();
		let testSearchTask = this.SearchTask;
		const testArray = [Utilities.uuidv4(), Utilities.uuidv4()];
		testSearchTask.testArray = testArray;

		const N  = 2;
		let numAsyncCalls = N;
		let UUIDs = [testSearchTask.UUID];

		function testIteration() {
			// Sync:
			testSearchTask.sync(() => {
				console.log("ITERATION: ", testSearchTask.UUID);
			});

			// Get with SearchTask:
			SearchTask.get(testSearchTask.UUID, (obj) => {
				try {
					numAsyncCalls--;
					expect(obj).not.toBe(undefined);
					expect(obj.UUID).toBe(testSearchTask.UUID);
					expect(obj.testArray).toEqual(testArray);
					if (numAsyncCalls == 0) {
						expect(UUIDs.length).toBe(N);
						expect(new Set(UUIDs).size).toBe(UUIDs.length);
						done();
					} else {
						testSearchTask.UUID = Utilities.uuidv4();
						UUIDs.push(testSearchTask.UUID);
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


