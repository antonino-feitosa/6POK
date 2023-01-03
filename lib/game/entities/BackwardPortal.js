
ig.module('game.entities.BackwardPortal')
.requires(
    'game.HexTrigger'
).defines(function () {

    EntityBackwardPortal = HexTrigger.extend({
        name: 'Backward-Portal',
        destination: null,

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/triggers/Portal.png', 64, 64),

        init: function (x, y, settings) {
            this.offset.x = (64 - this.size.x)/2;
            this.offset.y = (64 - this.size.y)/2;
            this.parent(x, y, settings);
            let seq = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].reverse();
            this.addAnim('idle', 1/16, seq);
        },

        triggerOnCollisionEnters: function (other) {
            ig.game.backLevel();
            ig.game.restorePlayerPosition(other.direction);
        }
    });
});
