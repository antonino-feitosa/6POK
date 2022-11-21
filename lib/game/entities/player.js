
ig.module('game.entities.player')
    .requires('game.HexEntity')
    .defines(function () {

		

        EntityPlayer = HexEntity.extend({
            name: 'player',

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.ACTIVE,

            animSheet: new ig.AnimationSheet('media/Adax.png', 64, 64),

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                var vel = 0.1;
                this.addAnim('stub', vel, [0]);
            },

            process: function () {
				if (ig.input.pressed('right')) {
					this.direction = Direction.FRONT;
					this.currentAnim.flip.x = false;
					return this.move();
				} else if (ig.input.pressed('left')) {
					this.direction = Direction.BACK;
					this.currentAnim.flip.x = true;
					return this.move();
				} else if (ig.input.pressed('up')) {
					if(this.direction.isFront()){
						this.direction = Direction.FRONT_UP;
						return this.move();
					} else {
						this.direction = Direction.BACK_UP;
						return this.move();
					}
				} else if (ig.input.pressed('down')) {
					if(this.direction.isFront()){
						this.direction = Direction.FRONT_DOWN;
						return this.move();
					} else {
						this.direction = Direction.BACK_DOWN;
						return this.move();
					}
				}
				return true;
            },

            handle_colision: function (other) {
                console.log("Player collision with " + other.name);
            }
        });
    });
