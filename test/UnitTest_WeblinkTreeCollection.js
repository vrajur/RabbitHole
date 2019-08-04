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

	xit("tests sync", function() {

	});


});