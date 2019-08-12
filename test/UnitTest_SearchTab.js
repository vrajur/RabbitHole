// Import Class:
import SearchTab from "../js/SearchTab.js";
import Utilities from "../js/Utilities.js";
import { SearchTabState } from "../js/Enums.js";

describe("SearchTab Test Suite", function() {

	beforeEach(function() {
		this.chromeTabID = Utilities.randomInt(1000);
		this.SearchTab = new SearchTab(this.chromeTabID);
	});

	it("tests the constructor", function() {
		expect(this.SearchTab).not.toBe(undefined);
		expect(this.SearchTab.chromeTabID).toBe(this.chromeTabID);
		expect(this.SearchTab.UUID).not.toBe(undefined);
		expect(this.SearchTab.UUID.length).toBe(36);
		expect(this.SearchTab.isActive).toBe(true);
		expect(this.SearchTab.urlHistory).toBe(null);

		expect(this.SearchTab.currentState).toBe(SearchTabState.NONE);
		expect(this.SearchTab.previousState).toBe(SearchTabState.NONE);

		expect(this.SearchTab.activeSearchTree).toBe(null);
		expect(this.SearchTab.activeWeblinkTree).toBe(null);
	});

	it("tests get", function(done){
		chrome.storage.sync.clear();
		const testSearchTab = this.SearchTab;
		const key = SearchTab.name+"_"+testSearchTab.UUID;

		// Set with Chrome:
		chrome.storage.sync.set({[key]:testSearchTab}, () => {
			console.log("Chrome Set: ", {[key]:testSearchTab});
		});

		// Get with SearchTab:
		SearchTab.get(testSearchTab.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTab.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set", function(done) {
		chrome.storage.sync.clear();
		const testSearchTab = this.SearchTab;
		const key = SearchTab.name+"_"+testSearchTab.UUID;

		// Set with SearchTab:
		SearchTab.set(testSearchTab);

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testSearchTab.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set and get", function(done) {
		chrome.storage.sync.clear();
		const testSearchTab = this.SearchTab;
		const key = SearchTab.name+"_"+testSearchTab.UUID;

		SearchTab.set(testSearchTab);
		SearchTab.get(testSearchTab.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTab.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync", function(done) {
		chrome.storage.sync.clear();
		const testSearchTab = this.SearchTab;
		const key = SearchTab.name+"_"+testSearchTab.UUID;

		// Sync:
		testSearchTab.sync();

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key].UUID).toBe(testSearchTab.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests sync and get", function(done) {
		chrome.storage.sync.clear();
		const testSearchTab = this.SearchTab;
		const key = SearchTab.name+"_"+testSearchTab.UUID;

		// Sync:
		testSearchTab.sync();

		// Get with SearchTab:
		SearchTab.get(testSearchTab.UUID, (obj) => {
			try {
				expect(obj).not.toBe(undefined);
				expect(obj.UUID).toBe(testSearchTab.UUID);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests repeated sync and get", function(done) {
		chrome.storage.sync.clear();
		let testSearchTab = this.SearchTab;
		const testArray = [Utilities.uuidv4(), Utilities.uuidv4()];
		testSearchTab.testArray = testArray;

		const N  = 2;
		let numAsyncCalls = N;
		let UUIDs = [testSearchTab.UUID];

		function testIteration() {
			// Sync:
			testSearchTab.sync(() => {
				console.log("ITERATION: ", testSearchTab.UUID);
			});

			// Get with SearchTab:
			SearchTab.get(testSearchTab.UUID, (obj) => {
				try {
					numAsyncCalls--;
					expect(obj).not.toBe(undefined);
					expect(obj.UUID).toBe(testSearchTab.UUID);
					expect(obj.testArray).toEqual(testArray);
					if (numAsyncCalls == 0) {
						expect(UUIDs.length).toBe(N);
						expect(new Set(UUIDs).size).toBe(UUIDs.length);
						done();
					} else {
						testSearchTab.UUID = Utilities.uuidv4();
						UUIDs.push(testSearchTab.UUID);
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