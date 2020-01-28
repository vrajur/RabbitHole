import StorageItem from "./StorageItem.js";

export default class SearchTaskCollection extends StorageItem {

	constructor() {
		super();
		this.searchTasks = new Set;
		this.Task2Tab = {};	// Key: TaskUUID, Value: Set([SearchTabUUID])
		this.Tab2Task = {};	// Key: SearchTabUUID, Value: TaskUUID
	}	

	addSearchTask(taskUUID) {
		this.searchTasks.add(taskUUID);
		return this.searchTasks.size;
	}

	removeSearchTask(taskUUID) {
		if (this.searchTasks.has(taskUUID)) {
			this.searchTasks.delete(taskUUID);
			return true;
		}
		else {
			return false;
		}
	}

	exists(taskUUID) {
		return this.searchTasks.has(taskUUID);
	}

	addTaskAssignment(taskUUID, searchTabUUID) {
		this.addSearchTask(taskUUID);

		this.Tab2Task[searchTabUUID] = taskUUID; // Overwriting tab's task assignment --> ok bc tab can only have on task assignment

		if (taskUUID in this.Task2Tab) {
			this.Task2Tab[taskUUID].add(searchTabUUID);
		}
		else {
			this.Task2Tab[taskUUID] = new Set([searchTabUUID]);
		}
	}

	getTaskAssignment(searchTabUUID) {

		if (searchTabUUID in this.Tab2Task) {
			return this.Tab2Task[searchTabUUID];
		} 
		else {
			return null;
		}

	}

	updateTaskAssignment() {}

	removeTaskAssignment() {}

	getAssignedTabs(taskUUID) {}

	sync(callback) {
		const tag = this.constructor.name;
		StorageItem.set(tag, this, callback);
	}

	static get(UUID, callback) {
		StorageItem.get(this.name, UUID, (res) => {
			const key = StorageItem.getKey(this.name, UUID);
			let obj = new this();
			obj = Object.assign(obj, res[key]);
			callback(obj);
		});
	} 

	static set(obj, callback) {
		if (obj.constructor.name != this.name) {
			console.error("Invalid object passed to subclassed StorageItem.set(): ", obj);
			return -1;
		}
		StorageItem.set(this.name, obj, callback);
	} 

}