

ig.module(
	'game.Direction'
)
.defines(function () {

	Direction = ig.Class.extend({

		_isFront: false,

		init: function (name, isfront, opposite) {
			this.name = name;
			this._isFront = isfront;
			this.opposite = opposite;
		},

		isFront: function () {
			return this._isFront;
		},

		isBack: function () {
			return !this._isFront;
		},

		nextPosition: function (position) {
			return position.clone();
		}
	});

	Direction.FRONT = new Direction('front', true);
	Direction.FRONT_UP = new Direction('front_up', true);
	Direction.FRONT_DOWN = new Direction('front_down', true);
	Direction.BACK = new Direction('back', false, Direction.FRONT);
	Direction.BACK_UP = new Direction('back_up', false, Direction.FRONT_DOWN);
	Direction.BACK_DOWN = new Direction('back_down', false, Direction.FRONT_UP);
    Direction.values = [Direction.FRONT, Direction.FRONT_UP, Direction.FRONT_DOWN, Direction.BACK, Direction.BACK_UP, Direction.BACK_DOWN];

	Direction.FRONT.opposite = Direction.BACK;
	Direction.FRONT_UP.opposite = Direction.BACK_DOWN;
	Direction.FRONT_DOWN.opposite = Direction.BACK_UP;

	Direction.FRONT.nextPosition = function (position) {
		let pos = {x: position.x, y: position.y};
		pos.x += 1;
		return pos;
	};

	Direction.FRONT_UP.nextPosition = function (position) {
		let pos = {x: position.x, y: position.y};
		pos.x += position.y % 2 == 0 ? 1 : 0;
		pos.y -= 1;
		return pos;
	};

	Direction.FRONT_DOWN.nextPosition = function (position) {
		let pos = {x: position.x, y: position.y};
		pos.x += position.y % 2 == 0 ? 1 : 0;
		pos.y += 1;
		return pos;
	};

	Direction.BACK.nextPosition = function (position) {
		let pos = {x: position.x, y: position.y};
		pos.x -= 1;
		return pos;
	};

	Direction.BACK_UP.nextPosition = function (position) {
		let pos = {x: position.x, y: position.y};
		pos.x -= position.y % 2 == 0 ? 0 : 1;
		pos.y -= 1;
		return pos;
	};

	Direction.BACK_DOWN.nextPosition = function (position) {
		let pos = {x: position.x, y: position.y};
		pos.x -= position.y % 2 == 0 ? 0 : 1;
		pos.y += 1;
		return pos;
	};
});
