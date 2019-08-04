import TreeNode from "./TreeNode.js";
import Utilities from "./Utilities.js";
import { SearchTreeState } from "./Enums.js";


export default class SearchTree extends TreeNode {

	constructor(url, queryString = null) {
		super({url: url});
		this.queryString = queryString;
		this.state = SearchTreeState.IN_PROGRESS_INACTIVE;
	}

	addWeblinkTree(weblinkTreeUUID) {
		return this.childNodes.push(weblinkTreeUUID);
	}

	removeWeblinkTree(weblinkTreeUUID) {
		return this.removeTreeNode(weblinkTreeUUID);
	}

	visited(weblinkTreeUUID) {
		return this.isChild(weblinkTreeUUID);
	}

	queueWeblinkTree(weblinkTreeUUID) {
		return this.queueTreeNode(weblinkTreeUUID);
	}

	dequeueWeblinkTree(weblinkTreeUUID) {
		return this.dequeueTreeNode(weblinkTreeUUID);
	}
}