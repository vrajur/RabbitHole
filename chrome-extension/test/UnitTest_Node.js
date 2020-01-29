import { Node, NodeVisit } from '../js/Node.js';


describe("Node Test Suite", function() {

	beforeEach(() => {
		this.Node = new Node();
	});

	it("test the constructor", () => {
		expect(this.Node).not.toBe(undefined);
		expect(this.Node._nodeId).toBe(null);
		expect(this.Node._url).toBe(null);
		expect(this.Node._previousNodeVisit).toBe(null);
		expect(this.Node._isStarred).toBe(null);
	});

	it("test node initialization", async () => {
		await this.Node.initialize("test.com");
		const nodeVisit = new NodeVisit();
		await nodeVisit.initialize('db1d6d78-ee38-43cf-b508-cf466e2d3934');

		expect(this.Node._nodeId).toBe('9377bc40-90ea-4ff3-a697-e80c4c64d7a9');
		expect(this.Node._url).toBe("test.com");
		expect(this.Node._isStarred).toBe(false);
		expect(this.Node._previousNodeVisit).toEqual(nodeVisit);
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

	it("test node visit initialization", async () => {
		await this.NodeVisit.initialize('db1d6d78-ee38-43cf-b508-cf466e2d3934');
		expect(this.NodeVisit._nodeId).toBe('9377bc40-90ea-4ff3-a697-e80c4c64d7a9');
		expect(this.NodeVisit._nodeVisitId).toBe('db1d6d78-ee38-43cf-b508-cf466e2d3934');
		expect(this.NodeVisit._timestamp).toBe('2020-01-25T00:55:52.265Z');
		// expect(this.NodeVisit._timestamp).toBe('2020-01-24 19:55:52.265825');
	});

});