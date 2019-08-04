// Import Class:
import SearchTaskCollection from "../js/SearchTaskCollection.js";
import Utilities from "../js/Utilities.js";

describe("SearchTaskCollection Test Suite", function() {

	beforeEach(function() {
		this.taskID1 = Utilities.uuidv4();
		this.taskID2 = Utilities.uuidv4();
		this.taskID3 = Utilities.uuidv4();

		this.SearchTaskCollection = new SearchTaskCollection();
	});

	it("tests the constructor", function() {
		expect(this.SearchTaskCollection).not.toBe(undefined);
		expect(this.SearchTaskCollection.searchTasks).toEqual([]);
	});

	it("tests addSearchTask", function() {
		expect(this.SearchTaskCollection.addSearchTask(this.taskID1)).toBe(1);
		expect(this.SearchTaskCollection.searchTasks).toEqual([this.taskID1]);
		
		expect(this.SearchTaskCollection.addSearchTask(this.taskID2)).toBe(2);
		expect(this.SearchTaskCollection.searchTasks).toEqual([this.taskID1, this.taskID2]);
	});

	it("tests removeSearchTask", function() {
		expect(this.SearchTaskCollection.addSearchTask(this.taskID1)).toBe(1);
		expect(this.SearchTaskCollection.addSearchTask(this.taskID2)).toBe(2);

		// Try to remove invalid task:
		expect(this.SearchTaskCollection.removeSearchTask(this.taskID3)).toBe(false);
		expect(this.SearchTaskCollection.searchTasks).toEqual([this.taskID1, this.taskID2]);

		// Try to remove valid task:
		expect(this.SearchTaskCollection.removeSearchTask(this.taskID2)).toBe(true);
		expect(this.SearchTaskCollection.searchTasks).toEqual([this.taskID1]);

		// Try to remove previous task again:
		expect(this.SearchTaskCollection.removeSearchTask(this.taskID2)).toBe(false);
		expect(this.SearchTaskCollection.searchTasks).toEqual([this.taskID1]);

		// Add in new task and try to remove previous task:
		expect(this.SearchTaskCollection.addSearchTask(this.taskID3)).toBe(2);
		expect(this.SearchTaskCollection.removeSearchTask(this.taskID1)).toBe(true);
		expect(this.SearchTaskCollection.searchTasks).toEqual([this.taskID3]);

	});

	it("tests exists", function() {
		expect(this.SearchTaskCollection.addSearchTask(this.taskID1)).toBe(1);
		expect(this.SearchTaskCollection.addSearchTask(this.taskID2)).toBe(2);

		// Check invalid task:
		expect(this.SearchTaskCollection.exists(this.taskID3)).toBe(false);
		
		// Check valid task:
		expect(this.SearchTaskCollection.exists(this.taskID1)).toBe(true);
		expect(this.SearchTaskCollection.exists(this.taskID2)).toBe(true);

	});

	xit("tests sync", function() {

	});

});