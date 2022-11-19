const { Unit } = require("./Unit");

class Race extends Unit {

	size = 3;
	speed = 6;

	constructor(name, rand){
		this.name = name;
		this.rand = rand;
		this.str = 10;
		this.dex = 10;
		this.con = 10;
		this.int = 10;
		this.wis = 10;
		this.cha = 10;
	}

	set unit_class(uclass){
		this.unit_class = uclass;
		this.hit_point_maximum = unit_class.initialHitPoints() + this.modifier(this.con);
	}

	static modifier(value){
		return Math.floor((value - 10) / 2);
	}

	nextHitPoints(){
		let roll = Math.max(this.hit_point_dice.roll(rand), this.hit_point_dice.min_hit_points);
		return roll + Race.modifier(this.con);
	}
}
