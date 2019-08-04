// Import Class:
import TreeNode from "../js/TreeNode.js";
import Utilities from "../js/Utilities.js";

describe("TreeNode Test Suite", function() {

	beforeEach(function() {

		this.nodeUUID1 = Utilities.uuidv4();
		this.nodeUUID2 = Utilities.uuidv4();
		this.nodeUUID3 = Utilities.uuidv4();

		this.url = "https://example.com/";

		this.TreeNode = new TreeNode({url: this.url});
	});

	it("tests the constructor", function() {
		expect(this.TreeNode).not.toBe(undefined);
		expect(this.TreeNode.UUID.length).toBe(36);
		expect(this.TreeNode.url).toEqual(this.url);

		expect(this.TreeNode.childNodes).toEqual([]);
		expect(this.TreeNode.childQueue).toEqual([]);

		expect(this.TreeNode.prevNode).toBe(null);
		expect(this.TreeNode.nextNode).toBe(null);

		expect(this.TreeNode.metadata.date instanceof Date).toBe(true);
		expect(this.TreeNode.metadata.location).toBe(null);

		let SearchTreeNull;
		setTimeout(() => {
			SearchTreeNull = new TreeNode();
			expect(SearchTreeNull.metadata.date instanceof Date).toBe(true);
			expect(this.TreeNode.metadata.date < SearchTreeNull.metadata.date).toBe(true);
		}, 500);
	});

	
	it("tests addTreeNode", function() {
		expect(this.TreeNode.addTreeNode(this.nodeUUID1)).toBe(1);
		expect(this.TreeNode.addTreeNode(this.nodeUUID2)).toBe(2);
		expect(this.TreeNode.addTreeNode(this.nodeUUID3)).toBe(3);

		expect(this.TreeNode.childNodes).toEqual([this.nodeUUID1, this.nodeUUID2, this.nodeUUID3]);
	});
	
	it("tests removeTreeNode", function() {
		expect(this.TreeNode.addTreeNode(this.nodeUUID1)).toBe(1);
		expect(this.TreeNode.addTreeNode(this.nodeUUID2)).toBe(2);
		
		// Try to remove invalid UUID:
		expect(this.TreeNode.removeTreeNode(this.nodeUUID3)).toBe(false);
		expect(this.TreeNode.childNodes).toEqual([this.nodeUUID1, this.nodeUUID2]);

		// Try to remove valid UUID:
		expect(this.TreeNode.removeTreeNode(this.nodeUUID1)).toBe(true);
		expect(this.TreeNode.childNodes).toEqual([this.nodeUUID2]);

		// Try to remove previously removed UUID:
		expect(this.TreeNode.removeTreeNode(this.nodeUUID1)).toBe(false);
		expect(this.TreeNode.childNodes).toEqual([this.nodeUUID2]);
	});
	
	it("tests isChild", function() {
		expect(this.TreeNode.addTreeNode(this.nodeUUID1)).toBe(1);
		expect(this.TreeNode.addTreeNode(this.nodeUUID2)).toBe(2);
		
		// Check invalid UUID:
		expect(this.TreeNode.isChild(this.nodeUUID3)).toBe(false);

		// Check valid UUID:
		expect(this.TreeNode.isChild(this.nodeUUID1)).toBe(true);
		expect(this.TreeNode.isChild(this.nodeUUID2)).toBe(true);
	});

	it("tests queueTreeNode", function() {
		expect(this.TreeNode.queueTreeNode(this.nodeUUID1)).toBe(1);
		expect(this.TreeNode.queueTreeNode(this.nodeUUID2)).toBe(2);
		expect(this.TreeNode.queueTreeNode(this.nodeUUID3)).toBe(3);

		expect(this.TreeNode.childQueue).toEqual([this.nodeUUID1, this.nodeUUID2, this.nodeUUID3]);
	});
	
	it("tests removeFromQueue", function() {
		expect(this.TreeNode.queueTreeNode(this.nodeUUID1)).toBe(1);
		expect(this.TreeNode.queueTreeNode(this.nodeUUID2)).toBe(2);
		
		// Try to remove invalid UUID:
		expect(this.TreeNode.removeFromQueue(this.nodeUUID3)).toBe(false);
		expect(this.TreeNode.childQueue).toEqual([this.nodeUUID1, this.nodeUUID2]);

		// Try to remove valid UUID:
		expect(this.TreeNode.removeFromQueue(this.nodeUUID1)).toBe(true);
		expect(this.TreeNode.childQueue).toEqual([this.nodeUUID2]);

		// Try to remove previously removed UUID:
		expect(this.TreeNode.removeFromQueue(this.nodeUUID1)).toBe(false);
		expect(this.TreeNode.childQueue).toEqual([this.nodeUUID2]);
	});
	
	it("tests dequeueTreeNode", function() {
		expect(this.TreeNode.queueTreeNode(this.nodeUUID1)).toBe(1);
		expect(this.TreeNode.addTreeNode(this.nodeUUID2)).toBe(1);
		
		// Try to dequeue invalid UUIDs:
		expect(this.TreeNode.dequeueTreeNode(this.nodeUUID3)).toBe(false);
		expect(this.TreeNode.childQueue).toEqual([this.nodeUUID1]);
		expect(this.TreeNode.childNodes).toEqual([this.nodeUUID2]);

		// Try to dequeue already added UUID:
		expect(this.TreeNode.dequeueTreeNode(this.nodeUUID2)).toBe(false);
		expect(this.TreeNode.childQueue).toEqual([this.nodeUUID1]);
		expect(this.TreeNode.childNodes).toEqual([this.nodeUUID2]);

		// Try to dequeue queued UUID:
		expect(this.TreeNode.dequeueTreeNode(this.nodeUUID1)).toBe(true);
		expect(this.TreeNode.childQueue).toEqual([]);
		expect(this.TreeNode.childNodes).toEqual([this.nodeUUID2, this.nodeUUID1]);

	});
	
	it("tests isQueued", function() {
		expect(this.TreeNode.queueTreeNode(this.nodeUUID1)).toBe(1);
		expect(this.TreeNode.queueTreeNode(this.nodeUUID2)).toBe(2);
		
		// Check invalid UUID:
		expect(this.TreeNode.isQueued(this.nodeUUID3)).toBe(false);

		// Check valid UUID:
		expect(this.TreeNode.isQueued(this.nodeUUID1)).toBe(true);
		expect(this.TreeNode.isQueued(this.nodeUUID2)).toBe(true);
	});
	
	xit("tests sync", function() {
		
	});



});