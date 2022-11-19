const { Entity } = require("./Entity");

class Cell extends Entity {

	static WALL_SHOW = '\u2593';

	#canMove = true;

	constructor(isWall = false, ground = '.', wall = '\u2593') {
		super();
		this.isWall = isWall;
		this.ground = ground;
		this.wall = wall;
		this.isVisible = true;
		this.entity = null;
		this.trigger = null;
	}

	get canMove() {
		return this.#canMove && !this.isWall && this.entity === null;
	}

	set canMove(enable) {
		this.#canMove = enable;
	}

	clone() {
		let cell = new Cell();
		cell.#canMove = this.#canMove;
		cell.entity = this.entity ? this.entity.clone() : null;
		cell.trigger = this.trigger ? this.trigger.clone() : null;
		cell.ground = this.ground;
		cell.isWall = this.isWall;
		cell.wall = this.wall;
		cell.isVisible = this.isVisible;
		return cell;
	}

	show() {
		if (!this.isVisible) {
			return ' ';
		} else if (this.entity && this.entity.isVisible) {
			return this.entity.show();
		} else if (this.trigger && this.trigger.isVisible) {
			return this.trigger.show();
		} else if (this.isWall) {
			return this.wall;
		} else {
			return this.ground;
		}
	}
}

exports.Cell = Cell;
