
ig.module('game.entities.Grass')
.requires(
    'game.HexTrigger'
).defines(function () {

    EntityGrass = HexTrigger.extend({
        name: 'Grass',

        _wmDrawBox: true,
        _wmBoxColor: '#00FF00',

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/effects/Grass.png', 192, 160),
        animSheetBG: new ig.AnimationSheet('media/effects/Grass-bg.png', 192, 160),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.offset.x = (192 - this.size.x)/2;
            this.offset.y = (160 - this.size.y)/2;
            this.animFG = new ig.Animation( this.animSheet, 0.1, [0] );
            this.animBG = new ig.Animation( this.animSheetBG, 0.1, [0] );
            this.currentAnim = this.animFG;
        },
        
        triggerOnCollisionEnters(ent){
            this.currentAnim = this.animBG;
        },

        triggerOnCollisionLeaves(ent){
            this.currentAnim = this.animFG;
        },
    });
});
