// Import Class:
import SearchTreeCollection from "../js/SearchTreeCollection.js";
import Utilities from "../js/Utilities.js";


describe("SearchTreeCollection Test Suite", function() {

	beforeEach(function() {
		this.treeUUID1 = Utilities.uuidv4();
		this.treeUUID2 = Utilities.uuidv4();
		this.treeUUID3 = Utilities.uuidv4();

		this.SearchTreeCollection = new SearchTreeCollection();
	});

	it("tests the constructor", function() {
		expect(this.SearchTreeCollection).not.toBe(undefined);
		expect(this.SearchTreeCollection.searchTrees).toEqual([]);

	});

	it("tests addSearchTree", function() {
		expect(this.SearchTreeCollection.addSearchTree(this.treeUUID1)).toBe(1);
		expect(this.SearchTreeCollection.addSearchTree(this.treeUUID2)).toBe(2);
		expect(this.SearchTreeCollection.addSearchTree(this.treeUUID3)).toBe(3);

		expect(this.SearchTreeCollection.searchTrees).toEqual([this.treeUUID1,this.treeUUID2,this.treeUUID3]);
	});

	it("tests removeSearchTree", function() {
		expect(this.SearchTreeCollection.addSearchTree(this.treeUUID1)).toBe(1);
		expect(this.SearchTreeCollection.addSearchTree(this.treeUUID2)).toBe(2);
		
		// Try to remove invalid UUID:
		expect(this.SearchTreeCollection.removeSearchTree(this.treeUUID3)).toBe(false);
		expect(this.SearchTreeCollection.searchTrees).toEqual([this.treeUUID1,this.treeUUID2]);

		// Try to remove valid UUID:
		expect(this.SearchTreeCollection.removeSearchTree(this.treeUUID1)).toBe(true);
		expect(this.SearchTreeCollection.searchTrees).toEqual([this.treeUUID2]);
	
		// Try to remove previously removed UUID:		
		expect(this.SearchTreeCollection.removeSearchTree(this.treeUUID1)).toBe(false);
		expect(this.SearchTreeCollection.searchTrees).toEqual([this.treeUUID2]);
	});

	it("tests exists", function() {
		expect(this.SearchTreeCollection.addSearchTree(this.treeUUID1)).toBe(1);
		expect(this.SearchTreeCollection.addSearchTree(this.treeUUID2)).toBe(2);
		
		// Check invalid UUID:
		expect(this.SearchTreeCollection.exists(this.treeUUID3)).toBe(false);
		
		// Check valid UUID:
		expect(this.SearchTreeCollection.exists(this.treeUUID1)).toBe(true);
		expect(this.SearchTreeCollection.exists(this.treeUUID2)).toBe(true);


	});

	it("tests get", function(done){
		chrome.storage.sync.clear();
		const testSearchTreeCollection = this.SearchTreeCollection;
		const key = SearchTreeCollection.name+"_"+testSearchTreeCollection.UUID;

		// Set with Chrome:
		chrome.storage.sync.set({[key]:testSearchTreeCollection}, () => {
			console.log("Chrome Set: ", {[key]:testSearchTreeCollection});
		});

		// Get with SearchTreeCollection:
		SearchTreeCollection.get(testSearchTreeCollection.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set", function(done) {
		chrome.storage.sync.clear();
		const testSearchTreeCollection = this.SearchTreeCollection;
		const key = SearchTreeCollection.name+"_"+testSearchTreeCollection.UUID;

		// Set with SearchTreeCollection:
		SearchTreeCollection.set(testSearchTreeCollection);

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testSearchTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set and get", function(done) {
		chrome.storage.sync.clear();
		const testSearchTreeCollection = this.SearchTreeCollection;
		const key = SearchTreeCollection.name+"_"+testSearchTreeCollection.UUID;

		SearchTreeCollection.set(testSearchTreeCollection);
		SearchTreeCollection.get(testSearchTreeCollection.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync", function(done) {
		chrome.storage.sync.clear();
		const testSearchTreeCollection = this.SearchTreeCollection;
		const key = SearchTreeCollection.name+"_"+testSearchTreeCollection.UUID;

		// Sync:
		testSearchTreeCollection.sync();

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testSearchTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync and get", function(done) {
		chrome.storage.sync.clear();
		const testSearchTreeCollection = this.SearchTreeCollection;
		const key = SearchTreeCollection.name+"_"+testSearchTreeCollection.UUID;

		// Sync:
		testSearchTreeCollection.sync();

		// Get with SearchTreeCollection:
		SearchTreeCollection.get(testSearchTreeCollection.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests repeated sync and get", function(done) {
		chrome.storage.sync.clear();
		let testSearchTreeCollection = this.SearchTreeCollection;
		const testArray = [Utilities.uuidv4(), Utilities.uuidv4()];
		testSearchTreeCollection.testArray = testArray;

		const N  = 2;
		let numAsyncCalls = N;
		let UUIDs = [testSearchTreeCollection.UUID];

		function testIteration() {
			// Sync:
			testSearchTreeCollection.sync(() => {
				console.log("ITERATION: ", testSearchTreeCollection.UUID);
			});

			// Get with SearchTreeCollection:
			SearchTreeCollection.get(testSearchTreeCollection.UUID, (obj) => {
				try {
					numAsyncCalls--;
					expect(obj).not.toBe(undefined);
					expect(obj.UUID).toBe(testSearchTreeCollection.UUID);
					expect(obj.testArray).toEqual(testArray);
					if (numAsyncCalls == 0) {
						expect(UUIDs.length).toBe(N);
						expect(new Set(UUIDs).size).toBe(UUIDs.length);
						done();
					} else {
						testSearchTreeCollection.UUID = Utilities.uuidv4();
						UUIDs.push(testSearchTreeCollection.UUID);
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