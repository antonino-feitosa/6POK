const { Direction } = require("./Direction");
const { Unit } = require("./Unit");

class Player extends Unit {

	constructor(game, position) {
		super(game, position);
		this.labels.push('player');
	}

	process() {
		this.game.waitInput();
		switch (this.game.pressed.char) {
			case 'd': this.move(Direction.FRONT); break;
			case 'a': this.move(Direction.BACK); break;
			case 'w': this.move(this.direction.isFront ? Direction.FRONT_UP : Direction.BACK_UP); break;
			case 's': this.move(this.direction.isFront ? Direction.FRONT_DOWN : Direction.BACK_DOWN); break;
			case ' ': this.fire_trigger(); break;
		}
	}

	show() {
		return this.direction.isFront ? " @>" : "<@ ";
	}
}

exports.Player = Player;
