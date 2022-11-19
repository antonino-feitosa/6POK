
ig.module('plugins.powers.hexUnit')
.requires(
    'impact.entity',
    'plugins.powers.hexEntity'
)
.defines(function () {
    HexUnit = HexEntity.extend({

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.ALL,
        collides: ig.Entity.COLLIDES.STATIC,
        direction: ig.Entity.DIRECTION.FRONT,
        
        moveFront: function(){
            this.waitForAction(new MoveTo(this, Side.Front));
        },

        moveFrontUp: function(){
            this.waitForAction(new MoveTo(this, Side.FrontUp));
        },

        moveFrontDown: function(){
            this.waitForAction(new MoveTo(this, Side.FrontDown));
        },

        moveBack: function(){
            this.waitForAction(new MoveTo(this, Side.Back));
        },

        moveBackUp: function(){
            this.waitForAction(new MoveTo(this, Side.BackUp));
        },

        moveBackDown: function(){
            this.waitForAction(new MoveTo(this, Side.BackDown));
        },

        nextTurn: function(){
            this._processed = this.numOfMoviments();
        },
    });
    
    ig.Entity.DIRECTION = {
        FRONT: 0b000,
        FRONTUP: 0b001,
        FRONTDOWN: 0b010,
        BACK: 0b111,
        BACKUP: 0b101,
        BACKDOWN: 0b110,

        isFront: function(dir){
            return ~(dir & 0b100);
        },

        ifBack: function(dir){
            return dir & 0b100;
        },

        opposite: function(dir){
            return (~dir) & 0b111;
        }
    };
});
