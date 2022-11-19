class ItemType {

	static WEAPON = new ItemType('Weapon');
	static ARMOR = new ItemType('Armor');
	static GEM = new ItemType('Gem');
	static SCROLL = new ItemType('Scroll');
	static POTION = new ItemType('Potion');
	static ITEM = new ItemType('Item');

	constructor(name) {
		this.name = name;
	}
}

exports.ItemType = ItemType;