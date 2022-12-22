
ig.module('game.entities.Portal')
.requires(
    'game.HexTrigger'
).defines(function () {

    EntityPortal = HexTrigger.extend({
        name: 'Portal',
        destination: null,

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/triggers/Portal.png', 64, 64),

        init: function (x, y, settings) {
            this.offset.x = (64 - this.size.x)/2;
            this.offset.y = (64 - this.size.y)/2;
            this.parent(x, y, settings);
            let vel = 1/16;
            this.addAnim('anim', vel, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
        },

        triggerOnCollisionEnters: function (other) {
            ig.game.loadLevelDeferred(this.destination);
        }
    });
});
