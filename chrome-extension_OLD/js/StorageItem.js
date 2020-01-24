export default class StorageItem {
	
	static getKey(tag, UUID) {
		return tag+"_"+UUID;
	}

	static set(tag, obj, callback) {
		if (tag === undefined) {
			console.error("StorageTag is undefined in set");
			return -1;
		}
		const key = StorageItem.getKey(tag, obj.UUID);
		console.log("Setting: ", key);
		chrome.storage.sync.set({
			[key]: obj
		}, callback);
	}

	static get(tag, UUID, callback) {
		if (tag === undefined) {
			console.error("StorageTag is undefined in get");
			return -1;
		}
		const key = StorageItem.getKey(tag, UUID);
		console.log("Looking for: ", key);
		chrome.storage.sync.get([key], callback);
	}


	// TODO Handle case when MAX_WRITES_PER_MIN is reached --> instead use local 

}
