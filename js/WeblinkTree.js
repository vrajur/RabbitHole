import Utilites from "./Utitlies.js";


export default class WeblinkTree {

	constructor(url) {
		this.UUID = Utitlies.uuidv4();
		this.url = url || null;

		this.prevWeblinkUUID = null;
		this.nextWeblinkUUID = null;

		this.weblinkTreeNodes = [];	

		this.metadata = {
			date: new Date(),
			location: null
		}
		this.markups = {
			isStarred: false,
			highlights: null
		}
	}

	


}