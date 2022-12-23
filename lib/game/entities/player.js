
ig.module('game.entities.Player')
.requires(
    'game.HexEntity',
    'game.TextBalloon'
).defines(function () {

    EntityPlayer = HexEntity.extend({
        name: 'Player',

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/animals/Adax.png', 64, 64),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            var vel = 0.1;
            this.addAnim('stub', vel, [0]);
        },

        process: function () {
			if (ig.input.pressed('right')) {
                let toMove = this.direction.isFront();
				this.direction = Direction.FRONT;
				this.currentAnim.flip.x = false;
				return toMove ? this.move() : false;
			} else if (ig.input.pressed('left')) {
                let toMove = this.direction.isBack();
				this.direction = Direction.BACK;
				this.currentAnim.flip.x = true;
				return toMove ? this.move() : false;
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
			} else if(ig.input.pressed('interact')){
                ig.game.spawnEntity(TextBalloon, this.pos.x, this.pos.y, {text:'test'});
            }
			return true;
        },

        handle_colision: function (other) {
            console.log("Player collision with " + other.name);
        }
    });
});
