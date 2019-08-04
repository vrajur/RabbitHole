
export const SearchTabState = Object.freeze({
	NONE: 0,
	ON_NEW_WEBLINK_PAGE : 1,
	ON_NEW_SEARCH_PAGE : 2,
	ON_OLD_WEBLINK_PAGE: 3,
	ON_OLD_SEARCH_PAGE: 4,
});

export default class Utilties {

	static uuidv4() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	    return v.toString(16);
	  });
	}
}


