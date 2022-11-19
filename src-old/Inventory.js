const {Array} = require("./Array");

class Inventory {

	constructor(){
		this.gold = 0;
		this.itens = [];
		this.slotToEquiped = new Map();
	}

	equip(item){
		if(this.itens.includes(item) && !this.slotToEquiped.has(item.slot)){
			this.slotToEquiped.set(item.slot, item);
		}
	}

	unequip(slot){
		let item = this.slotToEquiped.get(slot);
		if(item && !item.cursed){
			this.slotToEquiped.delete(slot);
		}
	}

	add(item){
		this.itens.push(item);
	}

	del(item){
		this.itens.removeId(item.id);
	}
}

exports.Inventory = Inventory;