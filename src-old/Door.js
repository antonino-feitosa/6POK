const { Trigger } = require("./Trigger");

class Door extends Trigger {

	#isOpen = false;
	#room = null;

	constructor(room, cell, border) {
		super();
		this.cell = cell;
		this.border = border;
		this.#room = room;
	}

	get isOpen() {
		return this.#isOpen;
	}

	set isOpen(open) {
		this.#isOpen = open;
		this.cell.canMove = open;
		if (open && !this.#room.fog) {
			this.#room.fog = false;
		}
	}

	set room(other){
		this.#room = other;
	}

	show() {
		return this.#isOpen ? '+' : '#';
	}

	clone() {
		let door = new Door(this.#room, this.cell, this.border);
		return door;
	}

	event_activate(entity){
		this.isOpen = !this.isOpen;
	}
}

exports.Door = Door;
