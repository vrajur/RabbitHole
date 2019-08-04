// Import Class:
import SearchTaskCollection from "../js/SearchTaskCollection.js";
import Utilities from "../js/Utilities.js";

describe("SearchTaskCollection Test Suite", function() {

	beforeEach(function() {
		this.taskID1 = Utilities.uuidv4();
		this.taskID2 = Utilities.uuidv4();
		this.taskID3 = Utilities.uuidv4();

		this.tabUUID1 = Utilities.uuidv4();
		this.tabUUID2 = Utilities.uuidv4();
		this.tabUUID3 = Utilities.uuidv4();

		this.SearchTaskCollection = new SearchTaskCollection();
	});

	it("tests the constructor", function() {
		expect(this.SearchTaskCollection).not.toBe(undefined);
		expect(this.SearchTaskCollection.searchTasks).toEqual(new Set());
	});

	it("tests addSearchTask", function() {
		expect(this.SearchTaskCollection.addSearchTask(this.taskID1)).toBe(1);
		expect(this.SearchTaskCollection.searchTasks).toEqual(new Set([this.taskID1]));
		
		expect(this.SearchTaskCollection.addSearchTask(this.taskID2)).toBe(2);
		expect(this.SearchTaskCollection.searchTasks).toEqual(new Set([this.taskID1, this.taskID2]));
	});

	it("tests removeSearchTask", function() {
		expect(this.SearchTaskCollection.addSearchTask(this.taskID1)).toBe(1);
		expect(this.SearchTaskCollection.addSearchTask(this.taskID2)).toBe(2);

		// Try to remove invalid task:
		expect(this.SearchTaskCollection.removeSearchTask(this.taskID3)).toBe(false);
		expect(this.SearchTaskCollection.searchTasks).toEqual(new Set([this.taskID1, this.taskID2]));

		// Try to remove valid task:
		expect(this.SearchTaskCollection.removeSearchTask(this.taskID2)).toBe(true);
		expect(this.SearchTaskCollection.searchTasks).toEqual(new Set([this.taskID1]));

		// Try to remove previous task again:
		expect(this.SearchTaskCollection.removeSearchTask(this.taskID2)).toBe(false);
		expect(this.SearchTaskCollection.searchTasks).toEqual(new Set([this.taskID1]));

		// Add in new task and try to remove previous task:
		expect(this.SearchTaskCollection.addSearchTask(this.taskID3)).toBe(2);
		expect(this.SearchTaskCollection.removeSearchTask(this.taskID1)).toBe(true);
		expect(this.SearchTaskCollection.searchTasks).toEqual(new Set([this.taskID3]));

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

	it("test addTaskAssignment", function() {
		const assignment1 = {};
		assignment1[this.taskID1] = new Set([this.tabUUID1]);

		const assignment2 = {}
		assignment2[this.taskID1] = new Set([this.tabUUID1]);
		assignment2[this.taskID2] = new Set([this.tabUUID2]);

		const assignment3 = {}
		assignment3[this.taskID1] = new Set([this.tabUUID1]);
		assignment3[this.taskID2] = new Set([this.tabUUID2]);
		assignment3[this.taskID1].add(this.tabUUID2);

		const revAssignment1 = {};
		revAssignment1[this.tabUUID1] = this.taskID1;

		const revAssignment2 = {};
		revAssignment2[this.tabUUID1] = this.taskID1;
		revAssignment2[this.tabUUID2] = this.taskID2;

		const revAssignment3 = {};
		revAssignment3[this.tabUUID1] = this.taskID1;
		revAssignment3[this.tabUUID2] = this.taskID1;	// Tab's Task Assignment has been overwritten

		this.SearchTaskCollection.addTaskAssignment(this.taskID1, this.tabUUID1);
		expect(this.SearchTaskCollection.Task2Tab).toEqual(assignment1);
		expect(this.SearchTaskCollection.Tab2Task).toEqual(revAssignment1);

		this.SearchTaskCollection.addTaskAssignment(this.taskID2, this.tabUUID2);
		expect(this.SearchTaskCollection.Task2Tab).toEqual(assignment2);
		expect(this.SearchTaskCollection.Tab2Task).toEqual(revAssignment2);

		this.SearchTaskCollection.addTaskAssignment(this.taskID1, this.tabUUID2);	// Tab's Task Assignment has been overwritten
		expect(this.SearchTaskCollection.Task2Tab).toEqual(assignment3);
		expect(this.SearchTaskCollection.Tab2Task).toEqual(revAssignment3);	


	});

	it("test getTaskAssignment", function() {
		this.SearchTaskCollection.addTaskAssignment(this.taskID1, this.tabUUID1);
		this.SearchTaskCollection.addTaskAssignment(this.taskID2, this.tabUUID2);

		// Check Valid Assignments:
		expect(this.SearchTaskCollection.getTaskAssignment(this.tabUUID1)).toEqual(this.taskID1);
		expect(this.SearchTaskCollection.getTaskAssignment(this.tabUUID2)).toEqual(this.taskID2);
		//Check invalid Assignment:
		expect(this.SearchTaskCollection.getTaskAssignment(this.tabUUID3)).toEqual(null);

		// Overwrite Assignment:
		this.SearchTaskCollection.addTaskAssignment(this.taskID1, this.tabUUID2);

		// Check Valid Assignments:
		expect(this.SearchTaskCollection.getTaskAssignment(this.tabUUID1)).toEqual(this.taskID1);
		expect(this.SearchTaskCollection.getTaskAssignment(this.tabUUID2)).toEqual(this.taskID1);
		//Check invalid Assignment:
		expect(this.SearchTaskCollection.getTaskAssignment(this.tabUUID3)).toEqual(null);
	});

	xit("test updateTaskAssignment", function() {

	});

	xit("test removeTaskAssignment", function() {

	});

	xit("test getAssignedTabs", function() {

	});

	// it("test removeTaskAssignment", function() {

	// });

	xit("tests sync", function() {

	});

});