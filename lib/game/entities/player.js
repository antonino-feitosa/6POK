
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
			return ig.game.processUserAction(this);
        },

        handle_colision: function (other) {
            console.log("Player collision with " + other.name);
        }
    });
});
