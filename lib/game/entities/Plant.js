
ig.module('game.entities.Plant')
.requires(
    'game.HexTrigger'
).defines(function () {

    EntityPlant = HexTrigger.extend({
        name: 'Plant',

        _wmDrawBox: true,
        _wmBoxColor: '#00FF00',

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/effects/Plants.png', 32, 32),

        size: { x: 16, y: 16 },
        offset: { x: 24, y: 24},
        isCollisionMode: true,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.index = ig.game.rand ? ig.game.rand.nextInt(100) : 0;
            this.addAnim('idle', 1, [this.index]);
        },
        
        triggerOnInteract: function (ent) {
            ent.openDialog('Plant Variant ' + this.index);
            return false;
        }
    });
});
