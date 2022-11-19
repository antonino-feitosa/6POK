class Position {

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	add(position) {
		this.x += position.x;
		this.y += position.y;
	}

	sub(position) {
		this.x -= position.x;
		this.y -= position.y;
	}

	clone() {
		return new Position(this.x, this.y);
	}

	equals(obj) {
		if (obj && obj.x && obj.y) {
			return obj.x === this.x && obj.y === this.y;
		}
		return false;
	}
}
exports.Position = Position;
