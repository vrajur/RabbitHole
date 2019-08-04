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

	xit("tests sync", function() {

	});


});