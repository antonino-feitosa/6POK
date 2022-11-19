export class Direction {

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
