
ig.module('game.entities.Grass')
.requires(
    'game.HexTrigger'
).defines(function () {

    EntityGrass = HexTrigger.extend({
        name: 'Grass',

        _wmDrawBox: true,
        _wmBoxColor: '#00FF00',

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheetFG: new ig.AnimationSheet('media/effects/Grass-fg.png', 192, 160),
        animSheetBG: new ig.AnimationSheet('media/effects/Grass-bg.png', 192, 160),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.offset.x = (this.animSheetFG.width - this.size.x)/2;
            this.offset.y = (this.animSheetFG.height - this.size.y)/2;
            this.animFG = new ig.Animation( this.animSheetFG, 0.1, [0] );
            this.animBG = new ig.Animation( this.animSheetBG, 0.1, [0] );
            this.currentAnim = this.animFG;
        },
        
        triggerOnCollisionEnters(ent){
            if(ent.name !== 'Player'){
                ent.hidden = true;
            } else {
                this.currentAnim = this.animBG;
            }
        },

        triggerOnCollisionLeaves(ent){
            if(ent.name !== 'Player'){
                ent.hidden = false;
            } else {
                this.currentAnim = this.animFG;
            }
            
        },
    });
});
