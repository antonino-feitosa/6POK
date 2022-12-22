
ig.module('game.entities.Portal')
.requires(
    'game.HexEntity'
).defines(function () {

    EntityPortal = HexEntity.extend({
        name: 'Portal',

        _wmDrawBox: true,
        _wmBoxColor: '#00FF00',
        destination: null,

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/Portal.png', 64, 64),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            let vel = 0.1;
            this.addAnim('anim', vel, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
        },

        handle_colision: function (other) {
            console.log('HERE!!!');
            ig.game.loadLevelDeferred(this.destination);
        }
    });
});
