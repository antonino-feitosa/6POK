class Dimension {

	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	clone() {
		return new Dimension(this.width, this.height);
	}

	hasPosition(position) {
		return position.x >= 0 && position.y >= 0 && position.x < this.width && position.y < this.height;
	}
}
exports.Dimension = Dimension;
