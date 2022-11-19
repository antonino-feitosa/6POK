
class Direction {

	static FRONT = new Direction('front', true);
	static FRONT_UP = new Direction('front_up', true);
	static FRONT_DOWN = new Direction('front_down', true);
	static BACK = new Direction('back', false, Direction.FRONT);
	static BACK_UP = new Direction('back_up', false, Direction.FRONT_DOWN);
	static BACK_DOWN = new Direction('back_down', false, Direction.FRONT_UP);

	#isFront = false;

	constructor(name, isfront, opposite) {
		this.name = name;
		this.#isFront = isfront;
		this.opposite = opposite;
	}

	get isFront() {
		return this.#isFront;
	}

	get isBack() {
		return !this.#isFront;
	}

	nextPosition(position){
		return position.clone();
	}
}

Direction.FRONT.opposite = Direction.BACK;
Direction.FRONT_UP.opposite = Direction.BACK_DOWN;
Direction.FRONT_DOWN.opposite = Direction.BACK_UP;

Direction.FRONT.nextPosition = function(position){
	let pos = position.clone();
	pos.x += 1;
	return pos;
}

Direction.FRONT_UP.nextPosition = function(position){
	let pos = position.clone();
	pos.x += position.y % 2 == 0 ? 1 : 0;
	pos.y -= 1;
	return pos;
}

Direction.FRONT_DOWN.nextPosition = function(position){
	let pos = position.clone();
	pos.x += position.y % 2 == 0 ? 1 : 0;
	pos.y += 1;
	return pos;
}

Direction.BACK.nextPosition = function(position){
	let pos = position.clone();
	pos.x -= 1;
	return pos;
}

Direction.BACK_UP.nextPosition = function(position){
	let pos = position.clone();
	pos.x -= position.y % 2 == 0 ? 0 : 1;
	pos.y -= 1;
	return pos;
}

Direction.BACK_DOWN.nextPosition = function(position){
	let pos = position.clone();
	pos.x -= position.y % 2 == 0 ? 0 : 1;
	pos.y += 1;
	return pos;
}

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

class MatrixSparse {

	#rows = new Map();

	get(row, col) {
		if (this.#rows.has(row)) {
			return this.#rows.get(row).get(col);
		}
		return null;
	}

	del(row, col) {
		if (this.#rows.has(row)) {
			this.#rows.get(row).delete(col);
		}
	}

	put(row, col, value) {
		if (!this.#rows.has(row)) {
			this.#rows.set(row, new Map());
		}
		this.#rows.get(row).set(col, value);
	}

	has(row, col) {
		if (!this.#rows.has(row)) {
			return this.#rows.get(row).has(col);
		}
		return false;
	}

	*entries() {
		for (let [row, vet] of this.#rows.entries()) {
			for (let [col, val] of vet.entries()) {
				yield [row, col, val];
			}
		}
	}

	*keys() {
		for (let [row, vet] of this.#rows.entries()) {
			for (let col of vet.keys()) {
				yield [row, col];
			}
		}
	}

	*values() {
		for (let vet of this.#rows.values()) {
			for (let value of vet.values()) {
				yield value;
			}
		}
	}

	clone() {
		let mat = new MatrixSparse();
		for (let [row, col, val] of this.entries()) {
			mat.put(row, col, val);
		}
		return mat;
	}
}

class Cell {
	entity = null;
	obstacle = false;
	visible = true;
	position = null;
}

class Arena {

	#matrix = new MatrixSparse();

	static width = 13 + 6;
	static height = 13;

	constructor() {
		for (let row = 0; row < Arena.height; row++) {
			for (let col = 0; col < Arena.width; col++) {
				let cell = new Cell();
				cell.position = new Position(col, row);
				this.#matrix.put(row, col, cell);

				let half = Math.floor(Arena.height/2);
				let rowdiff = Math.abs(half - row) / 2;
				if(col < rowdiff || Arena.width - col <= rowdiff){
					cell.obstacle = true;
					cell.visible = false;
				}
			}
		}

	}

	show(){
		for (let row = 0; row < Arena.height; row++) {
			let line = '';
			line += row % 2 == 0 ? '  ' : '';
			for (let col = 0; col < Arena.width; col++) {
				let cell = this.#matrix.get(row,col);
				if(cell.visible){
					if(cell.obstacle){
						line += ' # '
					} else {
						line += ' . ';
					}
				} else {
					line += '   ';
				}
				line += ' ';
			}
			line += row % 2 != 0 ? '  ': '';
			console.log(line);
		}
	}
}

class Animal {

	hp = 0;
	speed = 0;
	atk = 0;
	def = 0;
	satk = 0;
	sdef = 0;

	level = 1;

	type = null;
}


arena = new Arena();
arena.show();
