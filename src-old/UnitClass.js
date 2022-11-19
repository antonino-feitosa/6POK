
class UnitClass {

	constructor(name, hit_point_dice){
		this.name = name;
		this.hit_point_dice = hit_point_dice;
	}

	initialHitPoints(){
		return this.hit_point_dice.maximum;
	}

	initialInventory(unit){
		// fill
	}

	checkAbilities(str, dex, con, int, win, cha){
		return true;
	}
}
