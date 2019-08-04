

export default class SearchTaskCollection {

	constructor() {
		this.searchTasks = [];
	}

	addSearchTask(searchTaskUUID) {
		return this.searchTasks.push(searchTaskUUID);
	}

	removeSearchTask(searchTaskUUID) {
		let idx = this.searchTasks.indexOf(searchTaskUUID);
		if (idx > -1) {
			this.searchTasks.splice(idx, 1);
			return true;
		}
		else {
			return false;
		}
	}

	exists(searchTaskUUID) {
		return this.searchTasks.includes(searchTaskUUID);
	}

	sync() {
		console.warn("Test this");
		debugger;
	}

}