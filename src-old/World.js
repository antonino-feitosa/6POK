const { Array } = require("./Array");
const { Border } = require("./Border");
const { Cell } = require("./Cell");
const { Random } = require("./Random");
const { Region } = require("./Region");
const { Room } = require("./Room");

class World extends Room {

	constructor(seed, enable_fog = false) {
		super();
		this.enable_fog = enable_fog;
		this.rand = new Random(seed);
		this.inactive = [];
		this.startPosition = null;
		this.rooms = [];
	}

	canCopyAtPosition(room, row, col) {
		let empty = true;
		for (let [y, x] of room.map.keys()) {
			if (this.getCell(row + y, col + x)) {
				empty = false;
			}
		}
		return empty;
	}

	copyAtPosition(room, row, col) {
		room.translate(col, row);
		for (let [row, col, val] of room.map.entries()) {
			this.putCell(row, col, val);
		}
	}

	copyAtBorderPosition(room, row, col, border) {
		switch (border) {
			case Border.LEFT: col++; break;
			case Border.RIGHT: col--; break;
			case Border.UP: row++; break;
			case Border.DOWN: row--; break;
		}
		room.translate(col, row);
		room.removeBorder(border.opposite, this);
		for (let [row, col, val] of room.map.entries()) {
			this.putCell(row, col, val);
		}
	}

	getRelativePosition(source_door, room, dest_door) {
		let [row, col] = this.findPositionById(source_door.id);
		if (row == null || col == null) {
			return [null, null];
		}
		let [r, c] = room.findPositionById(dest_door.id);
		let dim = room.dimension;
		switch (source_door.border) {
			case Border.RIGHT: return [row - r, col + 1];
			case Border.LEFT: return [row - r, col - dim.width];
			case Border.UP: return [row - dim.height, col - c];
			case Border.DOWN: return [row + 1, col - c];
		}
		return [null, null];
	}

	createRandomRoom(maxDim = 10, maxDoors = 8, minDim = 6, minDoors = 2) {
		let width = this.rand.nextRange(minDim, maxDim);
		let height = this.rand.nextRange(minDim, maxDim);
		let room = new Room();
		room.fillRegion(new Region(1, 1, width, height));
		for (let i = 1; i < width - 1; i++) {
			room.putCell(0, i, new Cell(true));
			room.putCell(height - 1, i, new Cell(true));
		}
		for (let i = 0; i < height; i++) {
			room.putCell(i, 0, new Cell(true));
			room.putCell(i, width - 1, new Cell(true));
		}

		let borders = [Border.RIGHT, Border.UP, Border.LEFT, Border.DOWN, Border.RIGHT, Border.UP, Border.LEFT, Border.DOWN];
		borders.shuffle(this.rand);
		let num_doors = this.rand.nextRange(minDoors, maxDoors);
		for (let i = 0; i < num_doors; i++) {
			let border = borders[i % 8];
			let isHorDoor = border === Border.LEFT || border == Border.RIGHT;
			let index = this.rand.nextRange(2, (isHorDoor ? height : width) - 2);
			room.addDoor(border, index);
		}
		return room;
	}

	addRoom(room) {
		room = room.clone();
		room.fog = this.enable_fog;
		this.inactive.shuffle(this.rand);
		for (let source_door of this.inactive) {
			let opposite = room.doors.filter(door => door.border === source_door.border.opposite);
			opposite.shuffle(this.rand);
			for (let dest_door of opposite) {
				let [row, col] = this.getRelativePosition(source_door, room, dest_door);
				if (this.canCopyAtPosition(room, row, col)) {
					this.copyAtBorderPosition(room, row, col, source_door.border);
					source_door.room = room;
					this.inactive.removeId(source_door.id);
					room.doors.removeId(dest_door.id);
					this.inactive = this.inactive.concat(room.doors);
					return true;
				}
			}
		}
		return false;
	}

	generate(num_rooms = 3, maxDim = 10, maxDoors = 6, minDim = 7, minDoors = 2) {
		let room = this.createRandomRoom(maxDim, maxDoors, 7, maxDoors + 1);
		this.rooms.push(room);
		this.copyAtPosition(room, 0, 0);
		this.inactive = room.doors;
		let tries = 5;
		while (this.rooms.length < num_rooms && tries > 0) {
			let room = this.createRandomRoom(maxDim, maxDoors, minDim, minDoors);
			if (this.addRoom(room)) {
				this.rooms.push(room);
				tries = 5;
			} else {
				tries--;
			}
		}
		this.finish();
	}

	finish() {
		// first room: add up stairs
		// last room: add down stais
		for (let door of this.inactive) {
			let cell = door.cell;
			cell.trigger = null;
			cell.isWall = true;
		}
	}

	canMoveTo(row, col) {
		let cell = this.getCell(row, col);
		return cell && cell.canMove;
	}

	spaceChar(region, row, col){
		let cell = this.getCell(row,col);
		if(cell && col + 1 < region.x2){
			let next = this.getCell(row, col + 1);
			if(next){
				if(cell.isWall && next.isWall && cell.isVisible && next.isVisible){
					return Cell.WALL_SHOW;
				}
			}
		}
		return ' ';
	}

	getAdjacents(row, col){
		let n = {};
		n.up = this.getCell(row - 1, col);
		n.down = this.getCell(row + 1, col);
		n.left = this.getCell(row, col - 1);
		n.right = this.getCell(row, col + 1);
		n.isLeftWall = n.left && n.left.isWall && n.left.isVisible;
		n.isRightWall = n.right && n.right.isWall && n.right.isVisible;
		n.isUpWall = n.up && n.up.isWall && n.up.isVisible;
		n.isDownWall = n.down && n.down.isWall && n.down.isVisible;
		return n;
	}

	showWall(row, col, cell){
		let n = this.getAdjacents(row, col);
		if(n.isLeftWall || n.isRightWall){
			return Cell.WALL_SHOW.repeat(3);
		} else if(n.isUpWall || n.isDownWall){
			return row % 2 == 0 ? Cell.WALL_SHOW + '  ' : '  ' + Cell.WALL_SHOW;
		} else {
			return cell.show();
		}
	}

	show(region){
		for (let row = region.y1; row < region.y2; row++) {
			let line = '';
			line += row % 2 == 0 ? '  ' : '';
			for (let col = region.x1; col < region.x2; col++) {
				let cell = this.getCell(row,col);
				if(cell){
					let c = cell.isWall ? this.showWall(row, col, cell) : cell.show();
					line += c.length === 3 ? c : ' ' + c + ' ';
				} else {
					line += '   ';
				}
				line += this.spaceChar(region, row, col);
			}
			line += row % 2 != 0 ? '  ': '';
			console.log(line);
		}
	}
}

exports.World = World;
