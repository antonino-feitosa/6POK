
ig.module(
	'game.HexEntity'
)
	.requires(
		'game.HexGame',
		'impact.entity'
	)
	.defines(function () {

		ActionMove = ig.Class.extend({

			init: function(entity, moves = 10.0){
				this.moves = moves;
				this.entity = entity;
				this.running = true;
				if(ig.game.isMoveFree(entity)){
					this.lastPosition = {x: this.entity.pos.x, y: this.entity.pos.y};
					this.destination = this.entity.nextPosition();
					this.inc = {x: 0, y: 0};
					this.inc.x = (this.destination.x - this.entity.pos.x) / this.moves;
					this.inc.y = (this.destination.y - this.entity.pos.y) / this.moves;
				} else {
					this.running = false;
				}
			},

			update: function(){
				if(this.running){
					if(this.moves > 0){
						this.entity.pos.x += this.inc.x;
						this.entity.pos.y += this.inc.y;
						this.moves -= 1;
						return true;
					} else {
						ig.game.move(this.entity, this.lastPosition, this.destination);
						this.running = false;
					}
				}
				return false;
			}
		});

		HexEntity = ig.Entity.extend({
			size: { x: 64, y: 64 },
			flip: false,
			direction: Direction.FRONT,

			type: ig.Entity.TYPE.NONE,
			checkAgainst: ig.Entity.TYPE.NONE,
			collides: ig.Entity.COLLIDES.NEVER,

			process: function(){
				return false;
			},

			triggerProcess: function () {
				if(this.action != null){
					if(this.action.update()){
						return true;
					} else {
						this.action = null;
					}
				} else {
					return this.process();
				}
				return false;
			},

			update() {
				this.vel.x = this.vel.x.limit(-this.maxVel.x, this.maxVel.x);
				this.vel.y = this.vel.y.limit(-this.maxVel.y, this.maxVel.y);
				this.pos.x += this.vel.x * ig.system.tick;
				this.pos.y += this.vel.y * ig.system.tick;
				if (this.currentAnim) {
					this.currentAnim.update();
				}
			},

			handle_colision: function (other) {
			},

			handle_map_colision: function () {
			},

			nextPosition(){
				return ig.game.nextPosition(this);
			},

			move(){
				this.action = new ActionMove(this);
				return true;
			}
		});
	});
