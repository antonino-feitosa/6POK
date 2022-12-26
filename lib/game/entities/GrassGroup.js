
ig.module('game.entities.GrassGroup')
.requires(
    'game.entities.Grass'
).defines(function () {

    EntityGrassGroup = EntityGrass.extend({
        name: 'Grass-Group',
        size: { x: 128, y: 128 },
        hasPlayer: false,

        animSheetFG: new ig.AnimationSheet('media/effects/Grass-group-fg.png', 320, 256),
        animSheetBG: new ig.AnimationSheet('media/effects/Grass-group-bg.png', 320, 256),

        showGroup: function(enable = true){
            this.entities.filter(ent => !ent.isPlayer).forEach(ent => ent.hidden = !enable);
        },

        triggerOnCollisionEnters(ent){
            if(ent.isPlayer){
                this.hasPlayer = true;
                this.currentAnim = this.animBG;
                this.showGroup(true);
            } else if(!this.hasPlayer) {
                ent.hidden = true;
            }
        },

        triggerOnCollisionStays(ent){
            if(!ent.isPlayer){
                ent.hidden = !this.hasPlayer;
            }
        },        

        triggerOnCollisionLeaves(ent){
            if(ent.isPlayer){
                this.hasPlayer = false;
                this.currentAnim = this.animFG;
                this.showGroup(false);
                
            } else {
                ent.hidden = false;
            }
        }
    });
});
