
ig.module('game.entities.Obstacle')
.requires(
    'game.HexEntity'
).defines(function () {

    EntityObstacle = HexEntity.extend({
        name: 'Obstacle',
        isCollisionMode: true,
        isTurnMode: false,
        zIndex: 2,

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/effects/obstacle.png', 192, 160),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.offset.x = (this.animSheet.width - this.size.x)/2;
            this.offset.y = (this.animSheet.height - this.size.y)/2;
            this.addAnim('idle', 0.1, [0]);
        },

        process: function () {
        },

        openDialog(text, options){
            ig.game.openDialog(this, text, options);
        },

        onDialogResponse(responseIndex, responseText){
        },

        handle_colision: function (other) {
        }
    });
});
