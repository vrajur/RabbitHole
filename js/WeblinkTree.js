import TreeNode from "./TreeNode.js";

export default class WeblinkTree extends TreeNode {

	constructor(url) {
		super({url: url});

		this.markups = {
			isStarred: false,
			highlights: null
		}
	}

	toggleIsStarred() {
		this.markups.isStarred = !this.markups.isStarred;
		return this.markups.isStarred;
	}

	get isStarred() {
		return this.markups.isStarred;
	}

	set isStarred(val) {
		this.markups.isStarred = val;
		return this.markups.isStarred;
	}
	
}