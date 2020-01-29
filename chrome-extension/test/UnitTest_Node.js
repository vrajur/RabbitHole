import { Node, NodeVisit } from '../js/Node.js';


describe("Node Test Suite", function() {

	beforeEach(() => {
		this.Node = new Node();
	});

	it("test the constructor", () => {
		expect(this.Node).not.toBe(undefined);
		expect(this.Node._nodeId).toBe(null);
		expect(this.Node._url).toBe(null);
		expect(this.Node._currentNodeVisit).toBe(null);
		expect(this.Node._isStarred).toBe(null);
	});

	it("test node initialization from existing node", async () => {
		await this.Node.initialize("test.com");

		expect(this.Node._nodeId).toBe('9377bc40-90ea-4ff3-a697-e80c4c64d7a9');
		expect(this.Node._url).toBe("test.com");
		expect(this.Node._isStarred).toBe(false);
		expect(this.Node._currentNodeVisit._nodeId).toBe(this.Node._nodeId);
		expect(this.Node._currentNodeVisit._nodeVisitId).toEqual(jasmine.stringMatching(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i));
	});

	it("test node getters and setters", async () => {
		await this.Node.initialize("test.com");

		expect(this.Node.isStarred).toBe(false);
		await this.Node.setIsStarred(true);
		expect(this.Node.isStarred).toBe(true);
		await this.Node.setIsStarred(false);
		expect(this.Node.isStarred).toBe(false);
	});

	it("test state retrieval from database", async () => {
		await this.Node.initialize("things.com");
		await this.Node.setIsStarred(true);

		const testNode = new Node();
		expect(testNode.isStarred).toBe(null);
		await testNode.initialize("things.com");
		expect(testNode.isStarred).toBe(true);

	});


});


describe("NodeVisit Test Suite", function() {

	beforeEach(() => {
		this.NodeVisit = new NodeVisit();
	});

	it("test the constructor", () => {
		expect(this.NodeVisit).not.toBe(undefined);
		expect(this.NodeVisit._nodeId).toBe(null);
		expect(this.NodeVisit._nodeVisitId).toBe(null);
		expect(this.NodeVisit._timestamp).toBe(null);
	});

	it("test valid node visit initialization", async () => {
		await this.NodeVisit.initialize('9377bc40-90ea-4ff3-a697-e80c4c64d7a9');
		expect(this.NodeVisit._nodeId).toBe('9377bc40-90ea-4ff3-a697-e80c4c64d7a9');
		expect(this.NodeVisit._nodeVisitId).toEqual(jasmine.stringMatching(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i));
		expect(Math.abs(new Date(this.NodeVisit._timestamp)-Date.now())).toBeLessThan(500);
	});

});