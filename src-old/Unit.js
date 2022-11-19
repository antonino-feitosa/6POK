const { Direction } = require("./Direction");
const { Entity } = require("./Entity");
const { Inventory } = require("./Inventory");
const { Position } = require("./Position");

class Unit extends Entity {

	#position;

	constructor(game, position = new Position(), direction = Direction.FRONT) {
		super();
		this.game = game;
		this.#position = position;
		this.direction = direction;
		this.invetory = new Inventory();
	}

	set position(pos) {
		this.#position.x = pos.x;
		this.#position.y = pos.y;
	}

	get position() {
		return this.#position;
	}

	equip(item){ // TODO
	}

	unequip(slot){

	}

	add(item){

	}

	drop(item){

	}

	apply(item, target){

	}

	move(direction) {
		if (this.changeDirection(direction)) {
			return;
		}
		let nextPosition = direction.nextPosition(this.position);
		this.game.move(this, nextPosition);
	}

	fire_trigger(){
		console.log(this.direction.name);
		let nextPosition = this.direction.nextPosition(this.position);
		this.game.fire_trigger(this, nextPosition);
	}

	changeDirection(direction) {
		if (direction.isFront !== this.direction.isFront) {
			this.direction = this.direction.opposite;
			return true;
		} else if(direction !== this.direction){
			this.direction = direction;
			return true;
		}
		return false;
	}
}
exports.Unit = Unit;
