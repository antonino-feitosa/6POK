class Border {

	static LEFT = new Border('left');
	static RIGHT = new Border('right', Border.LEFT);
	static UP = new Border('up');
	static DOWN = new Border('down', Border.UP);

	name = 'border';
	opposite = null;

	constructor(name, opposite) {
		this.name = name;
		this.opposite = opposite;
	}
}

Border.LEFT.opposite = Border.RIGHT;
Border.UP.opposite = Border.DOWN;

exports.Border = Border;
