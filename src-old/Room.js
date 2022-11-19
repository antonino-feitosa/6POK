const { Array } = require("./Array");
const { Border } = require("./Border");
const { Cell } = require("./Cell");
const { MatrixSparse } = require("./MatrixSparse");
const { Position } = require("./Position");
const { Region } = require("./Region");
const { Door } = require("./Door");

class Room {

	#left_down = new Position();
	#right_up = new Position();

	constructor() {
		this.doors = [];
		this.map = new MatrixSparse();
	}

	get position() {
		return new Position(this.#left_down.x, this.#right_up.y);
	}

	get region() {
		return new Region(this.#left_down.x, this.#left_down.y, this.#right_up.x + 1, this.#right_up.y + 1);
	}

	get dimension() {
		return this.region.dimension;
	}

	translate(x, y) {
		this.#left_down.add(new Position(x, y));
		this.#right_up.add(new Position(x, y));
		let oldMap = this.map;
		this.map = new MatrixSparse();
		for (let [row, col, val] of oldMap.entries()) {
			this.putCell(row + y, col + x, val);
		}
	}

	clone() {
		let room = new Room();
		for (let [row, col, val] of this.map.entries()) {
			let cell = val.clone();
			room.putCell(row, col, cell);
		}
		for (let door of this.doors) {
			let [row, col] = this.findPositionById(door.id);
			let cell = room.getCell(row, col);
			cell.trigger = null;
		}
		room.doors = [];
		for (let door of this.doors) {
			room.addDoor(door.border, door.index);
		}
		return room;
	}

	getCell(row, col) {
		return this.map.get(row, col);
	}

	hasCell(row, col) {
		return this.map.get(row, col) != null;
	}

	delCell(row, col) {
		return this.map.del(row, col);
	}

	putCell(row, col, cell) {
		if (row < this.#left_down.y) {
			this.#left_down.y = row;
		}
		if (row > this.#right_up.y) {
			this.#right_up.y = row;
		}
		if (col < this.#left_down.x) {
			this.#left_down.x = col;
		}
		if (col > this.#right_up.x) {
			this.#right_up.x = col;
		}
		this.map.put(row, col, cell);
	}

	fillRegion(region) {
		for (let row = region.y1; row < region.y2; row++) {
			for (let col = region.x1; col < region.x2; col++) {
				let cell = new Cell();
				this.putCell(row, col, cell);
			}
		}
	}

	findPositionById(id) {
		for (let [row, col, cell] of this.map.entries()) {
			if (cell.entity && cell.entity.id === id) {
				return [row, col];
			}
			if (cell.trigger && cell.trigger.id === id) {
				return [row, col];
			}
		}
		return [null, null];
	}

	findPosition(predicate) {
		for (let [row, col, cell] of this.map.entries()) {
			if (predicate(cell)) {
				return [row, col];
			}
		}
		return [null, null];
	}

	set fog(enable) {
		for (let cell of this.map.values()) {
			cell.isVisible = !enable;
		}
	}

	removeDoor(door) {
		let [row, col] = this.findPositionById(door.id);
		let cell = this.getCell(row, col);
		cell.trigger = null;
		this.doors.removeId(door.id);
	}

	addDoor(border, index) {
		let position = null;
		switch (border) {
			case Border.LEFT: position = new Position(0, index); break;
			case Border.RIGHT: position = new Position(this.dimension.width - 1, index); break;
			case Border.UP: position = new Position(index, 0); break;
			case Border.DOWN: position = new Position(index, this.dimension.height - 1); break;
			default: console.assert(false, 'Unknow border ' + border);
		}
		let cell = this.getCell(position.y, position.x);
		if (cell && cell.trigger == null) {
			let door = new Door(this, cell, border);
			door.index = index;
			cell.trigger = door;
			cell.canMove = false;
			cell.isWall = false;
			this.doors.push(door);
			return true;
		}
		return false;
	}

	removeBorder(border, room) {
		for (let door of this.doors.filter(door => door.border === border)) {
			this.removeDoor(door);
		}
		this.doors = this.doors.filter(door => door.border !== border);
		let region = this.region;
		switch (border) {
			case Border.LEFT:
				for (let row = region.y1; row < region.y2; row++) {
					if (room.hasCell(row, region.x1))
						this.delCell(row, region.x1);
				}
				break;
			case Border.RIGHT:
				for (let row = region.y1; row < region.y2; row++) {
					if (room.hasCell(row, region.x2 - 1))
						this.delCell(row, region.x2 - 1);
				}
				break;
			case Border.UP:
				for (let col = region.x1; col < region.x2; col++) {
					if (room.hasCell(region.y1, col))
						this.delCell(region.y1, col);
				}
				break;
			case Border.DOWN:
				for (let col = region.x1; col < region.x2; col++) {
					if (room.hasCell(region.y2 - 1, col))
						this.delCell(region.y2 - 1, col);
				}
				break;
		}
	}
}

exports.Room = Room;
