
ig.module(
	'game.HexEntity'
)
	.requires(
		'game.HexGame',
		'impact.entity'
	)
	.defines(function () {

		// TODO moves

		HexEntity = ig.Entity.extend({
			size: { x: 64, y: 64 },
			flip: false,
			direction: Direction.FRONT,


			type: ig.Entity.TYPE.NONE,
			checkAgainst: ig.Entity.TYPE.NONE,
			collides: ig.Entity.COLLIDES.NEVER,

			update: function () {
			},

			update_moviment() {
				this.vel.x = this.vel.x.limit(-this.maxVel.x, this.maxVel.x);
				this.vel.y = this.vel.y.limit(-this.maxVel.y, this.maxVel.y);
				this.pos.x += this.vel.x * ig.system.tick;
				this.pos.y += this.vel.y * ig.system.tick;
			},

			update_animation() {
				if (this.currentAnim) {
					this.currentAnim.update();
				}
			},

			handle_colision: function (other) {
			},

			handle_map_colision: function () {
			},
		});
	});
