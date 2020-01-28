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

	it("tests get", function(done){
		chrome.storage.sync.clear();
		const testWeblinkTree = this.WeblinkTree;
		const key = WeblinkTree.name+"_"+testWeblinkTree.UUID;

		// Set with Chrome:
		chrome.storage.sync.set({[key]:testWeblinkTree}, () => {
			console.log("Chrome Set: ", {[key]:testWeblinkTree});
		});

		// Get with WeblinkTree:
		WeblinkTree.get(testWeblinkTree.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testWeblinkTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set", function(done) {
		chrome.storage.sync.clear();
		const testWeblinkTree = this.WeblinkTree;
		const key = WeblinkTree.name+"_"+testWeblinkTree.UUID;

		// Set with WeblinkTree:
		WeblinkTree.set(testWeblinkTree);

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testWeblinkTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set and get", function(done) {
		chrome.storage.sync.clear();
		const testWeblinkTree = this.WeblinkTree;
		const key = WeblinkTree.name+"_"+testWeblinkTree.UUID;

		WeblinkTree.set(testWeblinkTree);
		WeblinkTree.get(testWeblinkTree.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testWeblinkTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync", function(done) {
		chrome.storage.sync.clear();
		const testWeblinkTree = this.WeblinkTree;
		const key = WeblinkTree.name+"_"+testWeblinkTree.UUID;

		// Sync:
		testWeblinkTree.sync();

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testWeblinkTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync and get", function(done) {
		chrome.storage.sync.clear();
		const testWeblinkTree = this.WeblinkTree;
		const key = WeblinkTree.name+"_"+testWeblinkTree.UUID;

		// Sync:
		testWeblinkTree.sync();

		// Get with WeblinkTree:
		WeblinkTree.get(testWeblinkTree.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testWeblinkTree.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests repeated sync and get", function(done) {
		chrome.storage.sync.clear();
		let testWeblinkTree = this.WeblinkTree;
		const testArray = [Utilities.uuidv4(), Utilities.uuidv4()];
		testWeblinkTree.testArray = testArray;

		const N  = 2;
		let numAsyncCalls = N;
		let UUIDs = [testWeblinkTree.UUID];

		function testIteration() {
			// Sync:
			testWeblinkTree.sync(() => {
				console.log("ITERATION: ", testWeblinkTree.UUID);
			});

			// Get with WeblinkTree:
			WeblinkTree.get(testWeblinkTree.UUID, (obj) => {
				try {
					numAsyncCalls--;
					expect(obj).not.toBe(undefined);
					expect(obj.UUID).toBe(testWeblinkTree.UUID);
					expect(obj.testArray).toEqual(testArray);
					if (numAsyncCalls == 0) {
						expect(UUIDs.length).toBe(N);
						expect(new Set(UUIDs).size).toBe(UUIDs.length);
						done();
					} else {
						testWeblinkTree.UUID = Utilities.uuidv4();
						UUIDs.push(testWeblinkTree.UUID);
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
