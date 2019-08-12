// Import Class:
import WeblinkTreeCollection from "../js/WeblinkTreeCollection.js";
import Utilities from "../js/Utilities.js";


describe("WeblinkTreeCollection Test Suite", function() {

	beforeEach(function() {
		this.treeUUID1 = Utilities.uuidv4();
		this.treeUUID2 = Utilities.uuidv4();
		this.treeUUID3 = Utilities.uuidv4();

		this.WeblinkTreeCollection = new WeblinkTreeCollection();
	});

	it("tests the constructor", function() {
		expect(this.WeblinkTreeCollection).not.toBe(undefined);
		expect(this.WeblinkTreeCollection.weblinkTrees).toEqual([]);

	});

	it("tests addSearchTree", function() {
		expect(this.WeblinkTreeCollection.addSearchTree(this.treeUUID1)).toBe(1);
		expect(this.WeblinkTreeCollection.addSearchTree(this.treeUUID2)).toBe(2);
		expect(this.WeblinkTreeCollection.addSearchTree(this.treeUUID3)).toBe(3);

		expect(this.WeblinkTreeCollection.weblinkTrees).toEqual([this.treeUUID1,this.treeUUID2,this.treeUUID3]);
	});

	it("tests removeSearchTree", function() {
		expect(this.WeblinkTreeCollection.addSearchTree(this.treeUUID1)).toBe(1);
		expect(this.WeblinkTreeCollection.addSearchTree(this.treeUUID2)).toBe(2);
		
		// Try to remove invalid UUID:
		expect(this.WeblinkTreeCollection.removeSearchTree(this.treeUUID3)).toBe(false);
		expect(this.WeblinkTreeCollection.weblinkTrees).toEqual([this.treeUUID1,this.treeUUID2]);

		// Try to remove valid UUID:
		expect(this.WeblinkTreeCollection.removeSearchTree(this.treeUUID1)).toBe(true);
		expect(this.WeblinkTreeCollection.weblinkTrees).toEqual([this.treeUUID2]);
	
		// Try to remove previously removed UUID:		
		expect(this.WeblinkTreeCollection.removeSearchTree(this.treeUUID1)).toBe(false);
		expect(this.WeblinkTreeCollection.weblinkTrees).toEqual([this.treeUUID2]);
	});

	it("tests exists", function() {
		expect(this.WeblinkTreeCollection.addSearchTree(this.treeUUID1)).toBe(1);
		expect(this.WeblinkTreeCollection.addSearchTree(this.treeUUID2)).toBe(2);
		
		// Check invalid UUID:
		expect(this.WeblinkTreeCollection.exists(this.treeUUID3)).toBe(false);
		
		// Check valid UUID:
		expect(this.WeblinkTreeCollection.exists(this.treeUUID1)).toBe(true);
		expect(this.WeblinkTreeCollection.exists(this.treeUUID2)).toBe(true);


	});

	it("tests get", function(done){
		chrome.storage.sync.clear();
		const testWeblinkTreeCollection = this.WeblinkTreeCollection;
		const key = WeblinkTreeCollection.name+"_"+testWeblinkTreeCollection.UUID;

		// Set with Chrome:
		chrome.storage.sync.set({[key]:testWeblinkTreeCollection}, () => {
			console.log("Chrome Set: ", {[key]:testWeblinkTreeCollection});
		});

		// Get with WeblinkTreeCollection:
		WeblinkTreeCollection.get(testWeblinkTreeCollection.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testWeblinkTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set", function(done) {
		chrome.storage.sync.clear();
		const testWeblinkTreeCollection = this.WeblinkTreeCollection;
		const key = WeblinkTreeCollection.name+"_"+testWeblinkTreeCollection.UUID;

		// Set with WeblinkTreeCollection:
		WeblinkTreeCollection.set(testWeblinkTreeCollection);

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testWeblinkTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set and get", function(done) {
		chrome.storage.sync.clear();
		const testWeblinkTreeCollection = this.WeblinkTreeCollection;
		const key = WeblinkTreeCollection.name+"_"+testWeblinkTreeCollection.UUID;

		WeblinkTreeCollection.set(testWeblinkTreeCollection);
		WeblinkTreeCollection.get(testWeblinkTreeCollection.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testWeblinkTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync", function(done) {
		chrome.storage.sync.clear();
		const testWeblinkTreeCollection = this.WeblinkTreeCollection;
		const key = WeblinkTreeCollection.name+"_"+testWeblinkTreeCollection.UUID;

		// Sync:
		testWeblinkTreeCollection.sync();

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testWeblinkTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync and get", function(done) {
		chrome.storage.sync.clear();
		const testWeblinkTreeCollection = this.WeblinkTreeCollection;
		const key = WeblinkTreeCollection.name+"_"+testWeblinkTreeCollection.UUID;

		// Sync:
		testWeblinkTreeCollection.sync();

		// Get with WeblinkTreeCollection:
		WeblinkTreeCollection.get(testWeblinkTreeCollection.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testWeblinkTreeCollection.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests repeated sync and get", function(done) {
		chrome.storage.sync.clear();
		let testWeblinkTreeCollection = this.WeblinkTreeCollection;
		const testArray = [Utilities.uuidv4(), Utilities.uuidv4()];
		testWeblinkTreeCollection.testArray = testArray;

		const N  = 2;
		let numAsyncCalls = N;
		let UUIDs = [testWeblinkTreeCollection.UUID];

		function testIteration() {
			// Sync:
			testWeblinkTreeCollection.sync(() => {
				console.log("ITERATION: ", testWeblinkTreeCollection.UUID);
			});

			// Get with WeblinkTreeCollection:
			WeblinkTreeCollection.get(testWeblinkTreeCollection.UUID, (obj) => {
				try {
					numAsyncCalls--;
					expect(obj).not.toBe(undefined);
					expect(obj.UUID).toBe(testWeblinkTreeCollection.UUID);
					expect(obj.testArray).toEqual(testArray);
					if (numAsyncCalls == 0) {
						expect(UUIDs.length).toBe(N);
						expect(new Set(UUIDs).size).toBe(UUIDs.length);
						done();
					} else {
						testWeblinkTreeCollection.UUID = Utilities.uuidv4();
						UUIDs.push(testWeblinkTreeCollection.UUID);
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