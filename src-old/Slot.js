class Slot {

	static HEAD = new Slot('Head');
	static CHEST = new Slot('Chest');
	static SHOULDER = new Slot('Shoulder');
	static FEET = new Slot('Feet');
	static LEGS = new Slot('Legs');
	static BRACERS = new Slot('Bracers');
	static WRIST = new Slot('Wrist');
	static NECK = new Slot('Neck');

	static MAIN_HAND = new Slot('Main Hand');
	static OFF_HAND = new Slot('Off Hand');

	static BACK = new Slot('Back');
	static RING1 = new Slot('Ring1');
	static RING2 = new Slot('Ring2');
	static TRINKET1 = new Slot('Trinket1');
	static TRINKET2 = new Slot('Trinket2');

	constructor(name) {
		this.name = name;
	}
}
