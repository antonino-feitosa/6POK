class Entity {

	static #countId = 0;

	#id = null;
	#isVisible = true;

	constructor() {
		this.#id = Entity.#countId++;
		this.labels = [];
	}

	get isVisible() {
		return this.#isVisible;
	}

	set isVisible(enable) {
		this.#isVisible = enable;
	}

	get id() {
		return this.#id;
	}

	clone() {
		return null;
	}

	show() {
		return ' ';
	}

	process() {
	}

	handle_collision(other_entity) {
	}

	handle_wall_collision(nextPosition) {
	}
}
exports.Entity = Entity;
