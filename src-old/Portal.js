const { Trigger } = require("./Trigger");

class Portal extends Trigger {

	#isNext;
	#char;

	constructor(game, isNext){
		this.game = game;
		this.#isNext = isNext;
		this.#char = isNext ? ' %v' : ' %^';
	}

	event_over(entity){
		if(entity && entity.labels.includes('player')){
			if(this.#isNext){
				game.nextMap();
			} else {
				game.previousMap();
			}
		}
	}

	show(){
		return this.#char;
	}
}

exports.Portal = Portal;
