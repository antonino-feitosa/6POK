
ig.module('game.entities.Animal')
.requires(
    'game.HexEntity'
).defines(function () {

    EntityAnimal = HexEntity.extend({
        name: 'animal',

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/Adax.png', 64, 64),

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('stub', 0.1, [0]);
        },

        process: function () {
			return false;
        },

        handle_colision: function (other) {
            console.log("Collision with " + other.name);
        }
    });
});
