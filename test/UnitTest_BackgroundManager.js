// Import Class:
import BackgroundManager from "../js/BackgroundManager.js";
import Utilities from "../js/Utilities.js";

describe("BackgroundManager Test Suite", function() {


	beforeEach(function() {

		this.tab0 = {id: Utilities.randomInt(1000), openerTabId: Utilities.randomInt(1000)}; 
		this.tab1 = {id: Utilities.randomInt(1000)};
		this.tab2 = {id: Utilities.randomInt(1000), openerTabId: this.tab1.id};
		

		this.BackgroundManager = new BackgroundManager();
	});

	it("tests the constructor", function() {
		expect(this.BackgroundManager).not.toBe(undefined);

		expect(this.BackgroundManager.SearchTabCollection).not.toBe(undefined);
		expect(this.BackgroundManager.SearchTaskCollection).not.toBe(undefined);
		expect(this.BackgroundManager.SearchTreeCollection).not.toBe(undefined);
		expect(this.BackgroundManager.WeblinkTreeCollection).not.toBe(undefined);


	});

	it("tests handleOnCreated", function () {

		function checkDebugOutput(debugOutput, searchTabCollection, searchTaskCollection, createdNewTask) {
			// Create SearchTab: 
			expect(searchTabCollection.getSearchTabUUID(debugOutput.chromeTabID)).toEqual(debugOutput.searchTab.UUID);
			expect(searchTabCollection.getChromeTabID(debugOutput.searchTab.UUID)).toEqual(debugOutput.chromeTabID);

			// Create SearchTask:
			expect(debugOutput.createdNewTask).toBe(createdNewTask);
			expect(debugOutput.currentSearchTaskAssignment).not.toBe(null);
		}

		function checkDebugOutput1(debugOutput, searchTabCollection, searchTaskCollection, createdNewTask=true) {
			
			checkDebugOutput(debugOutput, searchTabCollection, searchTaskCollection, true);

			// Create Tab/Task Association:
			const assignment = {};
			assignment[debugOutput.currentSearchTaskAssignmentUUID] = new Set([debugOutput.searchTab.UUID]);
			expect(searchTaskCollection.Task2Tab).toEqual(assignment);

			const revAssignment = {};
			revAssignment[debugOutput.searchTab.UUID] = debugOutput.currentSearchTaskAssignmentUUID;
			expect(searchTaskCollection.Tab2Task).toEqual(revAssignment);
		}

		function checkDebugOutput2(debugOutput, searchTabCollection, searchTaskCollection, prevDebugOutput, createdNewTask=true) {

			checkDebugOutput(debugOutput, searchTabCollection, searchTaskCollection, createdNewTask);

			// Create Tab/Task Association:
			const assignment = {};
			assignment[debugOutput.currentSearchTaskAssignmentUUID] = new Set([debugOutput.searchTab.UUID]);
			assignment[prevDebugOutput.currentSearchTaskAssignmentUUID] = new Set([prevDebugOutput.searchTab.UUID]);
			expect(searchTaskCollection.Task2Tab).toEqual(assignment);
		}

		function checkDebugOutput3(debugOutput, searchTabCollection, searchTaskCollection, prevDebugOutput1, prevDebugOutput2, createdNewTask=false) {

			checkDebugOutput(debugOutput, searchTabCollection, searchTaskCollection, createdNewTask);

			// Create Tab/Task Association:
			const assignment = {};
			assignment[prevDebugOutput1.currentSearchTaskAssignmentUUID] = new Set([prevDebugOutput1.searchTab.UUID]);
			assignment[prevDebugOutput2.currentSearchTaskAssignmentUUID] = new Set([prevDebugOutput2.searchTab.UUID]);
			assignment[debugOutput.currentSearchTaskAssignmentUUID].add(debugOutput.searchTab.UUID);
			expect(searchTaskCollection.Task2Tab).toEqual(assignment);

		}

		const debugOutput1 = this.BackgroundManager.handleOnCreated(this.tab0, true);
		const searchTabCollection1 = this.BackgroundManager.SearchTabCollection;
		const searchTaskCollection1 = this.BackgroundManager.SearchTaskCollection;
		checkDebugOutput1(debugOutput1, searchTabCollection1, searchTaskCollection1);

		const debugOutput2 = this.BackgroundManager.handleOnCreated(this.tab1, true);
		const searchTabCollection2 = this.BackgroundManager.SearchTabCollection;
		const searchTaskCollection2 = this.BackgroundManager.SearchTaskCollection;
		checkDebugOutput2(debugOutput2, searchTabCollection2, searchTaskCollection2, debugOutput1);
		
		const debugOutput3 = this.BackgroundManager.handleOnCreated(this.tab2, true);
		const searchTabCollection3 = this.BackgroundManager.SearchTabCollection;
		const searchTaskCollection3 = this.BackgroundManager.SearchTaskCollection;
		checkDebugOutput3(debugOutput3, searchTabCollection3, searchTaskCollection3, debugOutput1, debugOutput2);

	});



});