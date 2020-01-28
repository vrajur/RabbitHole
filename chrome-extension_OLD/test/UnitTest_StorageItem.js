import StorageItem from "../js/StorageItem.js";
import Utilities from "../js/Utilities.js";

describe("StorageItem Test Suite", function () {

	beforeEach(function() {
		chrome.storage.sync.clear();
		this.tag = Utilities.randomInt(1000);
		this.UUID = Utilities.uuidv4();
		this.obj = {UUID: this.UUID};
	});

	it("tests getKey", function() {
		let tag = Utilities.uuidv4();
		let UUID = Utilities.uuidv4();
		expect(StorageItem.getKey(tag, UUID)).toBe(tag+"_"+UUID);
	});

	it("tests get", function(done){
		const key = StorageItem.getKey(this.tag, this.obj.UUID);
		const obj = this.obj;

		// Set with Chrome:
		chrome.storage.sync.set({[key]: this.obj});

		// Get with Storage Item: 
		StorageItem.get(this.tag, this.UUID, (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key]).toEqual(obj);
				done();
			}
			catch (e) {
				done.fail(e);
			}
		});
	});

	it("tests set", function(done) {
		const key = StorageItem.getKey(this.tag, this.obj.UUID);
		const obj = this.obj;

		// Set with StorageItem:
		StorageItem.set(this.tag, obj);

		// Get with Chrome:
		chrome.storage.sync.get([key], (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key]).toEqual(obj);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});

	it("tests set and get", function(done) {
		const key = StorageItem.getKey(this.tag, this.obj.UUID);
		const obj = this.obj;

		StorageItem.set(this.tag, this.obj);
		StorageItem.get(this.tag, this.UUID, (res) => {
			try {
				expect(key in res).toBe(true);
				expect(res[key]).toEqual(obj);
				done();
			}
			catch (e) {
				done.fail(e)
			}
		});
	});
});


