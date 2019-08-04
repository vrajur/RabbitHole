// Import Class:
import SearchTabCollection from "../js/SearchTabCollection.js";
import Utilities from "../js/Utilities.js";


describe("SearchTabCollection Test Suite", function() {

	beforeEach(function() {
		this.chromeID1 = Utilities.randomInt(1000);
		this.chromeID2 = Utilities.randomInt(1000);
		this.chromeID3 = Utilities.randomInt(1000);

		this.UUID1 = Utilities.uuidv4();
		this.UUID2 = Utilities.uuidv4();
		this.UUID3 = Utilities.uuidv4();

		this.SearchTabCollection = new SearchTabCollection();
	});

	it("tests the constructor", function() {
		expect(this.SearchTabCollection).not.toBe(undefined);
		expect(this.SearchTabCollection._chromeID2UUID).toEqual({});
		expect(this.SearchTabCollection._UUID2chromeID).toEqual({});
	});

	it("tests addSearchTab", function() {

		const chrome2UUID1 = {};
		chrome2UUID1[this.chromeID1] = this.UUID1;

		const UUID2chrome1 = {};
		UUID2chrome1[this.UUID1] = this.chromeID1;

		const chrome2UUID2 = {};
		chrome2UUID2[this.chromeID1] = this.UUID1;
		chrome2UUID2[this.chromeID2] = this.UUID2;
		
		const UUID2chrome2 = {};
		UUID2chrome2[this.UUID1] = this.chromeID1;
		UUID2chrome2[this.UUID2] = this.chromeID2;

		// Add valid chromeTabID/UUID pair
		expect(this.SearchTabCollection.addSearchTab(this.chromeID1, this.UUID1)).toBe(true);
		expect(this.SearchTabCollection._chromeID2UUID).toEqual(chrome2UUID1);
		expect(this.SearchTabCollection._UUID2chromeID).toEqual(UUID2chrome1);

		// Add same chromeTabID with different UUID:
		expect(this.SearchTabCollection.addSearchTab(this.chromeID1, this.UUID2)).toBe(false);
		expect(this.SearchTabCollection._chromeID2UUID).toEqual(chrome2UUID1);
		expect(this.SearchTabCollection._UUID2chromeID).toEqual(UUID2chrome1);

		// Add different chromeTabID with same UUID:
		expect(this.SearchTabCollection.addSearchTab(this.chromeID2, this.UUID1)).toBe(false);
		expect(this.SearchTabCollection._chromeID2UUID).toEqual(chrome2UUID1);
		expect(this.SearchTabCollection._UUID2chromeID).toEqual(UUID2chrome1);

		// Add different different chromeTabID and different UUID:
		expect(this.SearchTabCollection.addSearchTab(this.chromeID2, this.UUID2)).toBe(true);
		expect(this.SearchTabCollection._chromeID2UUID).toEqual(chrome2UUID2);
		expect(this.SearchTabCollection._UUID2chromeID).toEqual(UUID2chrome2);
	});

	it("tests chromeTabExists", function() {
		expect(this.SearchTabCollection.addSearchTab(this.chromeID1, this.UUID1)).toBe(true);

		// Check invalid chromeTabIDs:
		expect(this.SearchTabCollection.chromeTabExists(this.chromeID2)).toBe(false);
		expect(this.SearchTabCollection.chromeTabExists(this.chromeID3)).toBe(false);
		expect(this.SearchTabCollection.chromeTabExists(this.UUID1)).toBe(false);
		expect(this.SearchTabCollection.chromeTabExists(this.UUID2)).toBe(false);
		expect(this.SearchTabCollection.chromeTabExists(this.UUID3)).toBe(false);

		// Check valid chromeTab:
		expect(this.SearchTabCollection.chromeTabExists(this.chromeID1)).toBe(true);
	});

	it("tests searchTabExists", function() {
		expect(this.SearchTabCollection.addSearchTab(this.chromeID1, this.UUID1)).toBe(true);

		// Check invalid UUIDs:
		expect(this.SearchTabCollection.searchTabExists(this.chromeID1)).toBe(false);
		expect(this.SearchTabCollection.searchTabExists(this.chromeID2)).toBe(false);
		expect(this.SearchTabCollection.searchTabExists(this.chromeID3)).toBe(false);
		expect(this.SearchTabCollection.searchTabExists(this.UUID2)).toBe(false);
		expect(this.SearchTabCollection.searchTabExists(this.UUID3)).toBe(false);

		// Check valid UUID:
		expect(this.SearchTabCollection.searchTabExists(this.UUID1)).toBe(true);
	});


	it("tests removeSearchTab", function() {
		const chrome2UUID1 = {};
		chrome2UUID1[this.chromeID1] = this.UUID1;

		const UUID2chrome1 = {};
		UUID2chrome1[this.UUID1] = this.chromeID1;

		const chrome2UUID2 = {};
		chrome2UUID2[this.chromeID1] = this.UUID1;
		chrome2UUID2[this.chromeID2] = this.UUID2;
		
		const UUID2chrome2 = {};
		UUID2chrome2[this.UUID1] = this.chromeID1;
		UUID2chrome2[this.UUID2] = this.chromeID2;

		expect(this.SearchTabCollection.addSearchTab(this.chromeID1, this.UUID1)).toBe(true);
		expect(this.SearchTabCollection.addSearchTab(this.chromeID2, this.UUID2)).toBe(true);
		
		// Try to remove invalid chromeTabID:
		expect(this.SearchTabCollection.removeSearchTab(this.chromeID3)).toBe(false);
		expect(this.SearchTabCollection._chromeID2UUID).toEqual(chrome2UUID2);
		expect(this.SearchTabCollection._UUID2chromeID).toEqual(UUID2chrome2);

		// Try to remove valid chromeTabID:
		expect(this.SearchTabCollection.removeSearchTab(this.chromeID2)).toBe(true);
		expect(this.SearchTabCollection._chromeID2UUID).toEqual(chrome2UUID1);
		expect(this.SearchTabCollection._UUID2chromeID).toEqual(UUID2chrome1);

		// Try to remove previously removed chromeTabID:
		expect(this.SearchTabCollection.removeSearchTab(this.chromeID2)).toBe(false);
		expect(this.SearchTabCollection._chromeID2UUID).toEqual(chrome2UUID1);
		expect(this.SearchTabCollection._UUID2chromeID).toEqual(UUID2chrome1);
	});
	

	it("tests getSearchTabUUID", function() {
		expect(this.SearchTabCollection.addSearchTab(this.chromeID1, this.UUID1)).toBe(true);
		expect(this.SearchTabCollection.addSearchTab(this.chromeID2, this.UUID2)).toBe(true);

		// Try invalid chromeTabID:
		expect(this.SearchTabCollection.getSearchTabUUID(this.chromeID3)).toBe(null);

		// Try valid chromeTabIDs:
		expect(this.SearchTabCollection.getSearchTabUUID(this.chromeID1)).toBe(this.UUID1);
		expect(this.SearchTabCollection.getSearchTabUUID(this.chromeID2)).toBe(this.UUID2);
	});


	it("tests getChromeTabID", function() {
		expect(this.SearchTabCollection.addSearchTab(this.chromeID1, this.UUID1)).toBe(true);
		expect(this.SearchTabCollection.addSearchTab(this.chromeID2, this.UUID2)).toBe(true);

		// Try invalid chromeTabID:
		expect(this.SearchTabCollection.getChromeTabID(this.UUID3)).toBe(null);

		// Try valid chromeTabIDs:
		expect(this.SearchTabCollection.getChromeTabID(this.UUID1)).toBe(this.chromeID1);
		expect(this.SearchTabCollection.getChromeTabID(this.UUID2)).toBe(this.chromeID2);
	});
	
	xit("tests sync", function() {
		expect(true).toBe(true);
	});

});