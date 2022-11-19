
ig.module('game.attacks.melee')
.requires('plugins.powers.unit')
.defines(function(){
    EntityMelee = EntityUnit.extend({
        
        name: 'melee',
        damage: 8,

        offset: {x: -24, y:-24},
        collides: ig.Entity.COLLIDES.OVERLAP,
        animSheet: new ig.AnimationSheet('media/Effect - Bullet.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            vel = 0.1;
            this.addAnim('shoot', vel, [0, 1, 2, 3], true);
            this.addAnim('hit', vel, [4, 5, 6, 7], true);
            this.waitForAnimation(this.kill);
        },

        handle_colision: function (other) {
            if(!this.processed){
                this.processed = true;
                if(other && 'receiveDamage' in other){
                    other.receiveDamage(this.damage, this);
                    this.currentAnim = this.anims.hit.rewind();
                }
            }
        },
    });
});
