const { Entity } = require("./Entity");

class Item extends Entity {

	constructor(name, type, usable = false, equippable = false, slot) {
		this.name = name;
		this.type = type;
		this.usable = usable;
		this.equippable = equippable;
		this.slot = slot;
		this.cursed = false;
	}

	apply(game, entity) {
	}

	applyCurse(game, entity) {
	}

	equip(game, entity, slot = 1) {
	}

	unequip(game, entity, slot = 1) {
	}
}

exports.Item = Item;
