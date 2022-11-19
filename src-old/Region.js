const { Dimension } = require("./Dimension");

class Region {

	constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	get dimension() {
		return new Dimension(this.x2 - this.x1, this.y2 - this.y1);
	}

	clone(){
		return new Region(this.x1, this.y1, this.x2, this.y2);
	}
}

exports.Region = Region;
