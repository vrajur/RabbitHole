
export default class Utilties {

	static uuidv4() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	    return v.toString(16);
	  });
	}


	static randomInt(min, max, n) {
		min = min || 0;
		max = max || 1;

		n = n || 1;

		let output = [];

		for (let ii = 0; ii < n; ii++) {
			let val = (max-min) * Math.random() + min 
			output.push(Math.floor(val));
		}

		if (n == 1) {
			return output[0];
		}
		else {
			return output;
		}
	}
}


