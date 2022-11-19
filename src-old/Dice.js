const { Random } = require("./Random");

class Dice {

	static rand = new Random('seed');

	static D4 = new Dice(4, 3);
	static D6 = new Dice(6, 4);
	static D8 = new Dice(8, 6);
	static D10 = new Dice(10, 7);
	static D12 = new Dice(12, 8);
	static D20 = new Dice(20, 14);
	static D100 = new Dice(100, 75);

	constructor(maximum, min_hit_points){
		this.maximum = maximum;
		this.min_hit_points = min_hit_points;
	}

	roll(){
		return 1 + Dice.rand.nextInt(this.maximum);
	}

	static rollAbilityScore(){
		let sum = 0;
		let min = 6;
		for(let i=0;i<4;i++){
			let roll = Dice.D6.roll();
			sum += roll;
			if(roll < min){
				min = roll;
			}
		}
		return sum - min;
	}
}
