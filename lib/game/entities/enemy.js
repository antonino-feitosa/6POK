
ig.module('game.entities.enemy')
.requires('plugins.powers.unitstub')
.defines(function(){
    EntityEnemy = EntityUnitStub.extend({
        name: 'enemy',

        type: ig.Entity.TYPE.ENEMY,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.STATIC,

        //animSheet: new ig.AnimationSheet('media/Unit - Circle.png', 64, 64),

        init: function(x, y, settings){
            this.parent(x, y, settings);

            /*this.addAnim('up', 1, [0]);
            this.addAnim('left', 1, [1]);
            this.addAnim('down', 1, [2]);
            this.addAnim('right', 1, [3]);*/
        },

        handle_colision : function(other){
            console.log("HUT!!!!");
        }
    });
});
